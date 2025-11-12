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
};

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
	onDateSelect,
	markedDates = {},
	initialDate,
}) => {
	return (
		<View style={styles.wrapper}>
			<Calendar
				initialDate={initialDate}
				markedDates={markedDates}
				onDayPress={(day) => onDateSelect?.(day)}
				theme={{
					backgroundColor: '#0a0a0a',
					calendarBackground: '#0a0a0a',
					textSectionTitleColor: '#9CA3AF',
					monthTextColor: '#E5E7EB',
					dayTextColor: '#E5E7EB',
					todayTextColor: '#F27F2A',
					textDisabledColor: '#4B5563',
					arrowColor: '#E5E7EB',
					selectedDayBackgroundColor: '#F27F2A',
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
		borderWidth: 0.75,
		borderColor: '#1F1F1F',
		borderRadius: 10,
		overflow: 'hidden',
	},
});

export default MonthCalendar;
