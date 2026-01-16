import vitalFitApi from '@/services';
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';

interface RandomBanner {
  image_url: string;
  service_id: string;
}

interface ServiceDetails {
  name: string;
  category?: {
    name: string;
  };
}

export default function BirthdayOfferBanner() {
	const [banner, setBanner] = useState<RandomBanner | null>(null);
    const [serviceName, setServiceName] = useState<string | null>(null);
    const [categoryName, setCategoryName] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchBannerAndService = async () => {
			try {
				// 1. Fetch Random Banner
                // Add timestamp and random number to ensure uniqueness and bypass cache
                const timestamp = Date.now() + Math.random();
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const bannerResponse = await vitalFitApi.client.get({
					url: `/marketing/banners/random?t=${timestamp}`,
				});
                
				const bannerDataRaw = bannerResponse.data || bannerResponse;
				const bannerData = (bannerDataRaw.data || bannerDataRaw) as RandomBanner;

				if (bannerData && bannerData.image_url) {
					setBanner(bannerData);

                    // 2. Enrich with Service Details if ID exists
                    if (bannerData.service_id) {
                        try {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            const serviceResponse = await vitalFitApi.client.get({
                                url: `/services/${bannerData.service_id}`,
                            });
                            const serviceDataRaw = serviceResponse.data || serviceResponse;
                            const serviceData = (serviceDataRaw.data || serviceDataRaw) as ServiceDetails;
                            
                            if (serviceData) {
                                setServiceName(serviceData.name);
                                if (serviceData.category?.name) {
                                    setCategoryName(serviceData.category.name);
                                }
                            }
                        } catch (serviceError) {
                            console.log('Error fetching service details for banner:', serviceError);
                        }
                    }
				}
			} catch (error) {
				console.error('Error fetching banner:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchBannerAndService();
	}, []);

	if (loading || !banner) {
		return null; 
	}

	return (
		<View className='h-40 w-full rounded-2xl overflow-hidden relative bg-gray-100'>
			<Image
				source={{ uri: banner.image_url }}
				style={{ width: '100%', height: '100%' }}
				resizeMode='cover'
			/>
            
            {/* Overlay Gradient/Text if we have service info */}
            {(serviceName || categoryName) && (
                <View className='absolute bottom-0 left-0 right-0 bg-black/40 p-4'>
                    {categoryName && (
                        <Text className='text-orange-400 font-bold text-xs uppercase tracking-wider mb-1'>
                            {categoryName}
                        </Text>
                    )}
                    {serviceName && (
                        <Text className='text-white font-bold text-lg' numberOfLines={2}>
                            {serviceName}
                        </Text>
                    )}
                </View>
            )}
		</View>
	);
}
