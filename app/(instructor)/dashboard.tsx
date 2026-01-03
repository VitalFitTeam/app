import { InstructorStatsCardGroup } from '@/components/auth/dashboard/InstructorStatsCardGroup';
import { InstructorTabs } from '@/components/auth/dashboard/InstructorTabs';
import { MyClientsCardGroup } from '@/components/auth/dashboard/MyClientsCardGroup';
import { TodayClassCard } from '@/components/auth/dashboard/TodayClassCard';
import { UserHeader } from '@/components/auth/dashboard/userheader';
import { ThemedView } from '@/components/themed-view';
import { useUser } from '@/contexts/UserContext';
import vitalFitApi from '@/services/vitalfitSdk';
import { ClassScheduleItem, KPICard } from '@/types/reports';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, BackHandler, ScrollView, Text, View } from 'react-native';
import { CalendarDaysIcon, ClockIcon } from 'react-native-heroicons/mini';
import { ChatBubbleLeftRightIcon, ChevronRightIcon, UserIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabType = 'clientes' | 'clases' | 'mensajes';

export default function DashboardInstructor() {
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();
	const { user, loading: userLoading } = useUser();
	const [activeTab, setActiveTab] = useState<TabType>('clientes');

	// Report Data States
	const [monthlyClasses, setMonthlyClasses] = useState<KPICard | null>(null);
	const [studentCount, setStudentCount] = useState<KPICard | null>(null);
	const [todaysClasses, setTodaysClasses] = useState<ClassScheduleItem[]>([]);
	const [nextClassTime, setNextClassTime] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = await AsyncStorage.getItem('token');
				if (!token) {
					console.error('No se encontró token en AsyncStorage');
					return;
				}

				// Fetch Reports using singular 'report' based on SDK inspection
				const reportApi = vitalFitApi.report;

				if (reportApi) {
					const [monthlyCount, studentKPI, classesToday, nextClass] = await Promise.all([
						reportApi.instructorMonthlyClassesCount(token).catch((e: unknown) => {
							console.log('Error fetching monthly count:', e);
							return null;
						}),
						reportApi.instructorStudentCountKPI(token).catch((e: unknown) => {
							console.log('Error fetching student count:', e);
							return null;
						}),
						reportApi.instructorClassesToday(token).catch((e: unknown) => {
							console.log('Error fetching today classes:', e);
							return null;
						}),
						reportApi.instructorNextClass(token).catch((e: unknown) => {
							console.log('Error fetching next class:', e);
							return null;
						}),
					]);

					console.log('--- VERIFICACIÓN DE REPORTES (FIXED) ---');
					console.log('1. Clases Mensuales:', JSON.stringify(monthlyCount, null, 2));
					console.log('2. Alumnos KPI:', JSON.stringify(studentKPI, null, 2));
					console.log('3. Clases Hoy:', JSON.stringify(classesToday, null, 2));
					console.log('4. Próxima Clase:', nextClass);
					console.log('--------------------------------');

					setMonthlyClasses(monthlyCount && monthlyCount.data ? monthlyCount.data : null);
					setStudentCount(studentKPI && studentKPI.data ? studentKPI.data : null);
					setTodaysClasses(classesToday && classesToday.data ? classesToday.data : []);
					setNextClassTime(nextClass && nextClass.data ? nextClass.data : null);
				} else {
					console.error('vitalFitApi.report is undefined');
				}
			} catch (error: unknown) {
				let errorMessage = t('instructor.dashboard.error.fetchUser');
				if (isAPIError(error)) {
					errorMessage = error.messages.join(', ');
				} else if (error instanceof Error) {
					errorMessage = error.message;
				}
				console.error('Error en la solicitud (Instructor):', errorMessage);
			}
		};

		fetchData();
	}, [t]);

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

	if (userLoading) {
		return (
			<ThemedView className='flex-1 justify-center items-center bg-white'>
				<ActivityIndicator size='large' color='#F27F2A' />
			</ThemedView>
		);
	}

	const firstName = user?.firstName || t('instructor.dashboard.defaultName');
	const avatarUrl = user?.profilePicture;
	const gender = user?.gender;


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

	// Determine upcoming class for display
	const upcomingClass = todaysClasses.length > 0 ? todaysClasses[0] : null;

	// Calculate Attendance Rate
	const totalCapacity = todaysClasses.reduce((sum, item) => sum + (item.max_capacity || 0), 0);
	const totalOccupied = todaysClasses.reduce((sum, item) => sum + (item.occupied || 0), 0);
	const attendanceRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

	return (
		<ThemedView className='flex-1 bg-white px-2 pt-10'>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 80, 96) }}>
				<UserHeader
					name={firstName}
					avatarUrl={avatarUrl}
					gender={gender}
				/>

				<InstructorStatsCardGroup 
					monthlyClasses={monthlyClasses}
					studentCount={studentCount}
					attendanceRate={attendanceRate}
				/>

				<TodayClassCard 
					headerTitle={t('instructor.dashboard.nextClass')}
					title={upcomingClass ? upcomingClass.class_name : (nextClassTime === 'Sin pendientes' ? 'Sin clases pendientes' : 'Próxima clase')}
					timeLabel={nextClassTime || '--:--'}
					spotsLabel={upcomingClass ? `${upcomingClass.occupied || 0}/${upcomingClass.max_capacity}` : '-/-'}
					dateLabel={new Date().toLocaleDateString()}
				/>

				<InstructorTabs activeTab={activeTab} onChange={setActiveTab} />

				{activeTab === 'clientes' && <MyClientsCardGroup />}
				{activeTab === 'clases' && (
					<View className='mt-6 rounded-2xl bg-white px-4 py-3 border border-[#e5e7eb] shadow-sm'>
						<View className='flex-row items-center mb-3'>
							<CalendarDaysIcon width={18} height={18} color='#f97316' />
							<Text className='ml-2 text-[14px] font-medium text-[#111827]'>
								{t('instructor.dashboard.todayClasses')}
							</Text>
						</View>

						{todaysClasses.length === 0 ? (
							<Text className='py-4 text-center text-gray-500'>No hay clases programadas para hoy.</Text>
						) : (
							todaysClasses.map((cls, index) => (
								<View
									key={index}
									className='mb-3 rounded-xl bg-white px-4 py-4 flex-row justify-between items-center border border-[#e5e7eb]'>
									<View className='flex-col flex-1 pr-3'>
										<Text className='text-[14px] font-semibold text-[#111827]'>{cls.class_name}</Text>
										<Text className='mt-[2px] text-[12px] text-[#4b5563]'>
											{new Date().toLocaleDateString()}
										</Text>
										<View className='mt-3 flex-row items-center'>
											<ClockIcon width={14} height={14} color='#f97316' />
											<Text className='ml-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#f97316]'>
												{cls.start_time} - {cls.end_time}
											</Text>
										</View>
									</View>
									<View className='flex-row items-center rounded-full bg-white px-3 py-1 border border-[#f97316]'>
										<Text className='text-[12px] font-medium text-[#111827]'>-/{cls.max_capacity}</Text>
									</View>
								</View>
							))
						)}
					</View>
				)}
				{activeTab === 'mensajes' && (
					<View className='mt-6 rounded-2xl bg-white px-4 py-3 border border-[#e5e7eb] shadow-sm'>
						<View className='flex-row items-center mb-3'>
							<ChatBubbleLeftRightIcon width={18} height={18} color='#f97316' />
							<Text className='ml-2 text-[14px] font-medium text-[#111827]'>
								{t('instructor.dashboard.clientMessages')}
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
