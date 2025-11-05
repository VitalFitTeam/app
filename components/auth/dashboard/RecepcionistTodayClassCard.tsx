import { Dumbbell } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CheckCircleIcon, ClockIcon, UserIcon, UsersIcon } from 'react-native-heroicons/mini';

export function RecepcionistTodayClassCard() {
	return (
		<View className='bg-white dark:bg-neutral-900 rounded-2xl border border-[#BBBBBB] p-4 mt-4'>
			<View className='flex-row items-center mb-3'>
				<CheckCircleIcon width={16} height={16} color='#0F172A' />
				<Text className='ml-2 text-[16px] font-semibold text-neutral-900 dark:text-white'>
					Clases de Hoy
				</Text>
			</View>

			<Text className='text-[14px] text-neutral-700 dark:text-neutral-400 mb-4'>
				Horario y asistencia
			</Text>

			{[1, 2].map((_, index) => (
				<View
					key={index}
					className='border border-[#BBBBBB] rounded-xl mb-4 p-4 bg-white dark:bg-neutral-800'>
					<View className='flex-row justify-between items-start mb-3'>
						<View className='flex-row items-center'>
							<View className='bg-[#F2F4F5] rounded-md p-2 mr-2'>
								<Dumbbell width={35} height={35} color='#F27F2A' />
							</View>
							<View>
								<Text className='text-[16px] font-extrabold text-neutral-900 dark:text-white leading-tight'>
									POWERLIFTING
								</Text>
								<Text className='text-[16px] font-extrabold text-[#F27F2A] leading-tight'>
									AVANZADO
								</Text>
							</View>
						</View>

						<View className='border border-[#0F172A] rounded-full px-3 py-1'>
							<Text className='text-[12px] font-semibold text-[#0F172A]'>
								EN CURSO
							</Text>
						</View>
					</View>

					<View className='gap-2 mb-3'>
						<View className='flex-row items-center'>
							<UserIcon width={14} height={14} color='#0F172A' />
							<Text className='ml-2 text-[14px] text-neutral-800 dark:text-neutral-300'>
								CARLOS RUÍZ
							</Text>
						</View>

						<View className='flex-row items-center'>
							<ClockIcon width={16} height={16} color='#0F172A' />
							<Text className='ml-2 text-[14px] text-neutral-800 dark:text-neutral-300'>
								07:00 (90 MIN)
							</Text>
						</View>

						<View className='flex-row items-center'>
							<UsersIcon width={17} height={16} color='#0F172A' />
							<Text className='ml-2 text-[14px] text-neutral-800 dark:text-neutral-300'>
								8/121 INSCRITOS
							</Text>
						</View>
					</View>

					<TouchableOpacity
						activeOpacity={0.8}
						className='border border-[#F27F2A] rounded-xl py-2 mt-1'>
						<Text className='text-center text-[#F27F2A] font-medium text-[14px]'>
							Ver detalles
						</Text>
					</TouchableOpacity>
				</View>
			))}
		</View>
	);
}
