import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Dumbbell } from 'lucide-react-native';
import { View } from 'react-native';
import { CalendarIcon, HomeIcon, UserIcon, UsersIcon } from 'react-native-heroicons/solid';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: '#f97316',
				tabBarInactiveTintColor: '#a1a1aa',
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarStyle: {
					backgroundColor: '#1f2937',
					borderTopWidth: 0,
					borderRadius: 16,
					marginHorizontal: 16,
					height: 56,
					position: 'absolute',
					left: 16,
					right: 16,
					bottom: 0,
					paddingHorizontal: 8,
					overflow: 'hidden',
					elevation: 0,
					paddingBottom: 0,
					paddingTop: 0,
				},
				tabBarItemStyle: {
					justifyContent: 'center',
					alignItems: 'center',
					height: 56,
					paddingVertical: 0,
					paddingTop: 0,
					paddingBottom: 0,
					margin: 0,
				},
				tabBarIconStyle: {
					marginTop: 0,
					marginBottom: 0,
				},
				tabBarShowLabel: false,
				tabBarLabel: () => null,
			}}>
			<Tabs.Screen
				name='dashboard'
				options={{
					title: 'Inicio',
					tabBarIcon: ({ focused }) => (
						<View
							style={{
								backgroundColor: focused ? '#f97316' : 'transparent',
								borderRadius: 12,
								width: 44,
								height: 44,
								alignItems: 'center',
								justifyContent: 'center',
								marginTop: 16,
							}}>
							<HomeIcon color={focused ? '#fff' : '#a1a1aa'} size={24} />
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name='schedule'
				options={{
					title: 'Horarios',
					tabBarIcon: ({ focused }) => (
						<View
							style={{
								backgroundColor: focused ? '#f97316' : 'transparent',
								borderRadius: 12,
								width: 44,
								height: 44,
								alignItems: 'center',
								justifyContent: 'center',
								marginTop: 16,
							}}>
							<CalendarIcon color={focused ? '#fff' : '#a1a1aa'} size={24} />
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name='training'
				options={{
					title: 'Entrenamiento',
					tabBarIcon: ({ focused }) => (
						<View
							style={{
								backgroundColor: focused ? '#f97316' : 'transparent',
								borderRadius: 12,
								width: 44,
								height: 44,
								alignItems: 'center',
								justifyContent: 'center',
								marginTop: 16,
							}}>
							<Dumbbell
								color={focused ? '#fff' : '#a1a1aa'}
								size={24}
								strokeWidth={1.5}
							/>
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name='community'
				options={{
					title: 'Comunidad',
					tabBarIcon: ({ focused }) => (
						<View
							style={{
								backgroundColor: focused ? '#f97316' : 'transparent',
								borderRadius: 12,
								width: 44,
								height: 44,
								alignItems: 'center',
								justifyContent: 'center',
								marginTop: 16,
							}}>
							<UsersIcon color={focused ? '#fff' : '#a1a1aa'} size={24} />
						</View>
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Perfil',
					tabBarIcon: ({ focused }) => (
						<View
							style={{
								backgroundColor: focused ? '#f97316' : 'transparent',
								borderRadius: 12,
								width: 44,
								height: 44,
								alignItems: 'center',
								justifyContent: 'center',
								marginTop: 16,
							}}>
							<UserIcon color={focused ? '#fff' : '#a1a1aa'} size={24} />
						</View>
					),
				}}
			/>
		</Tabs>
	);
}
