import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BellIcon, Cog6ToothIcon } from 'react-native-heroicons/outline';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';

// Mock Data for notifications
const mockNotifications = [
	{
		id: '1',
		title: 'New offer available',
		description: 'Get 20% off your next purchase! Offer ends in 3 days.',
	},
	{
		id: '2',
		title: 'New offer available',
		description: 'Get 20% off your next purchase! Offer ends in 3 days.',
	},
	{
		id: '3',
		title: 'New offer available',
		description: 'Get 20% off your next purchase! Offer ends in 3 days.',
	},
	{
		id: '4',
		title: 'New offer available',
		description: 'Get 20% off your next purchase! Offer ends in 3 days.',
	},
	{
		id: '5',
		title: 'New offer available',
		description: 'Get 20% off your next purchase! Offer ends in 3 days.',
	},
	{
		id: '6',
		title: 'New offer available',
		description: 'Get 20% off your next purchase! Offer ends in 3 days.',
	},
];

// Notification Item Component
const NotificationItem = ({ title, description }: { title: string; description: string }) => (
	<View className='flex-row items-start p-4 bg-white dark:bg-neutral-900'>
		<View className='w-12 h-12 rounded-lg bg-neutral-200 dark:bg-neutral-800 items-center justify-center mr-3'>
			<BellIcon size={24} color='#f97316' />
		</View>
		<View className='flex-1'>
			<Text style={{ fontSize: 14, fontWeight: '600', color: '#000000', marginBottom: 4 }}>
				{title}
			</Text>
			<Text style={{ fontSize: 12, color: '#9ca3af', lineHeight: 18 }}>{description}</Text>
		</View>
	</View>
);

export default function NotificationsScreen() {
	const router = useRouter();

	return (
		<View className='flex-1 bg-white dark:bg-neutral-900'>
			<Stack.Screen options={{ headerShown: false }} />

			{/* Header */}
			<View className='flex-row items-center justify-between pt-14 pb-4 px-4 bg-white dark:bg-neutral-900'>
				<TouchableOpacity onPress={() => router.back()} className='p-2'>
					<ChevronLeftIcon size={28} color='#F27F2A' />
				</TouchableOpacity>
				<ThemedText className='text-xl font-bold' style={{ fontFamily: Fonts.title }}>
					Notificaciones
				</ThemedText>
				<TouchableOpacity
					onPress={() => router.push('/notification-settings')}
					className='p-2'>
					<Cog6ToothIcon size={28} color='#000' />
				</TouchableOpacity>
			</View>

			<ScrollView>
				{mockNotifications.map((item) => (
					<NotificationItem
						key={item.id}
						title={item.title}
						description={item.description}
					/>
				))}
			</ScrollView>
		</View>
	);
}
