import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

type ClassData = {
	time: string;
	title: string;
	instructor: string;
	branch: string;
	imageUrl: string;
};

type ClassCardProps = {
	time: string;
	title: string;
	instructor: string;
	branch: string;
	imageUrl: string;
	onPress: (classData: ClassData) => void;
};

export default function ClassCard({
	time,
	title,
	instructor,
	branch,
	imageUrl,
	onPress,
}: ClassCardProps) {
	const classData: ClassData = { time, title, instructor, branch, imageUrl };

	return (
		<TouchableOpacity
			onPress={() => onPress(classData)}
			className='bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4 flex-row items-center'>
			<View className='flex-1'>
				<ThemedText className='text-sm text-neutral-500'>{time}</ThemedText>
				<ThemedText className='text-xl font-bold mt-1'>{title}</ThemedText>
				<ThemedText className='text-sm text-neutral-500 mt-1'>
					{instructor} · {branch}
				</ThemedText>
				<TouchableOpacity
					onPress={() => onPress(classData)}
					className='bg-neutral-100 dark:bg-neutral-800 rounded-full py-2 px-4 mt-4 self-start'>
					<ThemedText className='font-semibold'>Ver Detalles</ThemedText>
				</TouchableOpacity>
			</View>
			<Image source={imageUrl} style={{ width: 100, height: 100, borderRadius: 12 }} />
		</TouchableOpacity>
	);
}
