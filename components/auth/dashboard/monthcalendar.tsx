import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

type MonthCalendarProps = {
	onDateSelect?: (date: DateData) => void;
	markedDates?: {
		[date: string]: {
			marked?: boolean;
			dotColor?: string;
			selected?: boolean;
			selectedColor?: string;
		};
	};
	initialDate?: string;
	onMonthChange?: (date: DateData) => void;
};

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
	onDateSelect,
	onMonthChange,
	markedDates = {},
	initialDate,
}) => {
	return (
		<View style={styles.wrapper}>
			<Calendar
				initialDate={initialDate}
				markedDates={markedDates}
				onDayPress={(day) => onDateSelect?.(day)}
				onMonthChange={(month) => onMonthChange?.(month)}
				theme={{
					backgroundColor: '#ffffff',
					calendarBackground: '#ffffff',
					textSectionTitleColor: '#6B7280',
					monthTextColor: '#111827',
					dayTextColor: '#111827',
					todayTextColor: '#F97316',
					textDisabledColor: '#D1D5DB',
					arrowColor: '#111827',
					selectedDayBackgroundColor: '#F97316',
					selectedDayTextColor: '#FFFFFF',
				}}
				hideExtraDays={false}
				enableSwipeMonths
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		borderWidth: 1,
		borderColor: '#e5e7eb',
		borderRadius: 12,
		overflow: 'hidden',
	},
});

export default MonthCalendar;
