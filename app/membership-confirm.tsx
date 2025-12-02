import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { CurrencyDollarIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Constantes y Tipos ---

const mainCurrencies = [
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'VES', name: 'Bolívar Soberano', symbol: 'Bs.' },
  { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
  { code: 'BRL', name: 'Real Brasileño', symbol: 'R$' },
];

interface BranchItem {
  branch_id: string;
  name: string;
}

// Tipo para la respuesta de tasas
interface RateResponse {
  rate?: number;
  data?: { rate?: number };
}

export default function MembershipConfirmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mainItemId?: string;
    mainItemTitle?: string;
    mainItemPrice?: string;
    mainItemType?: string;
    startDate?: string;
    userId?: string;
    branchId?: string;
    packagesJson?: string;
  }>();

  const [processing, setProcessing] = useState(false);
  
  // Estados para Sucursales
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(params.branchId || '');
  const [loadingBranches, setLoadingBranches] = useState(true);

  // Estados para Moneda
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [loadingRate, setLoadingRate] = useState(false);

  // 1. Cargar Sucursales y Token inicial
  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await vitalFitApi.public.getBranchMap(token || '');
        
       
        const data = response.data || response || [];
        setBranches(data as BranchItem[]);

        if (!params.branchId && Array.isArray(data) && data.length > 0) {
            setSelectedBranchId(data[0].branch_id);
        }
      } catch (error) {
        console.error("Error cargando sucursales", error);
      } finally {
        setLoadingBranches(false);
      }
    };
    init();
  }, [params.branchId]);

  // 2. Efecto para cargar tasa de cambio
  useEffect(() => {
    const fetchRate = async () => {
      if (selectedCurrency === 'USD') {
        setExchangeRate(1);
        return;
      }

      setLoadingRate(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await vitalFitApi.client.get({
            url: `/billing/rates/${selectedCurrency}`,
            jwt: token || undefined
        }) as RateResponse | number; // Casteo manual
        
        // Manejo seguro del tipo de respuesta
        let rate = 1;
        if (typeof response === 'number') {
            rate = response;
        } else if (response && typeof response === 'object' && 'rate' in response && typeof response.rate === 'number') {
            rate = response.rate;
        } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data.rate === 'number') {
            rate = response.data.rate;
        }

        if (rate) {
            setExchangeRate(rate);
        } else {
            console.warn("Formato de tasa desconocido", response);
            setExchangeRate(1);
        }
      } catch (error) {
        console.error("Error obteniendo tasa:", error);
        Alert.alert("Aviso", `No se pudo obtener la tasa para ${selectedCurrency}. Se usará referencia USD.`);
        setExchangeRate(1);
        setSelectedCurrency('USD');
      } finally {
        setLoadingRate(false);
      }
    };

    fetchRate();
  }, [selectedCurrency]);

  const selectedPackages = useMemo(() => {
    try {
      return params.packagesJson ? JSON.parse(params.packagesJson) : [];
    } catch { return []; }
  }, [params.packagesJson]);

  const mainPriceUSD = parseFloat(params.mainItemPrice || '0');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const packagesTotalUSD = selectedPackages.reduce((sum: number, pkg: any) => sum + (pkg.price || 0), 0);
  const grandTotalUSD = mainPriceUSD + packagesTotalUSD;
  const grandTotalConverted = grandTotalUSD * exchangeRate;

  // Variable usada en el render
  const selectedBranchName = branches.find(b => b.branch_id === selectedBranchId)?.name || 'Seleccionar';

  const handleConfirmOrder = async () => {
    if (!selectedBranchId) {
        Alert.alert("Atención", "Por favor selecciona una sucursal.");
        return;
    }

    setProcessing(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Sesión no válida');

      const invoiceItems = [];
      if (params.mainItemId) {
        invoiceItems.push({
          item_id: params.mainItemId,
          item_type: params.mainItemType || 'membership',
          quantity: 1,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      selectedPackages.forEach((pkg: any) => {
        const pkgId = pkg.packageId || pkg.package_id;
        if (pkgId) {
          invoiceItems.push({ item_id: pkgId, item_type: 'package', quantity: 1 });
        }
      });

      const invoiceResponse = await vitalFitApi.billing.createInvoice({
        branch_id: selectedBranchId,
        user_id: params.userId || null,
        items: invoiceItems
      }, token);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = invoiceResponse as any;
      const invoiceId = responseData.invoice_id || responseData.id || responseData.data?.invoice_id;

      if (!invoiceId) throw new Error('No se recibió ID de factura');

      router.push({
        pathname: '/membership-payment',
        params: {
          invoiceId: invoiceId,
          totalAmount: grandTotalConverted.toFixed(2), 
          currency: selectedCurrency,                  
          title: params.mainItemTitle,
          branchId: selectedBranchId
        }
      } as never);

    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('Error', msg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-8 pb-32">
        
        {/* Header Pasos */}
        <View className='mb-8'>
          <ThemedText lightColor='#f97316' darkColor='#f97316' className='text-4xl mb-4 text-center' style={{ fontFamily: 'BebasNeue-Regular' }}>
            RESUMEN
          </ThemedText>
          <View className='flex-row justify-between items-center mb-4'>
            <View className='items-center flex-1'>
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 border bg-white border-neutral-400'>
                <ThemedText className='text-[10px] font-semibold text-gray-800'>1</ThemedText>
              </View>
              <ThemedText className='text-[11px] text-center text-gray-800'>Opciones</ThemedText>
            </View>
            <View className='items-center flex-1'>
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 border bg-white border-neutral-400'>
                <ThemedText className='text-[10px] font-semibold text-gray-800'>2</ThemedText>
              </View>
              <ThemedText className='text-[11px] text-center text-gray-800'>Extras</ThemedText>
            </View>
            <View className='items-center flex-1'>
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 border bg-orange-500 border-orange-500'>
                <ThemedText className='text-[10px] font-semibold text-white'>3</ThemedText>
              </View>
              <ThemedText className='text-[11px] text-center text-orange-600 font-bold'>Confirmación</ThemedText>
            </View>
          </View>
        </View>

        {/* Sección: Configuración */}
        <ThemedText className="text-xl font-bold mb-4">Configuración</ThemedText>

        {/* Selector de Sucursal */}
        <View className="mb-4">
            <ThemedText className="text-xs text-gray-500 font-bold uppercase mb-2">SUCURSAL</ThemedText>
            {loadingBranches ? (
                <ActivityIndicator size="small" color="#f97316" />
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-1">
                    {branches.map((branch) => {
                        const bId = branch.branch_id;
                        const isSelected = selectedBranchId === bId;
                        return (
                            <TouchableOpacity
                                key={bId}
                                onPress={() => setSelectedBranchId(bId)}
                                className={`mr-3 px-4 py-2 rounded-lg border flex-row items-center ${
                                    isSelected ? 'bg-orange-50 border-orange-500' : 'bg-white border-neutral-200'
                                }`}
                            >
                                <MapPinIcon size={14} color={isSelected ? '#f97316' : '#9ca3af'} />
                                <ThemedText className={`ml-2 text-sm font-bold ${isSelected ? 'text-orange-800' : 'text-gray-600'}`}>
                                    {branch.name}
                                </ThemedText>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            )}
        </View>

        {/* Selector de Moneda */}
        <View className="mb-6">
            <ThemedText className="text-xs text-gray-500 font-bold uppercase mb-2">MONEDA DE PAGO</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-1">
                {mainCurrencies.map((currency) => {
                    const isSelected = selectedCurrency === currency.code;
                    return (
                        <TouchableOpacity
                            key={currency.code}
                            onPress={() => setSelectedCurrency(currency.code)}
                            disabled={loadingRate}
                            className={`mr-3 px-4 py-2 rounded-lg border flex-row items-center ${
                                isSelected ? 'bg-blue-50 border-blue-500' : 'bg-white border-neutral-200'
                            }`}
                        >
                            <CurrencyDollarIcon size={14} color={isSelected ? '#3b82f6' : '#9ca3af'} />
                            <ThemedText className={`ml-2 text-sm font-bold ${isSelected ? 'text-blue-800' : 'text-gray-600'}`}>
                                {currency.code}
                            </ThemedText>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>

        {/* Detalle de Costos */}
        <View className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 mb-6">
            <ThemedText className="text-xs text-orange-500 font-bold tracking-widest uppercase mb-3">DETALLE (USD)</ThemedText>
            
            <View className="flex-row justify-between mb-2">
                <ThemedText className="text-neutral-700">{params.mainItemTitle}</ThemedText>
                <ThemedText className="font-bold text-neutral-900">${mainPriceUSD.toFixed(2)}</ThemedText>
            </View>
            
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {selectedPackages.map((pkg: any, index: number) => (
                <View key={index} className="flex-row justify-between mb-2">
                    <ThemedText className="text-neutral-600 text-sm flex-1 mr-2">+ {pkg.name}</ThemedText>
                    <ThemedText className="font-bold text-neutral-800 text-sm">${pkg.price?.toFixed(2)}</ThemedText>
                </View>
            ))}

            <View className="h-[1px] bg-neutral-200 my-2" />
            
            <View className="flex-row justify-between items-center">
                <ThemedText className="font-bold text-neutral-500">Subtotal USD</ThemedText>
                <ThemedText className="font-bold text-lg text-neutral-900">${grandTotalUSD.toFixed(2)}</ThemedText>
            </View>
        </View>

        {/* Sección Total Final */}
        <View className="mt-2 border-t border-neutral-100 pt-4 mb-8">
            <View className="flex-row justify-between items-end">
                <View>
                    <ThemedText className="text-xl text-neutral-500">Total a pagar</ThemedText>
                    {selectedCurrency !== 'USD' && (
                        <ThemedText className="text-xs text-gray-400 mt-1">
                            Tasa aprox: {exchangeRate.toFixed(4)}
                        </ThemedText>
                    )}
                    <ThemedText className="text-xs text-gray-400 mt-1">Sede: {selectedBranchName}</ThemedText>
                </View>
                
                <View className="items-end">
                    {loadingRate ? (
                        <ActivityIndicator size="small" color="#f97316" />
                    ) : (
                        <>
                            <ThemedText className="text-4xl font-extrabold text-orange-600" style={{ fontFamily: 'BebasNeue-Regular' }}>
                                {selectedCurrency === 'USD' ? '$' : ''}{grandTotalConverted.toFixed(2)}
                            </ThemedText>
                            <ThemedText className="text-sm font-bold text-gray-500">{selectedCurrency}</ThemedText>
                        </>
                    )}
                </View>
            </View>
        </View>

        {/* Botón Acción */}
        {processing ? (
            <View className="items-center py-4">
                <ActivityIndicator size="large" color="#f97316" />
                <ThemedText className="text-xs text-gray-400 mt-2">Generando orden...</ThemedText>
            </View>
        ) : (
            <PrimaryButton 
                title="Confirmar y Pagar" 
                onPress={handleConfirmOrder} 
                disabled={loadingRate}
            />
        )}

      </ScrollView>
    </SafeAreaView>
  );
}