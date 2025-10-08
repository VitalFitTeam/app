import { MembershipCard } from '@/components/auth/dashboard/membershipcard';
import { UserHeader } from '@/components/auth/dashboard/userheader';
import { WeekCalendar } from '@/components/auth/dashboard/weekcalendar';
import { PrimaryButton } from '@/components/PrimaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedView } from '@/components/themed-view';
import axios from 'axios';
import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

export default function DashboardScreen() {
	const [code, setCode] = useState('');
	const API_URL = process.env.EXPO_PUBLIC_API_URL;

	const handleActivate = async () => {
		if (!code.trim()) {
			Alert.alert('Error', 'Por favor ingresa tu código de activación.');
			return;
		}

		try {
			const response = await axios.put(`${API_URL}/auth/activate`, {
				code,
			});

			Alert.alert('Activación', response.data?.message || 'Activación exitosa ✅');
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.error('Error al activar:', error);
				const message =
					error.response?.data?.message ||
					'Hubo un error al activar. Intenta nuevamente.';
				Alert.alert('Error', message);
			} else {
				console.error(error);
				Alert.alert('Error', 'Error inesperado');
			}
		}
	};

	return (
		<ThemedView className='flex-1 bg-white dark:bg-neutral-950 px-4 pt-10'>
			<ScrollView showsVerticalScrollIndicator={false}>
				<UserHeader
					name='Albani'
					message='Es hora de desafiar tus límites'
					avatarUrl='https://randomuser.me/api/portraits/women/45.jpg'
				/>
				<WeekCalendar />
				<MembershipCard
					daysRemaining={15}
					qrCodeUrl='https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=gym-access'
				/>

				{/* Bloque de activación */}
				<View className='mt-8'>
					<StyledTextInput
						placeholder='Ingresa tu código de activación'
						value={code}
						onChangeText={setCode}
					/>
					<PrimaryButton title='Activar cuenta' onPress={handleActivate} />
				</View>
			</ScrollView>
		</ThemedView>
	);
}
