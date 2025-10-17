//calendario
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const days = [
	{ label: 'L', date: 6 },
	{ label: 'M', date: 7 },
	{ label: 'X', date: 8 },
	{ label: 'J', date: 9 },
	{ label: 'V', date: 10 },
	{ label: 'S', date: 11 },
	{ label: 'D', date: 12 },
];

export const WeekCalendar: React.FC = () => {
	const [selectedDay, setSelectedDay] = useState('L');

	return (
		<View className='flex-row justify-between mb-6'>
			{days.map((day) => {
				const isSelected = day.label === selectedDay;
				return (
					<TouchableOpacity
						key={day.label}
						onPress={() => setSelectedDay(day.label)}
						className={`items-center justify-center w-12 h-16 rounded-2xl ${
							isSelected ? 'bg-blue-600' : 'bg-gray-100 dark:bg-neutral-800'
						}`}>
						<Text className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
							{day.label}
						</Text>
						<Text
							className={`text-sm font-semibold ${
								isSelected ? 'text-white' : 'text-gray-800 dark:text-gray-100'
							}`}>
							{day.date}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};
