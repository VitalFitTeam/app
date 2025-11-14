import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

export type BirthdayOfferBannerProps = { onPress?: () => void };

export default function BirthdayOfferBanner({ onPress }: BirthdayOfferBannerProps) {
	return (
		<TouchableOpacity
			className='h-24 w-full rounded-2xl overflow-hidden'
			onPress={onPress}
			activeOpacity={0.8}>
			<Image
				source={require('@/assets/images/ofert.png')}
				style={{ width: '100%', height: '100%' }}
				resizeMode='cover'
			/>
		</TouchableOpacity>
	);
}
