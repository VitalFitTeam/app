import { Flag2, Profile2User } from 'iconsax-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { CalendarDaysIcon, CheckCircleIcon } from 'react-native-heroicons/mini';

export function RecepcionistStatsCardGroup() {
	const { t } = useTranslation();
	return (
		<View className='flex flex-wrap flex-row justify-between px-2 mt-4'>
			<View className='w-[48%] bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4 shadow-sm border border-neutral-200 dark:border-neutral-800'>
				<View className='flex-row items-center justify-center mb-1'>
					<CheckCircleIcon width={24} height={24} color='#22C55E' />
					<Text className='ml-1 text-[16px] font-medium text-neutral-900 dark:text-white text-center'>
						{t('dashboard.stats.monthlyCheckins')}
					</Text>
				</View>
				<Text className='text-center text-[24px] font-semibold text-neutral-900 dark:text-white mt-1'>
					234
				</Text>
			</View>

			<View className='w-[48%] bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4 shadow-sm border border-neutral-200 dark:border-neutral-800'>
				<View className='flex-row items-center justify-center mb-1'>
					<CalendarDaysIcon width={24} height={24} color='#F17B23' />
					<Text className='ml-1 text-[16px] font-medium text-neutral-900 dark:text-white text-center'>
						{t('dashboard.stats.classesToday')}
					</Text>
				</View>
				<Text className='text-center text-[24px] font-semibold text-neutral-900 dark:text-white mt-1'>
					23
				</Text>
			</View>

			<View className='w-[48%] bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4 shadow-sm border border-neutral-200 dark:border-neutral-800'>
				<View className='flex-row items-center justify-center mb-1'>
					<Profile2User size={24} color='#9747FF' variant='Bold' />
					<Text className='ml-1 text-[16px] font-medium text-neutral-900 dark:text-white text-center'>
						{t('dashboard.stats.currentCapacity')}
					</Text>
				</View>
				<Text className='text-center text-[24px] font-semibold text-neutral-900 dark:text-white mt-1'>
					234
				</Text>
			</View>

			<View className='w-[48%] bg-white dark:bg-neutral-900 rounded-2xl p-4 mb-4 shadow-sm border border-neutral-200 dark:border-neutral-800'>
				<View className='flex-row items-center justify-center mb-1'>
					<Flag2 size={24} color='#E1491B' variant='Bold' />
					<Text className='ml-1 text-[16px] font-medium text-neutral-900 dark:text-white text-center'>
						{t('dashboard.stats.vsYesterday')}
					</Text>
				</View>
				<Text className='text-center text-[24px] font-semibold text-neutral-900 dark:text-white mt-1'>
					+12%
				</Text>
			</View>
		</View>
	);
}
