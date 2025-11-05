import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CheckCircleIcon, MagnifyingGlassIcon, QrCodeIcon } from 'react-native-heroicons/mini';

export function ValidateCheckInCard() {
	return (
		<View className='bg-white dark:bg-neutral-900 rounded-2xl p-4 mt-4 shadow-sm border border-neutral-200 dark:border-neutral-800'>
			<View className='flex-row items-center mb-3'>
				<CheckCircleIcon width={20} height={20} color='#0F172A' />
				<Text className='ml-2 text-[16px] font-semibold text-neutral-900 dark:text-white'>
					Validar Check-in
				</Text>
			</View>

			<View className='flex-row items-center border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 mb-3'>
				<MagnifyingGlassIcon width={18} height={18} color='#0F172A' />
				<TextInput
					placeholder='Buscar por documento de identidad'
					placeholderTextColor='#71727A'
					className='ml-2 flex-1 text-[15px] text-neutral-900 dark:text-white'
				/>
			</View>

			<TouchableOpacity
				activeOpacity={0.8}
				className='flex-row items-center justify-center border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2'>
				<QrCodeIcon width={16} height={16} color='#0F172A' />
				<Text className='ml-2 text-[15px] font-medium text-neutral-900 dark:text-white'>
					Escanear QR
				</Text>
			</TouchableOpacity>
		</View>
	);
}
