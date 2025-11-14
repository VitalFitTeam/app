import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export type WeeklyChallengeBannerProps = { onPress?: () => void };

export default function WeeklyChallengeBanner({ onPress }: WeeklyChallengeBannerProps) {
	return (
		<View className='h-48 w-full rounded-2xl overflow-hidden flex-row bg-neutral-800'>
			{/* Contenedor de Texto (Mitad Izquierda) */}
			<View className='w-1/2 justify-center px-5'>
				<Text className='text-orange-500 font-bold text-3xl leading-9 mb-0'>
					Weekly Challenge
				</Text>
				<Text className='text-white font-semibold text-lg mb-0'>Plank With Hip Twist</Text>
				<TouchableOpacity
					className='bg-orange-500 rounded-lg px-5 py-2.5 self-start'
					onPress={onPress}
					activeOpacity={0.8}>
					<Text className='text-white font-bold text-sm'>Ver más</Text>
				</TouchableOpacity>
			</View>

			{/* Contenedor de Imagen (Mitad Derecha) */}
			<View className='w-1/2 flex-1 justify-center items-center'>
				<View className='h-full w-56 rounded-2xl overflow-hidden'>
					<Image
						source={require('@/assets/images/woman4.png')}
						style={{ width: '100%', height: '100%' }}
						resizeMode='cover'
					/>
				</View>
			</View>
		</View>
	);
}
