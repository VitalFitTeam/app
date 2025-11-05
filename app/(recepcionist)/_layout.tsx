import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { HomeIcon, QrCodeIcon, UserIcon, UsersIcon } from 'react-native-heroicons/solid';

export default function RecepcionistLayout() {
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
				name='check-in'
				options={{
					title: 'Check-in',
					tabBarIcon: ({ color }) => <QrCodeIcon color={color} size={28} />,
				}}
			/>
			<Tabs.Screen
				name='members'
				options={{
					title: 'Miembros',
					tabBarIcon: ({ color }) => <UsersIcon color={color} size={28} />,
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Perfil',
					tabBarIcon: ({ color }) => <UserIcon color={color} size={28} />,
				}}
			/>
		</Tabs>
	);
}
