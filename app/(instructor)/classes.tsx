import { MonthCalendar } from '@/components/auth/dashboard/monthcalendar';
import { WeekCalendar } from '@/components/auth/dashboard/weekcalendar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ClockIcon } from 'react-native-heroicons/mini';
import { ChevronRightIcon } from 'react-native-heroicons/outline';

type InstructorClass = {
	id: string;
	title: string;
	date: string; // YYYY-MM-DD
	time: string; // HH:mm
	durationMinutes: number;
	location: string;
	capacity: number;
	occupied: number;
};

const MOCK_CLASSES: InstructorClass[] = [
	{
		id: '1',
		title: 'Powerlifting Avanzado',
		date: '2025-11-15',
		time: '07:00',
		durationMinutes: 90,
		location: 'Salón B',
		capacity: 15,
		occupied: 10,
	},
	{
		id: '2',
		title: 'Crossfit Intermedio',
		date: '2025-11-15',
		time: '09:00',
		durationMinutes: 60,
		location: 'Área funcional',
		capacity: 18,
		occupied: 15,
	},
	{
		id: '3',
		title: 'Funcional Principiantes',
		date: '2025-11-16',
		time: '18:00',
		durationMinutes: 60,
		location: 'Salón A',
		capacity: 20,
		occupied: 12,
	},
];

type ViewMode = 'week' | 'month';

export default function InstructorClassesScreen() {
	const { t } = useTranslation();
	const router = useRouter();
	const today = new Date().toISOString().split('T')[0];

	const [viewMode, setViewMode] = useState<ViewMode>('week');
	const [selectedDate, setSelectedDate] = useState<string>(today);

	const classesByDate = useMemo(() => {
		const map: Record<string, InstructorClass[]> = {};
		MOCK_CLASSES.forEach((cls) => {
			if (!map[cls.date]) map[cls.date] = [];
			map[cls.date].push(cls);
		});
		return map;
	}, []);

	const markedDates = useMemo(() => {
		const marks: {
			[date: string]: {
				marked?: boolean;
				dotColor?: string;
				selected?: boolean;
				selectedColor?: string;
			};
		} = {};

		Object.keys(classesByDate).forEach((date) => {
			marks[date] = {
				...(marks[date] || {}),
				marked: true,
				dotColor: '#f97316',
			};
		});

		marks[selectedDate] = {
			...(marks[selectedDate] || {}),
			selected: true,
			selectedColor: '#f97316',
			marked: true,
			dotColor: '#f97316',
		};

		return marks;
	}, [classesByDate, selectedDate]);

	const classesForSelectedDate = classesByDate[selectedDate] || [];

	const handleDaySelect = (day: { dateString: string }) => {
		setSelectedDate(day.dateString);
	};

	return (
		<ThemedView className='flex-1 bg-white pt-10'>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 16, paddingBottom: 96 }}>
				{/* Logo */}
				<View className='items-center mb-4'>
					<Image
						source={require('@/assets/images/Frame.png')}
						style={{ width: 150, height: 50, resizeMode: 'contain' }}
					/>
				</View>

				{/* Título principal en franja */}
				<View className='w-full bg-[#F3F4F6] rounded-2xl py-2 mb-3 items-center justify-center'>
					<ThemedText
						lightColor='#111827'
						style={{ fontFamily: 'System', fontSize: 16, fontWeight: '600' }}>
						{t('instructor.classes.title')}
					</ThemedText>
				</View>
				<View className='mb-2'>
					<ThemedText
						lightColor='#111827'
						style={{ fontFamily: 'BebasNeue-Regular', fontSize: 24 }}>
						{t('instructor.classes.calendar')}
					</ThemedText>
				</View>

				{/* Toggle Semana / Mes */}
				<View className='flex-row bg-[#F3F4F6] rounded-2xl p-1 mb-4'>
					<TouchableOpacity
						className={`flex-1 py-2 rounded-xl items-center ${
							viewMode === 'week' ? 'bg-white' : 'bg-transparent'
						}`}
						activeOpacity={0.7}
						onPress={() => setViewMode('week')}>
						<Text
							className={`font-semibold ${
								viewMode === 'week' ? 'text-[#111827]' : 'text-[#6b7280]'
							}`}> 
							{t('instructor.classes.week')}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className={`flex-1 py-2 rounded-xl items-center ${
							viewMode === 'month' ? 'bg-white' : 'bg-transparent'
						}`}
						activeOpacity={0.7}
						onPress={() => setViewMode('month')}>
						<Text
							className={`font-semibold ${
								viewMode === 'month' ? 'text-[#111827]' : 'text-[#6b7280]'
							}`}> 
							{t('instructor.classes.month')}
						</Text>
					</TouchableOpacity>
				</View>

				{/* Calendario */}
				<View className='mb-6'>
					{viewMode === 'week' ? (
						<WeekCalendar
							onDateSelect={handleDaySelect}
							markedDates={markedDates}
							initialDate={selectedDate}
						/>
					) : (
						<MonthCalendar
							onDateSelect={handleDaySelect}
							markedDates={markedDates}
							initialDate={selectedDate}
						/>
					)}
				</View>

				{/* Lista de clases del día */}
				<View className='mb-2'>
					<ThemedText
						lightColor='#111827'
						style={{ fontFamily: 'BebasNeue-Regular', fontSize: 22 }}>
						{t('instructor.classes.classesOfDay')}
					</ThemedText>
				</View>

				{classesForSelectedDate.length === 0 ? (
					<Text className='text-[14px] text-[#6b7280]'>
						{t('instructor.classes.noClasses')}
					</Text>
				) : (
						classesForSelectedDate.map((cls) => (
							<TouchableOpacity
								key={cls.id}
								activeOpacity={0.8}
								onPress={() =>
									router.push({
										pathname: '/class-details',
										params: {
											id: cls.id,
											title: cls.title,
											date: cls.date,
											time: cls.time,
											mode: 'instructor',
										},
									})
								}>
								<View className='mb-3 rounded-xl bg-white px-4 py-4 flex-row justify-between items-center border border-[#e5e7eb]'>
									<View className='flex-col flex-1 pr-3'>
										<Text className='text-[14px] font-semibold text-[#111827]'>{cls.title}</Text>
										<Text className='mt-[2px] text-[12px] text-[#4b5563]'>
											{cls.date} · {cls.location}
										</Text>
										<View className='mt-3 flex-row items-center'>
											<ClockIcon width={14} height={14} color='#f97316' />
											<Text className='ml-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#f97316]'>
												{cls.time} ({cls.durationMinutes} MIN)
											</Text>
										</View>
									</View>
									<View className='flex-row items-center rounded-full bg-white px-3 py-1 border border-[#f97316]'>
										<Text className='text-[12px] font-medium text-[#111827]'>
											{cls.occupied}/{cls.capacity}
										</Text>
										<ChevronRightIcon
											width={12}
											height={12}
											color='#f97316'
											style={{ marginLeft: 4 }}
										/>
									</View>
								</View>
							</TouchableOpacity>
					))
				)}
			</ScrollView>
		</ThemedView>
	);
}
