import { ThemedText } from '@/components/themed-text';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ServiceItem {
  service_id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  image_url?: string;
}

interface ServicePublicItem {
  service_id: string;
  name: string;
  description: string;
  lowest_price_no_member: number;
  images?: { image_url: string }[];
}

function ServiceCardComponent({
  item,
  onBuy,
}: {
  item: ServiceItem;
  onBuy: (s: ServiceItem) => void;
}) {
  return (
    <View className='mb-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm'>
      <View className='flex-row'>
        <View className='mr-4 h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-neutral-100'>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} className='h-full w-full' resizeMode='cover' />
          ) : (
            <ThemedText className='text-2xl'>💆</ThemedText>
          )}
        </View>

        <View className='flex-1 justify-between'>
          <View>
            <ThemedText className='font-body mb-1 text-lg font-bold text-neutral-900' numberOfLines={1}>
              {item.name}
            </ThemedText>

            <ThemedText className='font-body mt-1 text-xs text-neutral-500' numberOfLines={2}>
              {item.description || 'Servicio exclusivo VitalFit.'}
            </ThemedText>
          </View>

          <View className='mt-2 flex-row items-center justify-between'>
            <ThemedText className='font-heading text-xl font-bold text-orange-500'>
              ${item.price}
            </ThemedText>

            <TouchableOpacity
              onPress={() => onBuy(item)}
              className='rounded-full px-4 py-2'
              style={{ backgroundColor: '#F27F2A' }}>
              <ThemedText className='font-body text-xs font-bold text-white'>
                Comprar
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const ServiceCard = React.memo(ServiceCardComponent);


export default function ServicesScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [allServices, setAllServices] = useState<ServiceItem[]>([]);
  const [visibleServices, setVisibleServices] = useState<ServiceItem[]>([]);
  const [page, setPage] = useState(1);
  const batchSize = 8;
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        await AsyncStorage.getItem('token');

        const response = await vitalFitApi.public.getServices({
          currency: 'USD',
          category: '',
          price: 0,
          sortby: 'desc',
        });

        const rawData: ServicePublicItem[] = (response.data as ServicePublicItem[]) ?? [];
        const mapped: ServiceItem[] = rawData.map((item) => ({
          service_id: item.service_id,
          name: item.name,
          description: item.description,
          price: item.lowest_price_no_member || 0,
          image_url: item.images?.[0]?.image_url,
        }));

        setAllServices(mapped);
        setVisibleServices(mapped.slice(0, batchSize));
      } catch (error) {
        console.error('Error cargando servicios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const loadMore = () => {
    if (loadingMore) return;

    const total = allServices.length;
    const nextPageStart = page * batchSize;

    if (nextPageStart >= total) return; 

    setLoadingMore(true);

    setTimeout(() => {
      const nextItems = allServices.slice(0, nextPageStart + batchSize);
      setVisibleServices(nextItems);
      setPage(page + 1);
      setLoadingMore(false);
    }, 300);
  };

  const handleBuyService = useCallback((service: ServiceItem) => {
    router.replace({
      pathname: '/membership-checkout',
      params: {
        id: service.service_id,
        title: service.name,
        price: service.price.toString(),
        period: 'Pago único',
        type: 'service',
      },
    });
  }, [router]);

  const renderCard = useCallback(
    ({ item }: { item: ServiceItem }) => <ServiceCard item={item} onBuy={handleBuyService} />,
    [handleBuyService]
  );

  return (
    <SafeAreaView className='flex-1 bg-neutral-50'>
      <View className='px-6 pb-2 pt-4'>
        <ThemedText
          className='font-heading mb-1 text-3xl font-extrabold text-neutral-900'
          style={{ fontFamily: 'BebasNeue-Regular' }}>
          SERVICIOS
        </ThemedText>

        <ThemedText className='font-body mb-4 text-sm text-neutral-500'>
          Personaliza tu experiencia con extras.
        </ThemedText>
      </View>

      {loading ? (
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#f97316' />
        </View>
      ) : (
        <FlatList
          data={visibleServices}
          renderItem={renderCard}
          keyExtractor={(item) => item.service_id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={8}
          windowSize={5}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}

          ListFooterComponent={
            loadingMore ? (
              <View className='py-6'>
                <ActivityIndicator size='small' color='#f97316' />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}