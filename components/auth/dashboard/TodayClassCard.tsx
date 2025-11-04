import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CalendarDaysIcon, ChevronRightIcon, ClockIcon } from 'react-native-heroicons/mini';

export function TodayClassCard() {
	return (
		<View className='bg-white dark:bg-neutral-900 rounded-2xl p-4 mt-6 shadow-sm border border-neutral-200 dark:border-neutral-800'>
			<View className='flex-row items-center mb-2'>
				<CalendarDaysIcon width={20} height={20} color='#000000' />
				<Text className='ml-2 text-[16px] font-medium text-black dark:text-white'>
					Clase de hoy
				</Text>
			</View>

			<View className='bg-[#FFFFFF] dark:bg-neutral-800 rounded-xl p-4 flex-row justify-between items-center'>
				<View className='flex-col'>
					<Text className='text-[14px] font-bold text-[#1F2024] dark:text-white'>
						Powerlifting Avanzado
					</Text>
					<Text className='text-[12px] text-[#71727A] mt-[2px]'>
						15 de Noviembre del 2025
					</Text>

					<View className='flex-row items-center mt-2'>
						<ClockIcon width={14} height={14} color='#000000' />
						<Text className='ml-1 text-[10px] font-semibold uppercase tracking-[0.05em] text-black dark:text-white'>
							07:00 (90 MIN)
						</Text>
					</View>
				</View>

				<TouchableOpacity className='flex-row items-center bg-white dark:bg-neutral-900 rounded-lg px-3 py-1 border border-[#E5E5E5] dark:border-neutral-700'>
					<Text className='text-[12px] font-medium text-[#000] dark:text-white'>
						10/15
					</Text>
					<ChevronRightIcon
						width={12}
						height={12}
						color='#71727A'
						style={{ marginLeft: 4 }}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}
