import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { Text } from 'react-native';

export default function RoutinesScreen() {
	return (
		<ThemedView className='flex-1 justify-center items-center bg-white dark:bg-neutral-950'>
			<Text className='text-lg text-gray-500'>Vista de Rutinas (Instructor)</Text>
		</ThemedView>
	);
}
