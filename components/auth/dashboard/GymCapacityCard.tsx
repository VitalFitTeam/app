import React from 'react';
import { Text, View } from 'react-native';
import { UsersIcon } from 'react-native-heroicons/mini';

export function GymCapacityCard() {
	const totalCapacity = 100;
	const currentOccupancy = 45;
	const occupancyPercentage = Math.round((currentOccupancy / totalCapacity) * 100);
	const availableSpaces = totalCapacity - currentOccupancy;

	return (
		<View className='bg-white dark:bg-neutral-900 rounded-2xl p-4 mt-4 shadow-sm border border-neutral-200 dark:border-neutral-800'>
			<View className='flex-row items-center mb-2'>
				<UsersIcon width={20} height={20} color='#0F172A' />
				<Text className='ml-2 text-[16px] font-semibold text-neutral-900 dark:text-white'>
					Aforo del Gimnasio
				</Text>
			</View>

			<Text className='text-[14px] text-neutral-700 dark:text-neutral-400 mb-3'>
				Capacidad actual en tiempo real
			</Text>

			<View className='flex-row items-end justify-between mb-3'>
				<Text className='text-[15px] text-neutral-800 dark:text-neutral-400 font-medium'>
					Ocupación
				</Text>
				<Text
					style={{ fontFamily: 'BebasNeue-Regular' }}
					className='text-[39px] leading-none text-black dark:text-white'>
					{currentOccupancy}/{totalCapacity}
				</Text>
			</View>

			<View className='flex-row items-center justify-between'>
				<View className='bg-neutral-100 dark:bg-neutral-800 rounded-lg px-3 py-1'>
					<Text className='text-[13px] text-neutral-900 dark:text-white font-medium'>
						{occupancyPercentage}% Ocupado
					</Text>
				</View>
				<Text className='text-[13px] text-neutral-600 dark:text-neutral-400'>
					{availableSpaces} espacios disponibles
				</Text>
			</View>
		</View>
	);
}
