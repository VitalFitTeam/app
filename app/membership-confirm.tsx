import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { CurrencyDollarIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BranchItem {
  branch_id: string;
  name: string;
}

import { mainCurrencies } from '@/app/constants/billing';

const SUPPORTED_CURRENCY_CODES = [
    'USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 
    'VES', 'BRL', 'MXN', 'ARS', 'COP', 'CLP', 'PEN',        
    'INR', 'RUB'                                             
];

const CURRENCIES = mainCurrencies
    .filter(c => SUPPORTED_CURRENCY_CODES.includes(c.code))
    .map(c => ({
        name: c.code,
        symbol: c.symbol,
        label: `${c.code} - ${c.name}`
    }));

const FALLBACK_RATES: Record<string, number> = {
  'USD': 1,
  'EUR': 0.95,
  'VES': 60.00, 
};

export default function MembershipConfirmScreen() {
  const { t } = useTranslation();
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

  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(params.branchId || '');
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [branchModalVisible, setBranchModalVisible] = useState(false);

  const [currency, setCurrency] = useState('USD');
  const [rate, setRate] = useState(1);
  const [loadingRate, setLoadingRate] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  // Estado para el impuesto (valor decimal directo del API, ej: 0.21)
  const [taxRate, setTaxRate] = useState<number>(0);
  const [loadingTax, setLoadingTax] = useState(false);

  const selectedCurrencySymbol = CURRENCIES.find(c => c.name === currency)?.symbol || '$';
  const selectedBranchName = branches.find(b => b.branch_id === selectedBranchId)?.name || t('confirm.selectBranch');

  // Convierte 0.21 -> "21%"
  const formatTaxRate = (decimalRate: number): string => {
    const percentage = Math.round(decimalRate * 100);
    return `${percentage}%`;
  };

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

  useEffect(() => {
    const fetchRate = async () => {
      if (currency === 'USD') {
        setRate(1);
        return;
      }

      setLoadingRate(true);
      try {
        const token = await AsyncStorage.getItem('token');
        
        console.log(`[Debug] Solicitando tasa para ${currency}...`);
        const response = await vitalFitApi.client.get({
          url: `/billing/rates/${currency}`,
          jwt: token || '',
        });

        let fetchedRate = 1;
        //Wilder puta
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyResponse = response as any;

        if (typeof anyResponse === 'number') {
            fetchedRate = anyResponse;
        } else if (anyResponse?.[currency]) {
            fetchedRate = anyResponse[currency];
        } else if (anyResponse?.rate) {
            fetchedRate = anyResponse.rate;
        } else if (anyResponse?.data?.rate) {
            fetchedRate = anyResponse.data.rate;
        }
        
        if (!fetchedRate || fetchedRate === 0) throw new Error("Tasa inválida (0 o null)");

        setRate(fetchedRate);

      } catch (error) {
        console.error(`[Error] Falló obtención de tasa para ${currency}:`, error);
        const fallback = FALLBACK_RATES[currency] || 1;
        if (fallback !== 1) setRate(fallback);
        else setRate(1);
      } finally {
        setLoadingRate(false);
      }
    };

    fetchRate();
  }, [currency]);

  useEffect(() => {
    const fetchTax = async () => {
      if (!selectedBranchId) return;

      setLoadingTax(true);
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        console.log('[DEBUG] Solicitando impuesto para Branch ID:', selectedBranchId);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await (vitalFitApi.billing as any).getTaxRateByBranch(token, selectedBranchId);
        
        console.log('[DEBUG] Respuesta Impuesto RAW:', response);

        let extractedRate = 0;

        if (typeof response === 'number') {
            extractedRate = response;
        } else if (typeof response === 'string') {
            extractedRate = parseFloat(response);
        } else if (typeof response === 'object' && response !== null) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const r = response as any;
            
            // AQUI ESTABA EL ERROR: Ahora buscamos explícitamente 'tax_rate'
            if (r.tax_rate !== undefined && r.tax_rate !== null) extractedRate = Number(r.tax_rate);
            else if (r.rate !== undefined && r.rate !== null) extractedRate = Number(r.rate);
            else if (r.value !== undefined && r.value !== null) extractedRate = Number(r.value);
            else if (r.data?.tax_rate !== undefined) extractedRate = Number(r.data.tax_rate);
            else if (r.data?.rate !== undefined) extractedRate = Number(r.data.rate);
        }

        console.log('[DEBUG] Tasa extraída (decimal):', extractedRate);
        
        if (!isNaN(extractedRate)) {
            setTaxRate(extractedRate);
        } else {
            setTaxRate(0);
        }
        
      } catch (error) {
        console.error("Error fetching tax rate", error);
        setTaxRate(0);
      } finally {
        setLoadingTax(false);
      }
    };

    fetchTax();
  }, [selectedBranchId]);

  const selectedPackages = useMemo(() => {
    try {
      return params.packagesJson ? JSON.parse(params.packagesJson) : [];
    } catch { return []; }
  }, [params.packagesJson]);

  const mainPriceUSD = parseFloat(params.mainItemPrice || '0');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const packagesTotalUSD = selectedPackages.reduce((sum: number, pkg: any) => sum + (pkg.price || 0), 0);
  
  const subTotalUSD = mainPriceUSD + packagesTotalUSD;
  
  // Cálculo: 100 * 0.21 = 21
  const taxAmountUSD = subTotalUSD * taxRate;
  
  const grandTotalUSD = subTotalUSD + taxAmountUSD;

  const grandTotalConverted = grandTotalUSD * rate;

  const [existingInvoiceId, setExistingInvoiceId] = useState<string | null>(null);

  const handleConfirmOrder = async () => {
    if (!selectedBranchId) {
      Alert.alert(t('common.attention'), t('confirm.alert.selectBranch'));
      return;
    }

    setProcessing(true);
    try {
      if (existingInvoiceId) {
        navigateToPayment(existingInvoiceId);
        return;
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error(t('confirm.error.invalidSession'));

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
        items: invoiceItems,
      }, token);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = invoiceResponse as any;
      const invoiceId = responseData.invoice_id || responseData.id || responseData.data?.invoice_id;

      if (!invoiceId) throw new Error(t('confirm.error.invoiceIdMissing'));

      setExistingInvoiceId(invoiceId);
      navigateToPayment(invoiceId);

    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : t('common.error.unknown');
      Alert.alert(t('common.error.title'), msg);
    } finally {
      setProcessing(false);
    }
  };

  const navigateToPayment = (invoiceId: string) => {
    router.replace({
      pathname: '/membership-payment',
      params: {
        invoiceId: invoiceId,
        totalAmount: grandTotalConverted.toFixed(2), 
        currency: currency, 
        title: params.mainItemTitle,
        branchId: selectedBranchId
      }
    } as never);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="flex-1 px-6 pt-8" 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >

        <View className='mb-8'>
          <ThemedText lightColor='#f97316' darkColor='#f97316' className='text-4xl mb-4 text-center' style={{ fontFamily: 'BebasNeue-Regular' }}>
            {t('confirm.title')}
          </ThemedText>
          <View className='flex-row justify-between items-center mb-4'>
            <View className='items-center flex-1'>
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 border bg-white border-neutral-400'>
                <ThemedText className='text-[10px] font-semibold text-gray-800'>1</ThemedText>
              </View>
              <ThemedText className='text-[11px] text-center text-gray-800'>{t('checkout.steps.options')}</ThemedText>
            </View>
            <View className='items-center flex-1'>
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 border bg-white border-neutral-400'>
                <ThemedText className='text-[10px] font-semibold text-gray-800'>2</ThemedText>
              </View>
              <ThemedText className='text-[11px] text-center text-gray-800'>{t('checkout.steps.extras')}</ThemedText>
            </View>
            <View className='items-center flex-1'>
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 border bg-orange-500 border-orange-500'>
                <ThemedText className='text-[10px] font-semibold text-white'>3</ThemedText>
              </View>
              <ThemedText className='text-[11px] text-center text-orange-600 font-bold'>{t('checkout.steps.confirmation')}</ThemedText>
            </View>
          </View>
        </View>

        <ThemedText className="text-xl font-bold mb-4">{t('confirm.paymentConfig')}</ThemedText>

        <View className="mb-4">
          <ThemedText className="text-xs text-gray-500 font-bold uppercase mb-2">{t('confirm.branch')}</ThemedText>
          {loadingBranches ? (
            <ActivityIndicator size="small" color="#f97316" />
          ) : (
            <>
              <TouchableOpacity 
                onPress={() => setBranchModalVisible(true)}
                className="flex-row items-center justify-between border border-gray-300 rounded-xl p-4 bg-white"
              >
                <View className="flex-row items-center">
                    <MapPinIcon size={20} color="#f97316" />
                    <ThemedText className="ml-3 font-bold text-lg text-gray-800">
                        {selectedBranchName}
                    </ThemedText>
                </View>
                <ThemedText className="text-gray-400">▼</ThemedText>
              </TouchableOpacity>

              <Modal
                transparent={true}
                visible={branchModalVisible}
                animationType="fade"
                onRequestClose={() => setBranchModalVisible(false)}
              >
                <TouchableOpacity 
                    className="flex-1 bg-black/50 justify-center items-center px-6"
                    activeOpacity={1}
                    onPress={() => setBranchModalVisible(false)}
                >
                    <View className="bg-white w-full rounded-2xl overflow-hidden p-4 max-h-[500px]">
                        <ThemedText className="font-bold text-lg mb-4 text-center">{t('confirm.selectBranch')}</ThemedText>
                        <ScrollView>
                          {branches.map((branch) => {
                            const isSelected = selectedBranchId === branch.branch_id;
                            return (
                              <TouchableOpacity
                                key={branch.branch_id}
                                onPress={() => {
                                  setSelectedBranchId(branch.branch_id);
                                  setBranchModalVisible(false);
                                }}
                                className={`p-4 border-b border-gray-100 flex-row justify-between items-center ${
                                    isSelected ? 'bg-orange-50' : ''
                                }`}
                              >
                                <ThemedText className="font-bold">{branch.name}</ThemedText>
                                {isSelected && (
                                    <ThemedText className="text-orange-500 font-bold">✓</ThemedText>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
              </Modal>
            </>
          )}
        </View>

        <View className="mb-6">
            <ThemedText className="text-xs text-gray-500 font-bold uppercase mb-2">{t('confirm.currency')}</ThemedText>
            <TouchableOpacity 
                onPress={() => setCurrencyModalVisible(true)}
                className="flex-row items-center justify-between border border-gray-300 rounded-xl p-4 bg-white"
            >
                <View className="flex-row items-center">
                    <CurrencyDollarIcon size={20} color="#f97316" />
                    <ThemedText className="ml-3 font-bold text-lg text-gray-800">
                        {currency} ({selectedCurrencySymbol})
                    </ThemedText>
                </View>
                <ThemedText className="text-gray-400">▼</ThemedText>
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={currencyModalVisible}
                animationType="fade"
                onRequestClose={() => setCurrencyModalVisible(false)}
            >
                <TouchableOpacity 
                    className="flex-1 bg-black/50 justify-center items-center px-6"
                    activeOpacity={1}
                    onPress={() => setCurrencyModalVisible(false)}
                >
                    <View className="bg-white w-full rounded-2xl overflow-hidden p-4 max-h-[500px]">
                        <ThemedText className="font-bold text-lg mb-4 text-center">{t('confirm.selectCurrency')}</ThemedText>
                        <ScrollView>
                          {CURRENCIES.map((curr) => (
                              <TouchableOpacity
                                  key={curr.name}
                                  onPress={() => {
                                      setCurrency(curr.name);
                                      setCurrencyModalVisible(false);
                                  }}
                                  className={`p-4 border-b border-gray-100 flex-row justify-between items-center ${
                                      currency === curr.name ? 'bg-orange-50' : ''
                                  }`}
                              >
                                  <ThemedText className="font-bold">{curr.label}</ThemedText>
                                  {currency === curr.name && (
                                      <ThemedText className="text-orange-500 font-bold">✓</ThemedText>
                                  )}
                              </TouchableOpacity>
                          ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>

        <View className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 mb-6">
          <ThemedText className="text-xs text-orange-500 font-bold tracking-widest uppercase mb-3">
             {t('confirm.detailUSD')}
          </ThemedText>

          <View className="flex-row justify-between mb-2">
            <ThemedText className="text-neutral-700">{params.mainItemTitle}</ThemedText>
            <ThemedText className="font-bold text-neutral-900">${mainPriceUSD.toFixed(2)}</ThemedText>
          </View>

          <ScrollView className="max-h-48" nestedScrollEnabled={true}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {selectedPackages.map((pkg: any, index: number) => (
              <View key={index} className="flex-row justify-between mb-2">
                <ThemedText className="text-neutral-600 text-sm flex-1 mr-2">+ {pkg.name}</ThemedText>
                <ThemedText className="font-bold text-neutral-800 text-sm">${pkg.price?.toFixed(2)}</ThemedText>
              </View>
            ))}
          </ScrollView>

          <View className="h-[1px] bg-neutral-200 my-2" />

          {/* Campo de Impuesto */}
          {loadingTax ? (
             <ActivityIndicator size="small" color="#f97316" className="my-2" />
          ) : (
            <View className="flex-row justify-between mb-2">
                {/* Visualización: muestra el porcentaje entero (21%) */}
                <ThemedText className="text-neutral-600 text-sm flex-1 mr-2">Impuesto ({formatTaxRate(taxRate)})</ThemedText>
                <ThemedText className="font-bold text-neutral-800 text-sm">${taxAmountUSD.toFixed(2)}</ThemedText>
            </View>
          )}

          <View className="flex-row justify-between items-center">
            <ThemedText className="font-bold text-neutral-500">{t('confirm.totalUSD')}</ThemedText>
            <ThemedText className="font-bold text-lg text-neutral-900">${grandTotalUSD.toFixed(2)}</ThemedText>
          </View>
        </View>

        <View className="mt-2 border-t border-neutral-100 pt-4 mb-8">
          <View className="flex-row justify-between items-end">
            <View>
              <ThemedText className="text-xl text-neutral-500">{t('confirm.totalToPay')}</ThemedText>
              {currency !== 'USD' && (
                  <ThemedText className="text-xs text-gray-400 mt-1">
                      {t('confirm.approxRate')} {rate.toFixed(2)}
                  </ThemedText>
              )}
            </View>

            <View className="items-end">
                {loadingRate ? (
                    <ActivityIndicator size="small" color="#f97316" />
                ) : (
                    <>
                        <ThemedText className="text-4xl font-extrabold text-orange-600" style={{ fontFamily: 'BebasNeue-Regular' }}>
                        {selectedCurrencySymbol}{grandTotalConverted.toFixed(2)}
                        </ThemedText>
                        <ThemedText className="text-sm font-bold text-gray-500">{currency}</ThemedText>
                    </>
                )}
            </View>
          </View>
        </View>

        {processing ? (
          <View className="items-center py-4">
            <ActivityIndicator size="large" color="#f97316" />
            <ThemedText className="text-xs text-gray-400 mt-2">{t('confirm.generatingOrder')}</ThemedText>
          </View>
        ) : (
          <PrimaryButton
            title={t('confirm.confirmWithPay')}
            onPress={handleConfirmOrder}
            disabled={loadingRate || loadingTax}
          />
        )}

      </ScrollView>
    </SafeAreaView>
  );
}