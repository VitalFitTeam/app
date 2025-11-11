import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

type ClassData = {
	time: string;
	title: string;
	instructor: string;
	branch: string;
	imageUrl: string | number;
};

type ClassCardProps = {
	time: string;
	title: string;
	instructor: string;
	branch: string;
	imageUrl: string | number;
	onPress: (classData: ClassData) => void;
	variant?: 'default' | 'overlay';
	category?: string;
	reserved?: boolean;
};

export default function ClassCard({
	time,
	title,
	instructor,
	branch,
	imageUrl,
	onPress,
	variant = 'default',
	category,
	reserved,
}: ClassCardProps) {
	const classData: ClassData = { time, title, instructor, branch, imageUrl };

	if (variant === 'overlay') {
		return (
			<TouchableOpacity
				onPress={() => onPress(classData)}
				className='rounded-2xl overflow-hidden mb-4'>
				<View className='h-44 w-full rounded-2xl overflow-hidden'>
					<Image
						source={imageUrl}
						style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
						contentFit='cover'
						contentPosition='center'
					/>
					<View className='absolute inset-0 bg-black/35' />
					<View className='absolute inset-0 p-4 justify-between'>
						<View className='flex-row justify-between items-start'>
							<View>
								<ThemedText className='text-white text-xl font-extrabold'>
									{title}
								</ThemedText>
								<ThemedText className='text-white/90 mt-1 font-semibold'>
									Today, {time}
								</ThemedText>
								<ThemedText className='text-white/80 text-xs mt-1'>
									Disponibilidad
								</ThemedText>
							</View>
							{!!(category || branch) && (
								<View className='bg-white/20 rounded-full px-3 py-1'>
									<ThemedText className='text-white text-xs font-semibold'>
										{category || 'categoría'}
									</ThemedText>
								</View>
							)}
						</View>
						<View className='flex-row'>
							<ThemedText className='text-white/80 text-xs'>
								{instructor.replace(/^Con\s+/i, '')}
							</ThemedText>
						</View>
					</View>
					{reserved ? (
						<View className='absolute top-3 left-3 bg-orange-500 rounded-full px-2 py-1'>
							<ThemedText className='text-white text-xs font-bold'>
								Reservado
							</ThemedText>
						</View>
					) : null}
				</View>
			</TouchableOpacity>
		);
	}

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
			<View style={{ width: 112, height: 84 }} className='rounded-xl overflow-hidden'>
				<Image
					source={imageUrl}
					style={{ width: '100%', height: '100%' }}
					contentFit='cover'
					contentPosition='center'
				/>
			</View>
		</TouchableOpacity>
	);
}
