import { Flag2, Profile2User } from 'iconsax-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { CalendarDaysIcon, CheckCircleIcon } from 'react-native-heroicons/mini';

export function InstructorStatsCardGroup() {
	return (
		<View className='flex flex-wrap flex-row justify-between px-2 mt-4'>
			{/* ✅ Check-ins Mensual */}
			<View className='w-[48%] bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4 shadow-sm border border-neutral-200 dark:border-neutral-800'>
				<View className='flex-row items-center justify-center mb-1'>
					<CheckCircleIcon width={20} height={20} color='#22C55E' />
					<Text className='ml-1 text-[16px] font-medium text-neutral-900 dark:text-white text-center'>
						Check-ins Mensual
					</Text>
				</View>
				<Text className='text-center text-[24px] font-semibold text-neutral-900 dark:text-white mt-1'>
					234
				</Text>
			</View>

			{/* 📅 Clases Esta Semana */}
			<View className='w-[48%] bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4 shadow-sm border border-neutral-200 dark:border-neutral-800'>
				<View className='flex-row items-center justify-center mb-1'>
					<CalendarDaysIcon width={19.2} height={19.2} color='#F17B23' />
					<Text className='ml-1 text-[16px] font-medium text-neutral-900 dark:text-white text-center'>
						Clases Esta Semana
					</Text>
				</View>
				<Text className='text-center text-[24px] font-semibold text-neutral-900 dark:text-white mt-1'>
					23
				</Text>
			</View>

			{/* 👥 Mensajes Nuevos */}
			<View className='w-[48%] bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4 shadow-sm border border-neutral-200 dark:border-neutral-800'>
				<View className='flex-row items-center justify-center mb-1'>
					<Profile2User size={24} color='#9747FF' variant='Bold' />
					<Text className='ml-1 text-[16px] font-medium text-neutral-900 dark:text-white text-center'>
						Mensajes Nuevos
					</Text>
				</View>
				<Text className='text-center text-[24px] font-semibold text-neutral-900 dark:text-white mt-1'>
					234
				</Text>
			</View>

			{/* 🚩 Rutinas Asignadas */}
			<View className='w-[48%] bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4 shadow-sm border border-neutral-200 dark:border-neutral-800'>
				<View className='flex-row items-center justify-center mb-1'>
					<Flag2 size={24} color='#E1491B' variant='Bold' />
					<Text className='ml-1 text-[16px] font-medium text-neutral-900 dark:text-white text-center'>
						Rutinas Asignadas
					</Text>
				</View>
				<Text className='text-center text-[24px] font-semibold text-neutral-900 dark:text-white mt-1'>
					+12%
				</Text>
			</View>
		</View>
	);
}
