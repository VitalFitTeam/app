import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Dumbbell } from 'lucide-react-native';
import { CalendarIcon, HomeIcon, UserIcon, UsersIcon } from 'react-native-heroicons/solid';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: '#f97316',
				tabBarInactiveTintColor: '#a1a1aa',
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarStyle: {
					backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
					borderTopWidth: 0,
				},
			}}>
			<Tabs.Screen
				name='dashboard'
				options={{
					title: 'Inicio',
					tabBarIcon: ({ color }) => <HomeIcon color={color} size={28} />,
				}}
			/>
			<Tabs.Screen
				name='horarios'
				options={{
					title: 'Horarios',
					tabBarIcon: ({ color }) => <CalendarIcon color={color} size={28} />,
				}}
			/>
			<Tabs.Screen
				name='entrenamiento'
				options={{
					title: 'Entrenamiento',
					tabBarIcon: ({ color }) => (
						<Dumbbell color={color} size={28} strokeWidth={1.5} />
					),
				}}
			/>
			<Tabs.Screen
				name='comunidad'
				options={{
					title: 'Comunidad',
					tabBarIcon: ({ color }) => <UsersIcon color={color} size={28} />,
				}}
			/>
			<Tabs.Screen
				name='perfil'
				options={{
					title: 'Perfil',
					tabBarIcon: ({ color }) => <UserIcon color={color} size={28} />,
				}}
			/>
		</Tabs>
	);
}
