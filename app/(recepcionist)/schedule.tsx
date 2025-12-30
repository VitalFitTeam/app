import { MonthCalendar } from '@/components/auth/dashboard/monthcalendar';
import { WeekCalendar } from '@/components/auth/dashboard/weekcalendar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CalendarDaysIcon, FunnelIcon } from 'react-native-heroicons/outline';

type ViewMode = 'week' | 'month';

type ClassType = {
  id: string;
  name: string;
  date: string;
  time: string;
  capacity: number;
  enrolled: number;
  status: 'available' | 'full';
  instructor: string;
};

const sampleClasses: ClassType[] = [
  {
    id: '1',
    name: 'ZUMBA',
    date: '2025-11-27',
    time: '12:00 PM',
    capacity: 25,
    enrolled: 18,
    status: 'available',
    instructor: 'Laura Torres',
  },
  {
    id: '2',
    name: 'YOGA',
    date: '2025-11-27',
    time: '09:00 - 10:00 AM',
    capacity: 20,
    enrolled: 20,
    status: 'full',
    instructor: 'Carlos Ruíz',
  },
  {
    id: '3',
    name: 'SPINNING',
    date: '2025-11-27',
    time: '05:00 - 06:00 PM',
    capacity: 20,
    enrolled: 15,
    status: 'available',
    instructor: 'Ana Gómez',
  },
  {
    id: '4',
    name: 'CROSSFIT',
    date: '2025-11-28',
    time: '07:00 - 08:00 PM',
    capacity: 15,
    enrolled: 14,
    status: 'available',
    instructor: 'Pedro López',
  },
  {
    id: '5',
    name: 'PILATES AVANZADO',
    date: '2025-11-28',
    time: '07:00 - 08:00 PM',
    capacity: 15,
    enrolled: 15,
    status: 'available',
    instructor: 'María Fernández',
  }
];

const monthExtraClasses: ClassType[] = [
  {
    id: '6',
    name: 'PILATES AVANZADO',
    date: '2025-11-28',
    time: '09:00 - 10:00 AM',
    capacity: 18,
    enrolled: 12,
    status: 'available',
    instructor: 'María Fernández',
  },
];

