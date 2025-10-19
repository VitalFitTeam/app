import { MembershipCard } from '@/components/auth/dashboard/membershipcard';
import { ProgressCard } from '@/components/auth/dashboard/progresscard';
import { ReservedClassesCard } from '@/components/auth/dashboard/reservedclasses';
import { TodayRoutineCard } from '@/components/auth/dashboard/todayroutinecard';
import { UserHeader } from '@/components/auth/dashboard/userheader';
import { WeekCalendar } from '@/components/auth/dashboard/weekcalendar';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function DashboardScreen() {
	const [firstName, setFirstName] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = await AsyncStorage.getItem('token');

				if (!token) {
					console.error('No se encontró token en AsyncStorage');
					return;
				}

				const response = await fetch(`${API_URL}/user/whoami`, {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				});

				const text = await response.text();

				if (!response.ok) {
					console.error('Error al obtener el usuario:', response.status);
					return;
				}

				const data = JSON.parse(text);
				setFirstName(data?.user?.first_name || 'Usuario');
			} catch (error) {
				console.error('Error en la solicitud:', error);
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
					avatarUrl='https://randomuser.me/api/portraits/women/45.jpg'
				/>
				<WeekCalendar />
				<MembershipCard daysRemaining={15} />
				<ProgressCard weekProgress={0.8} calories={1200} completed='4/5' />
				<ReservedClassesCard reserved={0} />
				<TodayRoutineCard
					title='Day 05 - Warm Up'
					time='07:00 - 08:00 AM'
					date='Mon 26 Apr'
				/>
			</ScrollView>
		</ThemedView>
	);
}
