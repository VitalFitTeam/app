import { ThemedText } from '@/components/themed-text';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Esta es tu interfaz local para la vista
interface ServiceItem {
  service_id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  image_url?: string;
}

// Esta interfaz representa lo que realmente devuelve el SDK en el endpoint público
interface ServicePublicItem {
  service_id: string;
  name: string;
  description: string;
  lowest_price_no_member: number; // El precio público
  images?: { image_url: string }[]; // Array de imágenes
}

export default function ServicesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        await AsyncStorage.getItem('token');
        
        const response = await vitalFitApi.public.getServices({
          page: 1,
          limit: 50,
          sort: 'desc' as const,
          currency: 'USD',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        // CORRECCIÓN: Eliminamos el @ts-ignore.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData = response as any; 
        const rawData: ServicePublicItem[] = responseData.data || responseData.items || [];

        // Mapeamos los datos del SDK a tu interfaz local ServiceItem
        const mappedServices: ServiceItem[] = rawData.map((item) => ({
          service_id: item.service_id,
          name: item.name,
          description: item.description,
          // Usamos el precio de no miembro como default
          price: item.lowest_price_no_member || 0,
          // Tomamos la primera imagen si existe
          image_url:
            item.images && item.images.length > 0 ? item.images[0].image_url : undefined,
        }));

        setServices(mappedServices);
      } catch (error) {
        console.error('Error cargando servicios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBuyService = (service: ServiceItem) => {
    router.push({
      pathname: '/membership-checkout',
      params: {
        id: service.service_id,
        title: service.name,
        price: service.price.toString(),
        period: 'Pago único',
        type: 'service',
      },
    } as never);
  };

  const renderCard = ({ item }: { item: ServiceItem }) => (
    <View className='mb-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm'>
      <View className='flex-row'>
        {/* Imagen */}
        <View className='mr-4 h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-neutral-100'>
          {item.image_url ? (
            <Image
              source={{ uri: item.image_url }}
              className='h-full w-full'
              resizeMode='cover'
            />
          ) : (
            <ThemedText className='text-2xl'>💆</ThemedText>
          )}
        </View>

        {/* Info */}
        <View className='flex-1 justify-between'>
          <View>
            <ThemedText
              className='mb-1 text-lg font-bold text-neutral-900'
              numberOfLines={1}>
              {item.name}
            </ThemedText>
            <ThemedText
              className='mt-1 text-xs text-neutral-500'
              numberOfLines={2}>
              {item.description || 'Servicio exclusivo VitalFit.'}
            </ThemedText>
          </View>

          <View className='mt-2 flex-row items-center justify-between'>
            <ThemedText className='text-xl font-bold text-orange-500'>
              ${item.price}
            </ThemedText>
            <TouchableOpacity
              onPress={() => handleBuyService(item)}
              className='rounded-full bg-neutral-900 px-4 py-2'>
              <ThemedText className='text-xs font-bold text-white'>
                Comprar
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className='flex-1 bg-neutral-50'>
      <View className='px-6 pb-2 pt-4'>
        <ThemedText
          className='mb-1 text-3xl font-extrabold text-neutral-900'
          style={{ fontFamily: 'BebasNeue-Regular' }}>
          SERVICIOS
        </ThemedText>
        <ThemedText className='mb-4 text-sm text-neutral-500'>
          Personaliza tu experiencia con extras.
        </ThemedText>
      </View>

      {loading ? (
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#f97316' />
        </View>
      ) : (
        <FlatList
          data={services}
          renderItem={renderCard}
          keyExtractor={(item) => item.service_id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <ThemedText className='mt-10 text-center text-neutral-400'>
              No hay servicios disponibles en este momento.
            </ThemedText>
          }
        />
      )}
    </SafeAreaView>
  );
}