import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { QrCodeIcon } from 'react-native-heroicons/solid';

type MembershipCardProps = {
	daysRemaining: number;
	onQRPress: () => void;
};

export function MembershipCard({ daysRemaining, onQRPress }: MembershipCardProps) {
	return (
		<View className='bg-white dark:bg-neutral-900 rounded-2xl p-6 mb-6'>
			<View className='flex-row justify-between items-center'>
				<View>
					<ThemedText className='text-lg font-bold'>Membresía</ThemedText>
					<ThemedText className='text-sm text-neutral-500'>
						{daysRemaining} días restantes
					</ThemedText>
				</View>
				<TouchableOpacity onPress={onQRPress}>
					<QrCodeIcon size={40} color='#f97316' />
				</TouchableOpacity>
			</View>
		</View>
	);
}
