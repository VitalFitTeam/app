import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Home } from 'lucide-react-native';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
				tabBarButton: HapticTab,
			}}>
			<Tabs.Screen
				name='dashboard'
				options={{
					title: 'Inicio',
					tabBarIcon: ({ color }) => <Home color={color} size={28} strokeWidth={1.5} />,
				}}
			/>
		</Tabs>
	);
}
