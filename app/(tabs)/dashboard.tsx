import { MembershipCard } from '@/components/auth/dashboard/membershipcard';
import { ProgressCard } from '@/components/auth/dashboard/progresscard';
import { QRModal } from '@/components/auth/dashboard/QRModal';
import { ReservedClassesCard } from '@/components/auth/dashboard/reservedclasses';
import { TodayRoutineCard } from '@/components/auth/dashboard/todayroutinecard';
import { UserHeader } from '@/components/auth/dashboard/userheader';
import { WeekCalendar } from '@/components/auth/dashboard/weekcalendar';
import { ThemedView } from '@/components/themed-view';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';

export default function DashboardScreen() {
	const [firstName, setFirstName] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [qrModalVisible, setQrModalVisible] = useState(false); // 👈 Estado del modal
	const [userToken, setUserToken] = useState<string>(''); // 👈 Estado del token

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = await AsyncStorage.getItem('token');

				if (!token) {
					console.error('❌ No se encontró token en AsyncStorage');
					return;
				}

				setUserToken(token); // 👈 Guardar token

				const userData = await vitalFitApi.user.WhoAmI(token);

				setFirstName(userData?.user?.first_name || 'Usuario');
			} catch (error: unknown) {
				let errorMessage = 'Ocurrió un error inesperado al obtener los datos del usuario.';
				if (isAPIError(error)) {
					errorMessage = error.messages.join(', ');
				} else if (error instanceof Error) {
					errorMessage = error.message;
				}
				console.error('💥 Error en la solicitud whoami:', errorMessage);
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
					name={firstName ?? 'Usuario'}
					message='Es hora de desafiar tus límites'
					avatarUrl='https://randomuser.me/api/portraits/men/32.jpg'
				/>
				<WeekCalendar />

				{/* MembershipCard ahora abre el modal QR */}
				<MembershipCard
					daysRemaining={15}
					onQRPress={() => setQrModalVisible(true)} // 👈 Abrir modal
				/>

				<ProgressCard weekProgress={0.8} calories={1200} completed='4/5' />
				<ReservedClassesCard reserved={0} />
				<TodayRoutineCard
					title='Day 05 - Warm Up'
					time='07:00 - 08:00 AM'
					date='Mon 26 Apr'
				/>
			</ScrollView>

			{/* Modal QR */}
			<QRModal
				visible={qrModalVisible}
				onClose={() => setQrModalVisible(false)}
				token={userToken}
			/>
		</ThemedView>
	);
}
