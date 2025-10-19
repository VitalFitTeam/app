import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const days = [
	{ label: 'MO', date: 19 },
	{ label: 'TU', date: 20 },
	{ label: 'WE', date: 21 },
	{ label: 'TH', date: 22 },
	{ label: 'FR', date: 23 },
	{ label: 'SA', date: 24 },
	{ label: 'SU', date: 25 },
];

export const WeekCalendar: React.FC = () => {
	const [selectedDay, setSelectedDay] = useState('SU');

	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				borderWidth: 0.75,
				borderColor: '#BBBBBB',
				borderRadius: 10,
				padding: 16,
				width: screenWidth - 32,
				alignSelf: 'center',
				height: 94,
				backgroundColor: '#FFFFFF',
			}}>
			{days.map((day) => {
				const isSelected = day.label === selectedDay;

				return (
					<TouchableOpacity
						key={day.label}
						onPress={() => setSelectedDay(day.label)}
						activeOpacity={0.8}
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							width: (screenWidth - 32 - 6 * 4) / 7,
							height: 62,
							borderRadius: 16,
							paddingVertical: 12,
							gap: 4,
							backgroundColor: isSelected ? '#F27F2A' : 'transparent',
						}}>
						<Text
							style={{
								fontFamily: 'Montserrat_500Medium',
								fontSize: 13,
								fontWeight: '500',
								color: isSelected ? '#FFFFFF' : '#8F9098',
							}}>
							{day.label}
						</Text>
						<Text
							style={{
								fontFamily: 'Montserrat_600SemiBold',
								fontSize: 15,
								fontWeight: '600',
								color: isSelected ? '#FFFFFF' : '#494A50',
							}}>
							{day.date}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};
