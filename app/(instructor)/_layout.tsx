import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
	CalendarIcon,
	ChatBubbleLeftRightIcon,
	ClipboardDocumentListIcon,
	HomeIcon,
	UserGroupIcon,
	UserIcon,
} from 'react-native-heroicons/solid';

export default function InstructorLayout() {
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
				name='classes'
				options={{
					title: 'Clases',
					tabBarIcon: ({ color }) => <CalendarIcon color={color} size={28} />,
				}}
			/>
			<Tabs.Screen
				name='clients'
				options={{
					title: 'Clientes',
					tabBarIcon: ({ color }) => <UserGroupIcon color={color} size={28} />,
				}}
			/>
			<Tabs.Screen
				name='routines'
				options={{
					title: 'Rutinas',
					tabBarIcon: ({ color }) => (
						<ClipboardDocumentListIcon color={color} size={28} />
					),
				}}
			/>
			<Tabs.Screen
				name='chat'
				options={{
					title: 'Chat',
					tabBarIcon: ({ color }) => <ChatBubbleLeftRightIcon color={color} size={28} />,
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
