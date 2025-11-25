import { Dumbbell } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { CheckCircleIcon, UsersIcon } from 'react-native-heroicons/outline';

type InstructorStats = {
	activeClients: number;
	classesToday: number;
	attendanceRate: number; // porcentaje 0-100
};

type Props = {
	stats?: InstructorStats;
};

export function InstructorStatsCardGroup({ stats }: Props) {
	const data: InstructorStats =
		stats ?? ({ activeClients: 24, classesToday: 2, attendanceRate: 89 } as InstructorStats);

	const cards = [
		{
			label: 'Clientes Activos',
			value: `${data.activeClients}`,
			icon: <UsersIcon size={16} color='#f97316' />,
		},
		{
			label: 'Clases Hoy',
			value: `${data.classesToday}`,
			icon: <Dumbbell size={16} color='#f97316' strokeWidth={1.8} />,
		},
		{
			label: 'Tasa Asistencia',
			value: `${data.attendanceRate}%`,
			icon: <CheckCircleIcon size={16} color='#f97316' />,
		},
	];

	return (
		<View className='flex-row justify-between mt-6 px-2'>
			{cards.map((card) => (
				<View
					key={card.label}
					className='w-[30%] bg-white rounded-2xl px-2 py-3 border border-[#f97316] shadow-sm'>
					<View className='items-center mb-1'>{card.icon}</View>
					<Text className='text-center text-[18px] font-semibold text-[#111827]'>
						{card.value}
					</Text>
					<Text className='mt-1 text-center text-[10px] text-[#4b5563]'>{card.label}</Text>
				</View>
			))}
		</View>
	);
}
