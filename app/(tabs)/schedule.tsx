import { MonthCalendar } from '@/components/auth/dashboard/monthcalendar';
import { WeekCalendar } from '@/components/auth/dashboard/weekcalendar';

import ClassCard from '@/components/ClassCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useReservations } from '@/contexts/reservations';
import vitalFitApi from '@/services';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {
    BranchClassInfo,
    BranchScheduleResponse,
    ClientBookingResponse,
    isAPIError
} from '@vitalfit/sdk';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ActivityIndicator, Image, NativeScrollEvent, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PAGE_SIZE = 8;

type BranchItem = {
    branch_id: string;
    name: string;
};

type ClassItem = {
    classId: string;
    serviceId: string;
    instructorId: string;
    startsAt: string;
    endsAt: string;
    time: string;
    title: string;
    instructor: string;
    branch: string;
    imageUrl: string | number;
    capacity: number;
    occupied: number;
    rawDate: string;
};

type BookingItem = {
    bookingId: string;
    classId: string;
    serviceId: string;
    instructorId: string;
    time: string;
    title: string;
    instructor: string;
    branch: string;
    imageUrl: string | number;
    capacity: number;
    occupied: number;
    rawDate: string;
};



export default function HorariosScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'classes' | 'reservas'>('classes');
    const { isReserved } = useReservations();
    const [branches, setBranches] = useState<BranchItem[]>([]);
    const [selectedBranchId, setSelectedBranchId] = useState<string>('');
    const [loadingBranches, setLoadingBranches] = useState(true);
    const [branchMenuVisible, setBranchMenuVisible] = useState(false);
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [visibleClassesCount, setVisibleClassesCount] = useState(PAGE_SIZE);
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [bookingsError, setBookingsError] = useState<string | null>(null);
    const [visibleBookingsCount, setVisibleBookingsCount] = useState(PAGE_SIZE);
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedClassesDate, setSelectedClassesDate] = useState<string>(
        new Date().toISOString().split('T')[0],
    );
    const [selectedBookingsDate, setSelectedBookingsDate] = useState<string>('');

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) => {
        const paddingToBottom = 100;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    };

    const handleScroll = ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
        if (activeTab === 'classes') {
            if (isCloseToBottom(nativeEvent)) {
                setVisibleClassesCount((prev) =>
                    Math.min(prev + PAGE_SIZE, classes.length),
                );
            }
        } else if (activeTab === 'reservas') {
            if (isCloseToBottom(nativeEvent)) {
                setVisibleBookingsCount((prev) =>
                    Math.min(prev + PAGE_SIZE, bookings.length),
                );
            }
        }
    };

    useEffect(() => {
        const initBranches = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await vitalFitApi.public.getBranchMap(token || '');
                const data = (response as { data?: BranchItem[] }).data || [];

                setBranches(data);
                if (data.length > 0 && !selectedBranchId) {
                    setSelectedBranchId(data[0].branch_id);
                }
            } catch (error) {
                console.error('Error cargando sucursales en Schedule:', error);
            } finally {
                setLoadingBranches(false);
            }
        };

        void initBranches();
    }, [selectedBranchId]);

    useFocusEffect(
        useCallback(() => {
            setRefreshKey((prev) => prev + 1);
        }, []),
    );

    useEffect(() => {
        const loadClasses = async () => {
            if (!selectedBranchId) {
                setClasses([]);
                return;
            }

            setLoadingClasses(true);
            setErrorMessage(null);
            try {
                const token = await AsyncStorage.getItem('token');

                const response = await vitalFitApi.schedule.ListBranchesClass(
                    selectedBranchId,
                    token || '',
                );

                const raw = (response as { data?: BranchClassInfo[] } | BranchClassInfo[] | undefined) ?? [];
                const itemsFromApi = Array.isArray((raw as { data?: BranchClassInfo[] }).data)
                    ? (raw as { data?: BranchClassInfo[] }).data
                    : (raw as BranchClassInfo[]);
                const items: BranchClassInfo[] = Array.isArray(itemsFromApi) ? itemsFromApi : [];

                const serviceImageMap: Record<string, string> = {};
                const serviceNameMap: Record<string, string> = {};
                const uniqueServiceIds: string[] = Array.from(
                    new Set(
                        items
                            .map((item) => item.service_id)
                            .filter((value): value is string => Boolean(value)),
                    ),
                );

                for (const sid of uniqueServiceIds) {
                    try {
                        const serviceResp = await vitalFitApi.products.getServiceByID(String(sid), token || '');
                        const s = serviceResp.data;

                        const serviceName = (s && s.name) || 'Clase';
                        serviceNameMap[String(sid)] = serviceName;
                        const images = Array.isArray(s?.images) ? s.images : [];

                        if (Array.isArray(images) && images.length > 0) {
                            const primary = images.find((img) => img.is_primary) ?? images[0];
                            if (primary?.image_url) {
                                serviceImageMap[String(sid)] = primary.image_url;
                            }
                        }
                    } catch {
                        console.warn('Error cargando servicio en Schedule (ignorable si no existe):', sid);
                    }
                    // Add small delay to avoid rate limiting
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }

                const instructorMap: Record<string, string> = {};
                const uniqueInstructorIds: string[] = Array.from(
                    new Set(
                        items
                            .map((item) => item.instructor_id)
                            .filter((value): value is string => Boolean(value)),
                    ),
                );

                for (const iid of uniqueInstructorIds) {
                    try {
                        const instResp = await vitalFitApi.instructor.getInstructorById(
                            String(iid),
                            token || '',
                        );
                        const inst = instResp.data;

                        const fullName =
                            [inst?.first_name, inst?.last_name]
                                .filter((part: string | undefined) => !!part)
                                .join(' ');
                        if (fullName) {
                            instructorMap[String(iid)] = fullName;
                        }
                    } catch (error) {
                        if (isAPIError(error)) {
                            console.warn(
                                `Error cargando instructor ${iid}: Status ${error.status} - ${error.messages.join(', ')}`,
                            );
                        } else {
                            console.error('Error cargando instructor en Schedule:', error);
                        }
                    }
                    // Add small delay to avoid rate limiting
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }

                const mapped: ClassItem[] = items.map((item) => {
                    const startsAt = item.starts_at || '';
                    const endsAt = item.ends_at || '';

                    const extractTime = (value: string) => {
                        if (!value) return '';
                        try {
                            const date = new Date(value);
                            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                        } catch {
                            return '';
                        }
                    };

                    const startTime = extractTime(String(startsAt));
                    const endTime = extractTime(String(endsAt));
                    const time = endTime ? `${startTime} - ${endTime}` : startTime;
                    const instructorId = item.instructor_id;
                    const instructorName = instructorId ? instructorMap[instructorId] : undefined;
                    const sid = item.service_id || '';

                    return {
                        classId: item.class_id || '',
                        serviceId: sid,
                        instructorId: instructorId || '',
                        startsAt: String(startsAt || ''),
                        endsAt: String(endsAt || ''),
                        time,
                        title: serviceNameMap[sid] || 'Clase',
                        instructor: instructorName ? `Con ${instructorName}` : 'Instructor',
                        branch: '',
                        imageUrl: serviceImageMap[sid] || require('@/assets/images/rutina.png'),
                        capacity: item.max_capacity || 0,
                        occupied: 0, // Initial value
                        rawDate: String(startsAt).split('T')[0] || '',
                    };
                });

                setClasses(mapped);
                setVisibleClassesCount(PAGE_SIZE);
            } catch (error) {
                console.error('Error cargando clases en Schedule:', error);
                setErrorMessage('No se pudieron cargar las clases. Intenta nuevamente.');
            } finally {
                setLoadingClasses(false);
            }
        };

        void loadClasses();
    }, [selectedBranchId, refreshKey]);

    useEffect(() => {
        const loadBookings = async () => {
            setBookingsError(null);
            setLoadingBookings(true);
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token || !selectedBranchId) {
                    setBookings([]);
                    return;
                }

                const whoAmI = (await vitalFitApi.user.WhoAmI(token)) as unknown as {
                    user?: { id?: string; user_id?: string };
                };
                const userId = whoAmI?.user?.id || whoAmI?.user?.user_id;
                if (!userId) {
                    setBookings([]);
                    return;
                }

                const bookingsResp = await vitalFitApi.booking.getClientBooking(
                    String(userId),
                    token,
                );

                const rawBookings = (bookingsResp as { data?: ClientBookingResponse[] } | ClientBookingResponse[] | undefined) ?? [];
                const bookingsItems = (Array.isArray((rawBookings as { data?: ClientBookingResponse[] }).data)
                    ? (rawBookings as { data?: ClientBookingResponse[] }).data
                    : (rawBookings as ClientBookingResponse[])) ?? [];

                const bookingIdByClassId: Record<string, string> = {};
                bookingsItems.forEach((bk) => {
                    const cId = bk.class_id;
                    const bId = bk.booking_id;

                    if (cId && bId) {
                        bookingIdByClassId[String(cId)] = String(bId);
                    }
                });

                const response = await vitalFitApi.booking.getClientBranchBooking(
                    String(selectedBranchId),
                    String(userId),
                    token,
                );

                const raw = (response as { data?: BranchScheduleResponse[] } | BranchScheduleResponse[] | undefined) ?? [];
                const itemsFromApi = Array.isArray((raw as { data?: BranchScheduleResponse[] }).data)
                    ? (raw as { data?: BranchScheduleResponse[] }).data
                    : (raw as BranchScheduleResponse[]);
                const items: BranchScheduleResponse[] = Array.isArray(itemsFromApi) ? itemsFromApi : [];

                const serviceImageMap: Record<string, string> = {};
                const serviceNameMap: Record<string, string> = {};
                const uniqueServiceIds: string[] = Array.from(
                    new Set(
                        items
                            .map((item) => item.service_id)
                            .filter((value): value is string => Boolean(value)),
                    ),
                );

                for (const sid of uniqueServiceIds) {
                    try {
                        const serviceResp = await vitalFitApi.products.getServiceByID(String(sid), token || '');
                        const s = serviceResp.data;

                        const serviceName = (s && s.name) || 'Clase';
                        serviceNameMap[String(sid)] = serviceName;
                        const images = Array.isArray(s?.images) ? s.images : [];

                        if (Array.isArray(images) && images.length > 0) {
                            const primary = images.find((img) => img.is_primary) ?? images[0];
                            if (primary?.image_url) {
                                serviceImageMap[String(sid)] = primary.image_url;
                            }
                        }
                    } catch {
                        console.warn('Error cargando servicio para reservas (ignorable si no existe):', sid);
                    }
                }

                const instructorMap: Record<string, string> = {};
                const uniqueInstructorIds: string[] = Array.from(
                    new Set(
                        items
                            .map((item) => item.instructor_id)
                            .filter((value): value is string => Boolean(value)),
                    ),
                );

                for (const iid of uniqueInstructorIds) {
                    try {
                        const instResp = await vitalFitApi.instructor.getInstructorById(
                            String(iid),
                            token,
                        );
                        const inst = instResp.data;

                        const fullName =
                            [inst?.first_name, inst?.last_name]
                                .filter((part: string | undefined) => !!part)
                                .join(' ');
                        if (fullName) {
                            instructorMap[String(iid)] = fullName;
                        }
                    } catch (error) {
                        console.error('Error cargando instructor para reservas:', error);
                    }
                }

                const mappedBookings: BookingItem[] = items.map((item) => {
                    const startsAt = item.starts_at || '';
                    const endsAt = item.ends_at || '';

                    const extractTime = (value: string) => {
                        if (!value) return '';
                        try {
                            const date = new Date(value);
                            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                        } catch {
                            return '';
                        }
                    };

                    const startTime = extractTime(String(startsAt));
                    const endTime = extractTime(String(endsAt));
                    const time = endTime ? `${startTime} - ${endTime}` : startTime;

                    const sid = item.service_id || '';
                    const instructorId = item.instructor_id || '';

                    const classId = item.class_id || '';
                    const bookingId = bookingIdByClassId[String(classId)] || '';

                    const title = serviceNameMap[String(sid)] || 'Clase';
                    const instructorNameFromMap = instructorId ? instructorMap[String(instructorId)] : undefined;

                    return {
                        bookingId,
                        classId,
                        serviceId: sid,
                        instructorId,
                        time,
                        title,
                        instructor: instructorNameFromMap ? `Con ${instructorNameFromMap}` : 'Instructor',
                        branch: '',
                        imageUrl: serviceImageMap[String(sid)] || require('@/assets/images/rutina.png'),
                        capacity: item.max_capacity || 0,
                        occupied: 0,
                        rawDate: String(startsAt).split('T')[0] || '',
                    };
                });

                setBookings(mappedBookings);
                setVisibleBookingsCount(PAGE_SIZE);
            } catch (error) {
                console.error('Error cargando reservas del cliente:', error);
                setBookingsError('No se pudieron cargar tus reservas. Intenta nuevamente.');
            } finally {
                setLoadingBookings(false);
            }
        };

        if (activeTab === 'reservas') {
            void loadBookings();
        }
    }, [activeTab, selectedBranchId, refreshKey]);

    const filteredClasses = useMemo(
        () => classes.filter((item) => !selectedClassesDate || item.rawDate === selectedClassesDate),
        [classes, selectedClassesDate],
    );

    const filteredBookings = useMemo(
        () => bookings.filter((item) => !selectedBookingsDate || item.rawDate === selectedBookingsDate),
        [bookings, selectedBookingsDate],
    );

    const visibleClasses = filteredClasses.slice(0, visibleClassesCount);
    const visibleBookings = filteredBookings.slice(0, visibleBookingsCount);

    return (
        <ThemedView lightColor='#FFFFFF' darkColor='#050816' style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 80 }}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    <View className='items-center mb-6'>
                        <Image
                            source={require('@/assets/images/Frame.png')}
                            style={{ width: 150, height: 50, resizeMode: 'contain' }}
                        />
                    </View>

                    <View className='mb-2'>
                        <ThemedText
                            lightColor='#111827'
                            darkColor='#ffffff'
                            className='font-heading'
                            style={{ fontFamily: 'BebasNeue-Regular', fontSize: 28, marginBottom: 8 }}
                        >
                            {t('schedule.calendar')}
                        </ThemedText>
                    </View>

                    <View className='mb-6'>
                        {activeTab === 'reservas' ? (
                            <MonthCalendar
                                initialDate={selectedBookingsDate || undefined}
                                onDateSelect={(day) => {
                                    if (day?.dateString) {
                                        setSelectedBookingsDate(day.dateString);
                                        setVisibleBookingsCount(PAGE_SIZE);
                                    }
                                }}
                            />
                        ) : (
                            <WeekCalendar
                                initialDate={selectedClassesDate}
                                onDateSelect={(day) => {
                                    if (day?.dateString) {
                                        setSelectedClassesDate(day.dateString);
                                        setVisibleClassesCount(PAGE_SIZE);
                                    }
                                }}
                            />
                        )}
                    </View>

                    <View className='flex-row mb-6 border rounded-2xl border-neutral-600 bg-neutral-900/90 p-1'>
                        <Pressable
                            onPress={() => setActiveTab('classes')}
                            style={({ pressed }) => [{ transform: [{ scale: pressed ? 1.05 : 1 }] }]}
                            className={`flex-1 items-center py-2.5 rounded-xl ${activeTab === 'classes' ? 'bg-neutral-700' : 'bg-transparent'
                                }`}
                        >
                            <ThemedText
                                lightColor={activeTab === 'classes' ? '#ffffff' : '#9ca3af'}
                                darkColor={activeTab === 'classes' ? '#ffffff' : '#6b7280'}
                                className='font-heading text-base font-semibold'
                            >
                                {t('schedule.tabs.classes')}
                            </ThemedText>
                        </Pressable>
                        <Pressable
                            onPress={() => setActiveTab('reservas')}
                            style={({ pressed }) => [{ transform: [{ scale: pressed ? 1.05 : 1 }] }]}
                            className={`flex-1 items-center py-2.5 rounded-xl ${activeTab === 'reservas' ? 'bg-neutral-700' : 'bg-transparent'
                                }`}
                        >
                            <ThemedText
                                lightColor={activeTab === 'reservas' ? '#ffffff' : '#9ca3af'}
                                darkColor={activeTab === 'reservas' ? '#ffffff' : '#6b7280'}
                                className='font-heading text-base font-semibold text-center'
                            >
                                {t('schedule.tabs.reservations')}
                            </ThemedText>
                        </Pressable>
                    </View>

                    <View className='mb-6 z-50'>
                        <ThemedText
                            lightColor='#111827'
                            darkColor='#ffffff'
                            className='font-heading'
                            style={{ fontFamily: 'BebasNeue-Regular', fontSize: 28, marginBottom: 8 }}
                        >
                            {t('schedule.upcomingClasses')}
                        </ThemedText>

                        <View style={{ width: '100%', maxWidth: 400, zIndex: 100 }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => setBranchMenuVisible(!branchMenuVisible)}
                                className='flex-row items-center justify-between bg-neutral-100 rounded-xl px-4 py-2.5 border border-neutral-200'
                            >
                                <ThemedText className='font-body text-sm font-semibold text-neutral-800' numberOfLines={1}>
                                    {loadingBranches
                                        ? 'Cargando...'
                                        : branches.find((b) => b.branch_id === selectedBranchId)?.name || t('common.selectBranch')}
                                </ThemedText>
                                <Ionicons
                                    name={branchMenuVisible ? 'chevron-up' : 'chevron-down'}
                                    size={16}
                                    color='#4b5563'
                                />
                            </TouchableOpacity>

                            {branchMenuVisible && (
                                <View className='absolute top-12 left-0 right-0 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50'>
                                    {branches.map((branch) => {
                                        const isSelected = branch.branch_id === selectedBranchId;
                                        return (
                                            <TouchableOpacity
                                                key={branch.branch_id}
                                                className='px-4 py-2'
                                                onPress={() => {
                                                    setSelectedBranchId(branch.branch_id);
                                                    setBranchMenuVisible(false);
                                                }}
                                            >
                                                <ThemedText
                                                    className='font-body'
                                                    style={{
                                                        fontSize: isSelected ? 16 : 13,
                                                        fontWeight: isSelected ? '800' : '400',
                                                        color: isSelected ? '#f97316' : '#111827',
                                                    }}
                                                    numberOfLines={1}
                                                >
                                                    {branch.name}
                                                </ThemedText>
                                            </TouchableOpacity>
                                        );
                                    })}
                                    {branches.length === 0 && (
                                        <View className='px-4 py-3'>
                                            <ThemedText className='font-body text-sm text-neutral-400'>{t('schedule.noClassesBranch')}</ThemedText>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>

                    {activeTab === 'classes' && (
                        <View>
                            {loadingClasses && (
                                <View className='items-center py-4'>
                                    <ActivityIndicator size='small' color='#f97316' />
                                </View>
                            )}
                            {!loadingClasses && errorMessage && (
                                <ThemedText className='font-body text-center text-sm text-red-500 mb-4'>{errorMessage}</ThemedText>
                            )}
                            {!loadingClasses && !errorMessage && classes.length === 0 && selectedBranchId && (
                                <ThemedText className='font-body text-center text-sm text-neutral-500 mb-4'>
                                    {t('schedule.noClassesBranch')}
                                </ThemedText>
                            )}
                            {visibleClasses.map((classItem, index) => (
                                <ClassCard
                                    key={classItem.classId || index.toString()}
                                    time={classItem.time}
                                    title={classItem.title}
                                    instructor={classItem.instructor}
                                    branch={classItem.branch}
                                    imageUrl={classItem.imageUrl}
                                    variant='overlay'
                                    category={`${t('common.available')}: ${Math.max(
                                        (classItem.capacity || 0) - (classItem.occupied || 0),
                                        0,
                                    )} ${t('common.of')} ${classItem.capacity || 0}`}
                                    reserved={isReserved(`${classItem.title}|${classItem.time}`)}
                                    onPress={(classData) => {
                                        router.push({
                                            pathname: '/class-details',
                                            params: {
                                                ...classData,
                                                capacity: String(classItem.capacity),
                                                occupied: String(classItem.occupied),
                                                classId: classItem.classId,
                                                serviceId: classItem.serviceId,
                                                instructorId: classItem.instructorId,
                                                startsAt: classItem.startsAt,
                                            },
                                        });
                                    }}
                                />
                            ))}
                        </View>
                    )}

                    {activeTab === 'reservas' && (
                        <View>
                            <ThemedText className='font-heading text-xl font-bold mb-4'>{t('schedule.myBookings')}</ThemedText>

                            {loadingBookings && (
                                <View className='items-center py-4'>
                                    <ActivityIndicator size='small' color='#f97316' />
                                </View>
                            )}

                            {!loadingBookings && bookingsError && (
                                <ThemedText className='font-body text-center text-sm text-red-500 mb-4'>
                                    {bookingsError}
                                </ThemedText>
                            )}

                            {!loadingBookings && !bookingsError && bookings.length === 0 && (
                                <ThemedText className='font-body text-neutral-500'>
                                    {t('schedule.noBookings')}
                                </ThemedText>
                            )}

                            {!loadingBookings && !bookingsError &&
                                visibleBookings.map((booking) => (
                                    <ClassCard
                                        key={booking.bookingId}
                                        time={booking.time}
                                        title={booking.title}
                                        instructor={booking.instructor}
                                        branch={booking.branch}
                                        imageUrl={booking.imageUrl}
                                        variant='overlay'
                                        category={`${t('common.available')}: ${Math.max(
                                            (booking.capacity || 0) - (booking.occupied || 0),
                                            0,
                                        )} ${t('common.of')} ${booking.capacity || 0}`}
                                        reserved
                                        onPress={(classData) => {
                                            router.push({
                                                pathname: '/class-details',
                                                params: {
                                                    ...classData,
                                                    capacity: String(booking.capacity),
                                                    occupied: String(booking.occupied),
                                                    classId: booking.classId,
                                                    serviceId: booking.serviceId,
                                                    instructorId: booking.instructorId,
                                                    bookingId: booking.bookingId,
                                                    startsAt: booking.rawDate,
                                                },
                                            });
                                        }}
                                    />
                                ))}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </ThemedView>
    );
}