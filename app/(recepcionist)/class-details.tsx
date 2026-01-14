import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { CalendarDaysIcon, UserIcon } from 'react-native-heroicons/outline';

import vitalFitApi from '@/services';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { TFunction } from 'i18next';

// Format date helper
const formatFullDate = (dateString: string | undefined, t: TFunction, i18n: { language: string }) => {
  if (!dateString) return t('common.dateUndefined');
  
  // Handle if dateString is full ISO or just YYYY-MM-DD
  const cleanDate = dateString.split('T')[0];
  const [year, monthIndex, dayNumber] = cleanDate.split('-').map(Number);
  const date = new Date(year, (monthIndex || 1) - 1, dayNumber || 1);

  const day = date.getDate();
  const month = new Intl.DateTimeFormat(i18n.language, { month: 'long' }).format(date);
  const weekday = new Intl.DateTimeFormat(i18n.language, { weekday: 'long' }).format(date);

  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  return `${capitalizedWeekday}, ${day} ${t('common.of')} ${month} ${t('common.of')} ${year}`;
};

export default function ClassDetailsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    date?: string;
    time?: string;
    capacity?: string;
    enrolled?: string;
    status?: string;
    instructor?: string;
    description?: string;
    instructorImage?: string;
    serviceImage?: string;
    notes?: string;
  }>();

  const [searchText, setSearchText] = useState('');
  const [currentEnrolled, setCurrentEnrolled] = useState(Number(params.enrolled || 0));

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        router.replace('/(recepcionist)/schedule');
        return true;
      });

      // Fetch latest booking count
      if (params.id) {
        (async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                // Use correct service and method found in SDK definition
                // getClassBookingCount(classID: string, jwt: string): Promise<ClassBookingCount>
                const res = await vitalFitApi.booking.getClassBookingCount(params.id!, token || '');
                
                // Assuming res is the object ClassBookingCount. 
                // We'll inspect it via log if needed, but commonly it has a 'count' or 'total' property, 
                // or if it's a raw number (unlikely for an object type).
                // Let's safe-guard:
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const val = (res as any).count ?? (res as any).total ?? (typeof res === 'number' ? res : 0);
                
                setCurrentEnrolled(Number(val));
            } catch (e) {
                console.error("Failed to fetch booking count:", e);
            }
        })();
      }

      return () => backHandler.remove();
    }, [router, params.id])
  );

  const name = params.name || t('classDetails.defaultName');
  const date = params.date || '';
  const time = params.time || '';
  const capacity = Number(params.capacity || 0);
  const enrolled = currentEnrolled; // Use state
  const status = params.status || 'available';
  const instructorName = params.instructor || t('classDetails.defaultInstructor');

  const formattedDate = formatFullDate(date, t, i18n);
  const description = params.description || t('classes.description.default');
  
  // Images
  const heroImageSource = params.serviceImage 
      ? { uri: params.serviceImage } 
      : require('@/assets/images/rutina.png');
      
  const instructorImageSource = params.instructorImage 
      ? { uri: params.instructorImage } 
      : undefined;

  const notes = params.notes || '';

  const isFull = status === 'full' || (capacity > 0 && enrolled >= capacity);

  // Client List Logic (Placeholder for future API integration)
  // Currently empty as requested to remove hardcoded data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allClients: any[] = []; 
  
  const filteredClients = allClients.filter(client => 
      client.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageWrapper}>
          <Image
            source={heroImageSource}
            style={styles.heroImage}
            resizeMode='cover'
          />
        </View>

        <View style={styles.content}>
          <ThemedText className='font-heading' style={styles.className}>{name}</ThemedText>

          <View style={styles.metaBlock}>
            <ThemedText className='font-body' style={styles.dateText}>{formattedDate}</ThemedText>
            <ThemedText className='font-body' style={styles.capacityText}>
              {enrolled}/{capacity} {t('schedule.spotsOccupied')}
            </ThemedText>
            <ThemedText className='font-body' style={styles.timeText}>{time}</ThemedText>
            <ThemedText className='font-body' style={styles.durationText}>{t('classDetails.duration')}</ThemedText>
          </View>

          <View style={styles.instructorCard}>
            {instructorImageSource ? (
                <Image
                source={instructorImageSource}
                style={styles.instructorPhoto}
                />
            ) : (
                <View style={styles.instructorAvatar}>
                    <UserIcon size={24} color="#FFF" />
                </View>
            )}
            
            <View style={styles.instructorInfo}>
              <ThemedText className='font-body' style={styles.instructorName}>{instructorName}</ThemedText>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText className='font-heading' style={styles.sectionTitle}>{t('classDetails.descriptionTitle')}</ThemedText>
            <ThemedText className='font-body' style={styles.sectionBody}>
              {description}
            </ThemedText>
          </View>

          {notes ? (
            <View style={[styles.section, { marginTop: 8 }]}>
                <ThemedText className='font-heading' style={styles.sectionTitle}>{t('common.notes')}</ThemedText>
                <ThemedText className='font-body' style={styles.sectionBody}>
                {notes}
                </ThemedText>
            </View>
          ) : null}

          <View style={styles.searchWrapper}>
            <TextInput
              placeholder={t('checkIn.clientList.searchPlaceholder')}
              placeholderTextColor='#9CA3AF'
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <View style={styles.clientsHeader}>
            <View style={styles.clientsTitleRow}>
              <CalendarDaysIcon size={20} color='#6B7280' />
              <ThemedText className='font-body' style={styles.clientsTitle}>
                {t('checkIn.clientList.title')} ({enrolled}/{capacity})
              </ThemedText>
            </View>
          </View>

          <View style={styles.clientsList}>
            {filteredClients.length > 0 ? (
                filteredClients.map((client, index) => (
                <TouchableOpacity key={client.id || index} style={styles.clientCard} activeOpacity={0.8}>
                    <View style={styles.clientAvatar}>
                    <UserIcon size={24} color='#F97316' />
                    </View>
                    <View style={styles.clientInfo}>
                    <ThemedText className='font-body' style={styles.clientName}>{client.name}</ThemedText>
                    <ThemedText className='font-body' style={styles.clientLevel}>{client.level}</ThemedText>
                    </View>
                </TouchableOpacity>
                ))
            ) : (
                <ThemedText style={{ color: '#9CA3AF', textAlign: 'center', marginTop: 10, marginBottom: 10 }}>
                    {t('common.noClientsFound') || 'No clients found'}
                </ThemedText>
            )}
          </View>
 
        {/*
          <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.8}>
            <ThemedText className='font-body' style={styles.viewAllButtonText}>{t('common.viewAllRegistered')}</ThemedText>
          </TouchableOpacity>
        */}

          {isFull ? (
            <TouchableOpacity style={styles.fullButton} activeOpacity={0.8}>
              <ThemedText className='font-body' style={styles.fullButtonText}>{t('classDetails.classFull')}</ThemedText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => {
                const queryParams = new URLSearchParams({
                  id: params.id || '',
                  name: name,
                  date: date,
                  time: time,
                  capacity: capacity.toString(),
                  enrolled: enrolled.toString(),
                  status: status,
                  instructor: instructorName
                });
                router.push(`/(recepcionist)/enroll-client?${queryParams.toString()}`);
              }}
            >
              <ThemedText className='font-body' style={styles.primaryButtonText}>{t('classDetails.enrollClient')}</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  imageWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  className: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  metaBlock: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  capacityText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#F97316',
    fontWeight: '600',
    marginBottom: 2,
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  instructorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 999,
    padding: 8,
    marginBottom: 16,
  },
  instructorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instructorInfo: {
    marginLeft: 12,
  },
  instructorName: {
    fontSize: 14,
    color: '#F9FAFB',
    fontWeight: '500',
  },
  instructorPhoto: {
    width: 44,
    height: 44,
    borderRadius: 999,
    marginRight: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sectionBody: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  searchWrapper: {
    marginBottom: 16,
  },
  searchInput: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  clientsHeader: {
    marginBottom: 8,
  },
  clientsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientsTitle: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  clientsList: {
    marginBottom: 12,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  clientAvatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  clientLevel: {
    fontSize: 12,
    color: '#6B7280',
  },
  viewAllButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#F97316',
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  viewAllButtonText: {
    fontSize: 14,
    color: '#F97316',
    fontWeight: '500',
  },
  primaryButton: {
    borderRadius: 999,
    backgroundColor: '#F97316',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 48,
  },
  primaryButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  fullButton: {
    borderRadius: 999,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  fullButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
