import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { Text } from 'react-native';

export default function ClassesScreen() {
	return (
		<ThemedView className='flex-1 justify-center items-center bg-white dark:bg-neutral-950'>
			<Text className='text-lg text-gray-500'>Vista de Clases (Instructor)</Text>
		</ThemedView>
	);
}
