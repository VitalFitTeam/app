import { GymCapacityCard } from '@/components/auth/dashboard/GymCapacityCard';
import { RecepcionistStatsCardGroup } from '@/components/auth/dashboard/RecepcionistStatsCardGroup';
import { RecepcionistTodayClassCard } from '@/components/auth/dashboard/RecepcionistTodayClassCard';
import { UserHeader } from '@/components/auth/dashboard/userheader';
import { ValidateCheckInCard } from '@/components/auth/dashboard/ValidateCheckInCard';
import { ThemedView } from '@/components/themed-view';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';

export default function DashboardRecepcionist() {
	const [loading, setLoading] = useState(true);
	const [firstName, setFirstName] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = await AsyncStorage.getItem('token');
				if (!token) return;
				const userData = await vitalFitApi.user.WhoAmI(token);
				setFirstName(userData?.user?.first_name || 'Recepcionista');
			} catch (error: unknown) {
				let errorMessage = 'Ocurrió un error inesperado.';
				if (isAPIError(error)) errorMessage = error.messages.join(', ');
				else if (error instanceof Error) errorMessage = error.message;
				console.error('Error whoami (Recepcionista):', errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	if (loading) {
		return (
			<ThemedView className='flex-1 justify-center items-center bg-white dark:bg-neutral-950'>
				<ActivityIndicator size='large' color='#F27F2A' />
			</ThemedView>
		);
	}

	return (
		<ThemedView className='flex-1 bg-white dark:bg-neutral-950 px-4 pt-10'>
			<ScrollView showsVerticalScrollIndicator={false}>
				<UserHeader
					name={firstName ?? 'Recepcionista'}
					message='Bienvenido a VITALFIT'
					avatarUrl='https://randomuser.me/api/portraits/women/44.jpg'
				/>

				<RecepcionistStatsCardGroup />
				<ValidateCheckInCard />
				<GymCapacityCard />
				<RecepcionistTodayClassCard />
			</ScrollView>
		</ThemedView>
	);
}
