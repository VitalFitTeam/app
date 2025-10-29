import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CancelMembershipScreen() {
	const router = useRouter();

	return (
		<SafeAreaView className='flex-1 bg-white dark:bg-neutral-950'>
			<View className='flex-1 justify-center items-center p-6'>
				<ThemedText className='text-3xl font-bold text-center mb-12'>
					¿Estás seguro de que quieres cancelar?
				</ThemedText>

				<View className='w-full'>
					<SecondaryButton
						title='Mantener membresía'
						onPress={() => router.push('/memberships')}
					/>
					<View className='h-4' />
					<PrimaryButton
						title='Cancelar membresía'
						onPress={() => {
							// Lógica para cancelar la membresía
							console.log('Membresía cancelada');
							router.back();
						}}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}
