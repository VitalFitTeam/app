
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, TouchableOpacity, View } from 'react-native';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PackageItem {
  packageId?: string;
  package_id?: string;
  name: string;
  description: string;
  price: number;
}

export default function MembershipExtraScreen() {
  const router = useRouter();
  
  const params = useLocalSearchParams<{
    mainItemId?: string;
    mainItemTitle?: string;
    mainItemPrice?: string;
    mainItemType?: string;
    startDate?: string;
    userId?: string;
    branchId?: string;
  }>(); // Eliminado currency

  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [selectedPackagesIds, setSelectedPackagesIds] = useState<string[]>([]);
  
  useEffect(() => {
    const loadPackages = async () => {
      try {
        await AsyncStorage.getItem('token');
        
        // Forzamos USD al cargar paquetes
        const response = await vitalFitApi.public.getPackages({
          page: 1, 
          limit: 50, 
          currency: 'USD' 
        });
        
        // @ts-expect-error: Manejo flexible de respuesta
        const data = response.data || response.results || response.items || [];
        setPackages(data);
      } catch (e) {
        console.error('Error cargando paquetes:', e);
        Alert.alert('Aviso', 'No se pudieron cargar los paquetes adicionales.');
      } finally {
        setLoading(false);
      }
    };
    loadPackages();
  }, []);

  const togglePackage = (pkgId: string) => {
    if (selectedPackagesIds.includes(pkgId)) {
      setSelectedPackagesIds(prev => prev.filter(id => id !== pkgId));
    } else {
      setSelectedPackagesIds(prev => [...prev, pkgId]);
    }
  };

  const onContinue = () => {
    const selectedObjects = packages.filter(p => {
        const id = p.packageId || p.package_id;
        return id && selectedPackagesIds.includes(id);
    });

    router.push({
      pathname: '/membership-confirm',
      params: {
        ...params,
        packagesJson: JSON.stringify(selectedObjects)
      }
    } as never);
  };

  const renderPackage = ({ item }: { item: PackageItem }) => {
    const id = item.packageId || item.package_id || '';
    const isSelected = selectedPackagesIds.includes(id);

    return (
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => togglePackage(id)}
        className={`p-4 mb-3 rounded-2xl border ${
          isSelected 
            ? 'border-orange-500 bg-orange-50' 
            : 'border-neutral-200 bg-white'
        }`}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <ThemedText 
              lightColor="#111827" 
              darkColor="#111827" 
              className="font-bold text-lg mb-1"
            >
              {item.name}
            </ThemedText>
            <ThemedText 
              lightColor="#6b7280" 
              darkColor="#6b7280" 
              className="text-xs"
              numberOfLines={2}
            >
              {item.description}
            </ThemedText>
          </View>
          
          <View className="items-end">
             <ThemedText 
               lightColor="#f97316" 
               darkColor="#f97316" 
               className="font-extrabold text-xl"
             >
               ${item.price} {/* Siempre es USD */}
             </ThemedText>
             {isSelected ? (
                <View className="flex-row items-center mt-1">
                    <CheckCircleIcon size={16} color="#f97316" />
                    <ThemedText className="text-xs text-orange-600 font-bold ml-1">
                        AGREGADO
                    </ThemedText>
                </View>
             ) : (
                <ThemedText className="text-xs text-gray-400 mt-1">
                    Clic para agregar
                </ThemedText>
             )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-8 pb-4">
        
        {/* Header de Pasos */}
        <View className='mb-6'>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='text-4xl mb-4 text-center'
            style={{ fontFamily: 'BebasNeue-Regular' }}>
            EXTRAS
          </ThemedText>
          <View className='flex-row justify-between items-center mb-4'>
            {/* Paso 1 */}
            <View className='items-center flex-1'>
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 border bg-white border-neutral-400'>
                <ThemedText className='text-[10px] font-semibold text-gray-800'>1</ThemedText>
              </View>
              <ThemedText className='text-[11px] text-center text-gray-800'>Opciones</ThemedText>
            </View>
            
            {/* Paso 2 (Activo) */}
            <View className='items-center flex-1'>
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 border bg-orange-500 border-orange-500'>
                <ThemedText className='text-[10px] font-semibold text-white'>2</ThemedText>
              </View>
              <ThemedText className='text-[11px] text-center text-orange-600 font-bold'>Extras</ThemedText>
            </View>
            
            {/* Paso 3 */}
            <View className='items-center flex-1'>
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 border bg-white border-neutral-400'>
                <ThemedText className='text-[10px] font-semibold text-gray-800'>3</ThemedText>
              </View>
              <ThemedText className='text-[11px] text-center text-gray-800'>Confirmación</ThemedText>
            </View>
          </View>
        </View>

        <View className="mb-4">
            <ThemedText className="text-xl font-bold mb-1">
                Paquetes Adicionales
            </ThemedText>
            <ThemedText className="text-sm text-gray-500">
                Selecciona clases extra o servicios complementarios para tu membresía.
            </ThemedText>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
             <ActivityIndicator size="large" color="#f97316" />
          </View>
        ) : (
          <FlatList
            data={packages}
            renderItem={renderPackage}
            keyExtractor={(item) => item.packageId || item.package_id || Math.random().toString()}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
                <View className="py-10 items-center">
                    <ThemedText className="text-gray-400 text-center">
                        No hay paquetes adicionales disponibles en este momento.
                    </ThemedText>
                </View>
            }
          />
        )}

        <View className="pt-4 border-t border-gray-100">
            <PrimaryButton 
                title={`Continuar (${selectedPackagesIds.length} extras)`} 
                onPress={onContinue} 
            />
            <TouchableOpacity onPress={onContinue} className="mt-3 items-center">
                <ThemedText className="text-gray-500 text-sm underline">
                    Saltar y continuar sin extras
                </ThemedText>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}