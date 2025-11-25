import { InstructorStatsCardGroup } from '@/components/auth/dashboard/InstructorStatsCardGroup';
import { InstructorTabs } from '@/components/auth/dashboard/InstructorTabs';
import { MyClientsCardGroup } from '@/components/auth/dashboard/MyClientsCardGroup';
import { TodayClassCard } from '@/components/auth/dashboard/TodayClassCard';
import { UserHeader } from '@/components/auth/dashboard/userheader';
import { ThemedView } from '@/components/themed-view';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, ScrollView, Text, View } from 'react-native';
import { CalendarDaysIcon, ClockIcon } from 'react-native-heroicons/mini';
import { ChatBubbleLeftRightIcon, ChevronRightIcon, UserIcon } from 'react-native-heroicons/outline';

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

	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				BackHandler.exitApp();
				return true;
			};

			const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

			return () => subscription.remove();
		}, []),
	);

	if (loading) {
		return (
			<ThemedView className='flex-1 justify-center items-center bg-white'>
				<ActivityIndicator size='large' color='#F27F2A' />
			</ThemedView>
		);
	}

	const messages = [
		{
			id: '1',
			name: 'Carlos Pérez',
			snippet: 'Necesito ajustar mi plan de entreno',
			time: '30 min',
		},
		{
			id: '2',
			name: 'Carlos Pérez',
			snippet: '¿Podemos cambiar el horario de mañana?',
			time: '1 h',
		},
		{
			id: '3',
			name: 'María López',
			snippet: 'Quiero añadir un día más de entrenamiento',
			time: '2 h',
		},
		{
			id: '4',
			name: 'Juan Pérez',
			snippet: 'No podré asistir mañana',
			time: '3 h',
		},
		{
			id: '5',
			name: 'Ana García',
			snippet: '¿Puedes revisar mi técnica de sentadilla?',
			time: 'ayer',
		},
	];

	return (
		<ThemedView className='flex-1 bg-white px-2 pt-10'>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 96 }}>
				<UserHeader
					name={firstName ?? 'Instructor'}
					avatarUrl='https://randomuser.me/api/portraits/men/31.jpg'
				/>

				<InstructorStatsCardGroup />

				<TodayClassCard />

				<InstructorTabs activeTab={activeTab} onChange={setActiveTab} />

				{activeTab === 'clientes' && <MyClientsCardGroup />}
				{activeTab === 'clases' && (
					<View className='mt-6 rounded-2xl bg-white px-4 py-3 border border-[#e5e7eb] shadow-sm'>
						<View className='flex-row items-center mb-3'>
							<CalendarDaysIcon width={18} height={18} color='#f97316' />
							<Text className='ml-2 text-[14px] font-medium text-[#111827]'>
								Clases de hoy
							</Text>
						</View>

						{[
							'Powerlifting Avanzado',
							'Crossfit Intermedio',
							'Funcional Principiantes',
						].map((name) => (
							<View
								key={name}
								className='mb-3 rounded-xl bg-white px-4 py-4 flex-row justify-between items-center border border-[#e5e7eb]'>
								<View className='flex-col flex-1 pr-3'>
									<Text className='text-[14px] font-semibold text-[#111827]'>{name}</Text>
									<Text className='mt-[2px] text-[12px] text-[#4b5563]'>
										15 de Noviembre del 2025
									</Text>
									<View className='mt-3 flex-row items-center'>
										<ClockIcon width={14} height={14} color='#f97316' />
										<Text className='ml-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#f97316]'>
											07:00 (90 MIN)
										</Text>
									</View>
								</View>
								<View className='flex-row items-center rounded-full bg-white px-3 py-1 border border-[#f97316]'>
									<Text className='text-[12px] font-medium text-[#111827]'>10/15</Text>
									<ChevronRightIcon width={12} height={12} color='#f97316' style={{ marginLeft: 4 }} />
								</View>
							</View>
						))}
					</View>
				)}
				{activeTab === 'mensajes' && (
					<View className='mt-6 rounded-2xl bg-white px-4 py-3 border border-[#e5e7eb] shadow-sm'>
						<View className='flex-row items-center mb-3'>
							<ChatBubbleLeftRightIcon width={18} height={18} color='#f97316' />
							<Text className='ml-2 text-[14px] font-medium text-[#111827]'>
								Mensajes de Clientes
							</Text>
						</View>

						{messages.map((msg) => (
							<View
								key={msg.id}
								className='flex-row items-center justify-between bg-[#F8F9FB] rounded-2xl px-4 py-3 mb-3'>
								<View className='flex-row items-center flex-1'>
									<View className='w-10 h-10 rounded-xl bg-[#FED7AA] justify-center items-center mr-3'>
										<UserIcon size={22} color='#f97316' />
									</View>
									<View className='flex-1'>
										<Text className='text-[14px] font-bold text-[#1F2024]'>
											{msg.name}
										</Text>
										<Text
											className='text-[12px] text-[#71727A]'
											numberOfLines={1}
											ellipsizeMode='tail'>
											{msg.snippet}
										</Text>
									</View>
								</View>
								<View className='items-end'>
									<Text className='text-[12px] text-[#71727A] mb-1'>{msg.time}</Text>
									<ChevronRightIcon size={12} color='#71727A' />
								</View>
							</View>
						))}
					</View>
				)}
			</ScrollView>
		</ThemedView>
	);
}
