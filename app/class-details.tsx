import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function ClassDetailsScreen() {
	const { time, title, instructor, imageUrl } = useLocalSearchParams();

	return (
		<ThemedView className='flex-1 bg-white dark:bg-neutral-950 p-4'>
			<ScrollView showsVerticalScrollIndicator={false}>
				<Image
					source={{ uri: imageUrl as string }}
					style={styles.heroImage}
					contentFit='cover'
				/>

				<ThemedText className='text-3xl font-bold mt-6 mb-2'>{title as string}</ThemedText>

				<View className='mb-6'>
					<ThemedText className='text-lg font-semibold mb-1'>
						Instructor: {instructor as string}
					</ThemedText>
					<ThemedText className='text-lg font-semibold mb-1'>
						Hora: {time as string}
					</ThemedText>
				</View>

				<View className='flex-row justify-between mb-6'>
					<View className='w-1/2 pr-2'>
						<SecondaryButton title='Añadir al Calendario' onPress={() => {}} />
					</View>
					<View className='w-1/2 pl-2'>
						<PrimaryButton title='Reservar' onPress={() => {}} />
					</View>
				</View>
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	heroImage: {
		width: '100%',
		height: 200,
		borderRadius: 16,
	},
});
