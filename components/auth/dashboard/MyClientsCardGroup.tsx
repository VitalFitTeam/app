import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CalendarDaysIcon, ChevronRightIcon, UserCircleIcon } from 'react-native-heroicons/outline';

export function MyClientsCardGroup() {
	const clients = [
		{
			id: 1,
			name: 'Juan Perez',
			level: 'Nivel 5',
			program: 'Fuerza Máxima - Semana 2',
			avatar: null, // Podrías usar URL real más adelante
		},
		{
			id: 2,
			name: 'Juan Perez',
			level: 'Nivel 5',
			program: 'Fuerza Máxima - Semana 2',
			avatar: null,
		},
	];

	return (
		<View className='mt-6'>
			{/* 🧭 Header */}
			<View className='flex-row items-center mb-3'>
				<CalendarDaysIcon size={18} color='#000000' />
				<Text className='ml-2 text-[16px] font-medium text-[#000000]'>Mis Clientes</Text>
			</View>

			{/* 👥 Lista de clientes */}
			{clients.map((client) => (
				<TouchableOpacity
					key={client.id}
					className='flex-row items-center justify-between bg-[#F8F9FB] rounded-2xl px-4 py-3 mb-3'
					activeOpacity={0.8}>
					{/* Avatar */}
					<View className='w-10 h-10 rounded-full bg-[#CFE4FF] justify-center items-center mr-3'>
						<UserCircleIcon size={24} color='#62A3FF' />
					</View>

					{/* Info del cliente */}
					<View className='flex-1'>
						<Text className='text-[14px] font-bold text-[#1F2024]'>{client.name}</Text>
						<Text className='text-[12px] text-[#71727A]'>{client.level}</Text>
						<Text className='text-[16px] font-medium text-[#000000] mt-0.5'>
							{client.program}
						</Text>
					</View>

					{/* Flecha */}
					<ChevronRightIcon size={12} color='#71727A' />
				</TouchableOpacity>
			))}
		</View>
	);
}
