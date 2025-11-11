import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DateData } from 'react-native-calendars';

const { width: screenWidth } = Dimensions.get('window');

interface DayData {
	label: string;
	date: number;
	dateString: string;
	fullDate: Date;
	hasEvent?: boolean;
}

interface WeekCalendarProps {
	onDateSelect?: (date: DateData) => void;
	markedDates?: { [date: string]: { marked?: boolean; dotColor?: string } };
	initialDate?: string;
}

const EMPTY_MARKED_DATES: { [date: string]: { marked?: boolean; dotColor?: string } } = {};

export const WeekCalendar: React.FC<WeekCalendarProps> = ({
	onDateSelect,
	markedDates = EMPTY_MARKED_DATES,
	initialDate,
}) => {
	const [selectedDateString, setSelectedDateString] = useState(
		initialDate || new Date().toISOString().split('T')[0],
	);
	const [weekDays, setWeekDays] = useState<DayData[]>([]);

	useEffect(() => {
		const generateWeekDays = () => {
			const today = new Date();
			const currentDay = today.getDay();
			const monday = new Date(today);

			const diff = currentDay === 0 ? -6 : 1 - currentDay;
			monday.setDate(today.getDate() + diff);

			const days: DayData[] = [];
			const dayLabels = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];

			for (let i = 0; i < 7; i++) {
				const date = new Date(monday);
				date.setDate(monday.getDate() + i);

				const dateString = date.toISOString().split('T')[0];
				const hasEvent = markedDates[dateString]?.marked || false;

				days.push({
					label: dayLabels[i],
					date: date.getDate(),
					dateString: dateString,
					fullDate: date,
					hasEvent,
				});
			}

			setWeekDays(days);
		};

		generateWeekDays();
	}, [markedDates]);

	const handleDayPress = (day: DayData) => {
		setSelectedDateString(day.dateString);

		const dateData: DateData = {
			dateString: day.dateString,
			day: day.date,
			month: day.fullDate.getMonth() + 1,
			year: day.fullDate.getFullYear(),
			timestamp: day.fullDate.getTime(),
		};

		onDateSelect?.(dateData);
	};

	const isSelected = (day: DayData) => {
		return day.dateString === selectedDateString;
	};

	const isToday = (day: DayData) => {
		const today = new Date().toISOString().split('T')[0];
		return day.dateString === today;
	};

	return (
		<View style={styles.container}>
			{weekDays.map((day) => {
				const selected = isSelected(day);
				const today = isToday(day);

				return (
					<TouchableOpacity
						key={day.label}
						onPress={() => handleDayPress(day)}
						activeOpacity={0.8}
						style={[styles.dayButton, selected && styles.selectedDay]}>
						<Text style={[styles.dayLabel, selected && styles.selectedText]}>
							{day.label}
						</Text>
						<Text
							style={[
								styles.dateNumber,
								selected && styles.selectedText,
								today && !selected && styles.todayText,
							]}>
							{day.date}
						</Text>
						{day.hasEvent && !selected && <View style={styles.eventDot} />}
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: 0.75,
		borderColor: '#1F1F1F',
		borderRadius: 10,
		padding: 16,
		width: screenWidth - 32,
		alignSelf: 'center',
		height: 94,
		backgroundColor: '#0a0a0a',
	},
	dayButton: {
		alignItems: 'center',
		justifyContent: 'center',
		width: (screenWidth - 32 - 6 * 4) / 7,
		height: 62,
		borderRadius: 16,
		paddingVertical: 12,
		gap: 4,
		backgroundColor: 'transparent',
	},
	selectedDay: {
		backgroundColor: '#F27F2A',
	},
	dayLabel: {
		fontFamily: 'Montserrat_500Medium',
		fontSize: 13,
		fontWeight: '500',
		color: '#A3A3A3',
	},
	dateNumber: {
		fontFamily: 'Montserrat_600SemiBold',
		fontSize: 15,
		fontWeight: '600',
		color: '#E5E7EB',
	},
	selectedText: {
		color: '#FFFFFF',
	},
	todayText: {
		color: '#F27F2A',
	},
	eventDot: {
		position: 'absolute',
		bottom: 8,
		width: 4,
		height: 4,
		borderRadius: 2,
		backgroundColor: '#F27F2A',
	},
});
