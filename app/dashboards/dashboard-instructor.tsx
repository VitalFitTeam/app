import { InstructorStatsCardGroup } from '@/components/auth/dashboard/InstructorStatsCardGroup';
import { InstructorTabs } from '@/components/auth/dashboard/InstructorTabs';
import { MyClientsCardGroup } from '@/components/auth/dashboard/MyClientsCardGroup';
import { TodayClassCard } from '@/components/auth/dashboard/TodayClassCard';
import { UserHeader } from '@/components/auth/dashboard/userheader';
import { ThemedView } from '@/components/themed-view';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

type TabType = 'clientes' | 'clases' | 'mensajes';

export default function DashboardInstructor() {
	const [loading, setLoading] = useState(true);
	const [firstName, setFirstName] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<TabType>('clientes');

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = await AsyncStorage.getItem('token');
				if (!token) {
					console.error('No se encontró token en AsyncStorage');
					return;
				}

				const userData = await vitalFitApi.user.WhoAmI(token);
				setFirstName(userData?.user?.first_name || 'Instructor');
			} catch (error: unknown) {
				let errorMessage = 'Ocurrió un error inesperado al obtener los datos del usuario.';
				if (isAPIError(error)) {
					errorMessage = error.messages.join(', ');
				} else if (error instanceof Error) {
					errorMessage = error.message;
				}
				console.error('Error en la solicitud whoami (Instructor):', errorMessage);
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
					name={firstName ?? 'Instructor'}
					message='Gestiona tus clases y alumnos'
					avatarUrl='https://randomuser.me/api/portraits/men/31.jpg'
				/>

				<InstructorStatsCardGroup />

				<InstructorTabs activeTab={activeTab} onChange={setActiveTab} />

				{activeTab === 'clientes' && <MyClientsCardGroup />}
				{activeTab === 'clases' && <TodayClassCard />}
				{activeTab === 'mensajes' && (
					<View className='mt-6'>
						<Text className='text-[#71727A] text-[14px] text-center'>
							Aún no tienes mensajes nuevos
						</Text>
					</View>
				)}
			</ScrollView>
		</ThemedView>
	);
}
