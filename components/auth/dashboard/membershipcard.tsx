import { Card, CardContent } from '@/components/card';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface Props {
	daysRemaining: number;
	qrCodeUrl: string;
}

export const MembershipCard: React.FC<Props> = ({ daysRemaining, qrCodeUrl }) => {
	return (
		<Card className='mb-6'>
			<CardContent>
				<View className='flex-row justify-between items-center mb-3'>
					<View>
						<Text className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
							Acceso al Gimnasio
						</Text>
						<Text className='text-sm text-gray-500 dark:text-gray-400'>
							Escanea para ingresar
						</Text>
					</View>
					<Image
						source={{ uri: qrCodeUrl }} //apartado para el QR
						className='w-20 h-20 rounded-lg'
						resizeMode='contain'
					/>
				</View>
				<View className='border-t border-gray-200 dark:border-neutral-700 pt-2'>
					<Text className='text-sm text-gray-600 dark:text-gray-300'>
						Membresía activa:{' '}
						<Text className='font-semibold text-gray-900 dark:text-gray-100'>
							{daysRemaining} días restantes
						</Text>
					</Text>
				</View>
			</CardContent>
		</Card>
	);
};