export default function ScheduleScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredDate, setFilteredDate] = useState('');

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        router.replace('/(recepcionist)/dashboard');
        return true;
      });

      return () => backHandler.remove();
    }, [router])
  );

  const handleDateSelect = (date: { timestamp: number } | Date) => {
  
    const selectedDateObj =
      (date as { timestamp: number })?.timestamp
        ? new Date((date as { timestamp: number }).timestamp)
        : new Date(date as Date);
    setSelectedDate(selectedDateObj);
    
    const formattedDate = selectedDateObj.toISOString().split('T')[0];
    setFilteredDate(formattedDate);
  };
  const formatFullDate = (dateString: string) => {
    const [year, monthIndex, dayNumber] = dateString.split('-').map(Number);
    const date = new Date(year, (monthIndex || 1) - 1, dayNumber || 1);

    const day = date.getDate();
    const month = new Intl.DateTimeFormat(i18n.language, { month: 'long' }).format(date);
    const weekday = new Intl.DateTimeFormat(i18n.language, { weekday: 'long' }).format(date);

    const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

    return `${capitalizedWeekday}, ${day} ${t('common.of')} ${month}`;
  };
  

  const formatHeaderDate = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  };


  const groupClassesByDate = (classes: ClassType[]) => {
    return classes.reduce((groups, classItem) => {
      const date = classItem.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(classItem);
      return groups;
    }, {} as Record<string, ClassType[]>);
  };

  const weekClasses = filteredDate 
    ? sampleClasses.filter(item => item.date === filteredDate)
    : sampleClasses;

  const monthClasses = [
    ...sampleClasses,
    ...monthExtraClasses,
  ];

  const filteredClasses = viewMode === 'week' ? weekClasses : monthClasses;

  const groupedClasses = groupClassesByDate(filteredClasses);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/Frame.png')}
              style={styles.logo}
              resizeMode='contain'
            />
          </View>

          <View style={styles.viewSelectorContainer}>
            <View style={styles.viewSelector}>
              <TouchableOpacity
                style={[styles.viewOption, viewMode === 'week' && styles.activeViewOption]}
                onPress={() => setViewMode('week')}
              >
                <ThemedText style={[styles.viewOptionText, viewMode === 'week' && styles.activeViewText]}>
                  {t('schedule.week')}
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewOption, viewMode === 'month' && styles.activeViewOption]}
                onPress={() => setViewMode('month')}
              >
                <ThemedText style={[styles.viewOptionText, viewMode === 'month' && styles.activeViewText]}>
                  {t('schedule.month')}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.calendarContainer}>
          <ThemedText style={styles.sectionTitle}>{t('schedule.calendar')}</ThemedText>
          <View style={styles.calendarWrapper}>
            {viewMode === 'week' ? (
              <WeekCalendar onDateSelect={handleDateSelect} />
            ) : (
              <MonthCalendar onDateSelect={handleDateSelect} />
            )}
          </View>
        </View>

        <View style={styles.reservationsSection}>
          <View style={styles.reservationsHeader}>
            <ThemedText style={styles.sectionTitle}>{t('schedule.reservations')}</ThemedText>
            <TouchableOpacity style={styles.filterButton}>
              <FunnelIcon size={20} color='#6B7280' />
              <ThemedText style={styles.filterText}>{t('common.filter')}</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.dateHeader}>
            <CalendarDaysIcon size={20} color='#6B7280' />
            <ThemedText style={styles.dateHeaderText}>
              {formatHeaderDate(selectedDate).charAt(0).toUpperCase() + formatHeaderDate(selectedDate).slice(1)}
            </ThemedText>
          </View>
       
          <View style={styles.classesList}>
            {Object.entries(groupedClasses).map(([date, classes], index) => (
              <View key={date} style={styles.dateGroup}>
                {viewMode === 'month' && index > 0 && (
                  <View style={styles.dateHeader}>
                    <CalendarDaysIcon size={20} color='#6B7280' />
                    <ThemedText style={styles.dateHeaderText}>
                      {formatFullDate(date)}
                    </ThemedText>
                  </View>
                )}

                {classes.map((classItem) => (
                  <View key={classItem.id} style={styles.classCard}>
                    <View style={styles.classHeader}>
                      <ThemedText style={styles.className}>{classItem.name}</ThemedText>
                      <View style={[styles.statusBadge, classItem.status === 'available' ? styles.availableBadge : styles.fullBadge]}>
                        <ThemedText style={[styles.statusText, classItem.status === 'available' ? styles.availableText : styles.fullText]}>
                          {classItem.status === 'available' ? t('common.available') : t('common.full')}
                        </ThemedText>
                      </View>
                    </View>
                    
                    <View style={styles.classInfo}>
                      <ThemedText style={styles.classCapacity}>
                        {classItem.enrolled}/{classItem.capacity} {t('schedule.spotsOccupied')}
                      </ThemedText>
                      <ThemedText style={styles.classTime}>{classItem.time}</ThemedText>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.detailsButton}
                      onPress={() => {
                        router.push({
                          pathname: '/(recepcionist)/class-details',
                          params: {
                            id: classItem.id,
                            name: classItem.name,
                            date: classItem.date,
                            time: classItem.time,
                            capacity: String(classItem.capacity),
                            enrolled: String(classItem.enrolled),
                            status: classItem.status,
                            instructor: classItem.instructor,
                          },
                        });
                      }}
                    >
                      <ThemedText style={styles.detailsButtonText}>{t('common.viewDetails')}</ThemedText>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 70,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 20,
    marginTop: 20,
    zIndex: 100,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 200,
    height: 60,
  },
  viewSelectorContainer: {
    alignItems: 'center',
  },
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 4,
  },
  viewOption: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  activeViewOption: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewOptionText: {
    color: '#6B7280',
    fontWeight: '500',
    fontSize: 14,
  },
  activeViewText: {
    color: '#F97316',
  },
  calendarContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  calendarWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  reservationsSection: {
    marginBottom: 24,
  },
  reservationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  filterText: {
    marginLeft: 4,
    color: '#6B7280',
    fontSize: 14,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 14,
  },
  classesList: {
    gap: 16,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  dateHeaderText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4B5563',
  },
  classCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  classDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  classInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  classCapacity: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  fullBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  availableText: {
    color: '#10B981',
  },
  fullText: {
    color: '#EF4444',
  },
  classFooter: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 8,
  },
  classTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'left',
    marginBottom: 8,
  },
  detailsButton: {
    backgroundColor: '#F97316',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
});
