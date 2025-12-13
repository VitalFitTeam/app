import { MonthCalendar } from '@/components/auth/dashboard/monthcalendar';
import { WeekCalendar } from '@/components/auth/dashboard/weekcalendar';
import RoutinesCarousel, { RoutineChip } from '@/components/auth/training/RoutinesCarousel';
import ClassCard from '@/components/ClassCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useReservations } from '@/contexts/reservations';
import vitalFitApi from '@/services/vitalfitSdk';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const exploreRoutineChips: RoutineChip[] = [
    { id: 'yoga', label: 'Yoga', image: require('@/assets/images/yoga (2).png') },
    { id: 'hiit', label: 'HIIT', image: require('@/assets/images/hiit.png') },
    { id: 'kick', label: 'Kick\nBoxing', image: require('@/assets/images/kick boxing.png') },
    { id: 'pilates', label: 'Pilates', image: require('@/assets/images/pilates.png') },
];

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
};

type ApiServiceImage = {
    image_url?: string;
    is_primary?: boolean;
};

type ApiService = {
    name?: string;
    service_name?: string;
    title?: string;
    display_name?: string;
    images?: ApiServiceImage[];
};

type ApiInstructor = {
    name?: string;
    first_name?: string;
    last_name?: string;
};

type ApiScheduleItem = {
    branch_id?: string;
    class_id?: string;
    classId?: string;
    ends_at?: string;
    endsAt?: string;
    instructor_id?: string;
    instructorId?: string;
    is_visible?: boolean;
    max_capacity?: number;
    notes?: string;
    service_id?: string;
    serviceId?: string;
    starts_at?: string;
    startsAt?: string;
    branch_name?: string;
    service_name?: string;
    name?: string;
    occupied?: number;
    booking_id?: string;
    id?: string;
};

type ApiBookingItem = {
    class_id?: string;
    classId?: string;
    booking_id?: string;
    id?: string;
};

export default function HorariosScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'classes' | 'reservas' | 'explorar'>('classes');
    const { isReserved } = useReservations();
    const [branches, setBranches] = useState<BranchItem[]>([]);
    const [selectedBranchId, setSelectedBranchId] = useState<string>('');
    const [loadingBranches, setLoadingBranches] = useState(true);
    const [branchMenuVisible, setBranchMenuVisible] = useState(false);
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [bookingsError, setBookingsError] = useState<string | null>(null);
    const [visibleBookingsCount, setVisibleBookingsCount] = useState(PAGE_SIZE);
    const [refreshKey, setRefreshKey] = useState(0);

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

                const response = await vitalFitApi.client.get({
                    url: `/branches/${selectedBranchId}/schedule`,
                    jwt: token || undefined,
                });

                const raw = (response as { data?: ApiScheduleItem[] } | ApiScheduleItem[] | undefined) ?? [];
                const itemsFromApi = Array.isArray((raw as { data?: ApiScheduleItem[] }).data)
                    ? (raw as { data?: ApiScheduleItem[] }).data
                    : (raw as ApiScheduleItem[]);
                const items: ApiScheduleItem[] = Array.isArray(itemsFromApi) ? itemsFromApi : [];

                const serviceImageMap: Record<string, string> = {};
                const serviceNameMap: Record<string, string> = {};
                const uniqueServiceIds: string[] = Array.from(
                    new Set(
                        items
                            .map((item) => item.service_id || item.serviceId)
                            .filter((value): value is string => Boolean(value)),
                    ),
                );

                for (const sid of uniqueServiceIds) {
                    try {
                        const serviceResp = await vitalFitApi.client.get({
                            url: `/services/${String(sid)}`,
                            jwt: token || undefined,
                        });
                        const s =
                            (serviceResp as { data?: ApiService }).data ?? (serviceResp as ApiService | undefined);
                        const serviceName =
                            (s && (s.name || s.service_name || s.title || s.display_name)) || 'Clase';
                        serviceNameMap[String(sid)] = serviceName;
                        const images: ApiServiceImage[] = Array.isArray(s?.images) ? s.images : [];

                        if (Array.isArray(images) && images.length > 0) {
                            const primary = images.find((img) => img.is_primary) ?? images[0];
                            if (primary?.image_url) {
                                serviceImageMap[String(sid)] = primary.image_url;
                            }
                        }
                    } catch (error) {
                        console.error('Error cargando servicio en Schedule:', error);
                    }
                }

                const instructorMap: Record<string, string> = {};
                const uniqueInstructorIds: string[] = Array.from(
                    new Set(
                        items
                            .map((item) => item.instructor_id || item.instructorId)
                            .filter((value): value is string => Boolean(value)),
                    ),
                );

                for (const iid of uniqueInstructorIds) {
                    try {
                        const instResp = await vitalFitApi.client.get({
                            url: `/instructor/${String(iid)}`,
                            jwt: token || undefined,
                        });
                        const inst =
                            (instResp as { data?: ApiInstructor }).data ??
                            (instResp as ApiInstructor | undefined);

                        const fullName =
                            inst?.name ||
                            [inst?.first_name, inst?.last_name]
                                .filter((part: string | undefined) => !!part)
                                .join(' ');
                        if (fullName) {
                            instructorMap[String(iid)] = fullName;
                        }
                    } catch (error) {
                        console.error('Error cargando instructor en Schedule:', error);
                    }
                }

                const mapped: ClassItem[] = items.map((item) => {
                    const startsAt = item.starts_at || item.startsAt || '';
                    const endsAt = item.ends_at || item.endsAt || '';

                    const extractTime = (value: string) => {
                        if (!value) return '';
                        const timePart = value.split('T')[1];
                        if (!timePart) return '';
                        return timePart.slice(0, 5);
                    };

                    const startTime = extractTime(String(startsAt));
                    const endTime = extractTime(String(endsAt));
                    const time = endTime ? `${startTime} - ${endTime}` : startTime;
                    const instructorId = item.instructor_id || item.instructorId;
                    const instructorName = instructorId ? instructorMap[instructorId] : undefined;
                    const sid = item.service_id || item.serviceId || '';

                    return {
                        classId: item.class_id || item.classId || '',
                        serviceId: sid,
                        instructorId: instructorId || '',
                        startsAt: String(startsAt || ''),
                        endsAt: String(endsAt || ''),
                        time,
                        title: serviceNameMap[sid] || item.service_name || item.name || 'Clase',
                        instructor: instructorName ? `Con ${instructorName}` : 'Instructor',
                        branch: item.branch_name || '',
                        imageUrl: serviceImageMap[sid] || require('@/assets/images/rutina.png'),
                        capacity: item.max_capacity || 0,
                        occupied: item.occupied || 0,
                    };
                });

                setClasses(mapped);
                setVisibleCount(PAGE_SIZE);
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

                const bookingsResp = await vitalFitApi.client.get({
                    url: `/bookings/client/${String(userId)}`,
                    jwt: token,
                });

                const rawBookings = (bookingsResp as { data?: ApiBookingItem[] } | ApiBookingItem[] | undefined) ?? [];
                const bookingsFromApi = Array.isArray((rawBookings as { data?: ApiBookingItem[] }).data)
                    ? (rawBookings as { data?: ApiBookingItem[] }).data
                    : (rawBookings as ApiBookingItem[]);
                const bookingsItems: ApiBookingItem[] = Array.isArray(bookingsFromApi) ? bookingsFromApi : [];

                const bookingIdByClassId: Record<string, string> = {};
                bookingsItems.forEach((bk) => {
                    const cId = bk.class_id || bk.classId;
                    const bId = bk.booking_id || bk.id;

                    if (cId && bId) {
                        bookingIdByClassId[String(cId)] = String(bId);
                    }
                });

                const response = await vitalFitApi.client.get({
                    url: `/schedule/branch/${String(selectedBranchId)}/client/${String(userId)}`,
                    jwt: token,
                });

                const raw = (response as { data?: ApiScheduleItem[] } | ApiScheduleItem[] | undefined) ?? [];
                const itemsFromApi = Array.isArray((raw as { data?: ApiScheduleItem[] }).data)
                    ? (raw as { data?: ApiScheduleItem[] }).data
                    : (raw as ApiScheduleItem[]);
                const items: ApiScheduleItem[] = Array.isArray(itemsFromApi) ? itemsFromApi : [];

                const serviceImageMap: Record<string, string> = {};
                const serviceNameMap: Record<string, string> = {};
                const uniqueServiceIds: string[] = Array.from(
                    new Set(
                        items
                            .map((item) => item.service_id || item.serviceId)
                            .filter((value): value is string => Boolean(value)),
                    ),
                );

                for (const sid of uniqueServiceIds) {
                    try {
                        const serviceResp = await vitalFitApi.client.get({
                            url: `/services/${String(sid)}`,
                            jwt: token,
                        });
                        const s =
                            (serviceResp as { data?: ApiService }).data ?? (serviceResp as ApiService | undefined);

                        const serviceName =
                            (s && (s.name || s.service_name || s.title || s.display_name)) || 'Clase';
                        serviceNameMap[String(sid)] = serviceName;
                        const images: ApiServiceImage[] = Array.isArray(s?.images) ? s.images : [];

                        if (Array.isArray(images) && images.length > 0) {
                            const primary = images.find((img) => img.is_primary) ?? images[0];
                            if (primary?.image_url) {
                                serviceImageMap[String(sid)] = primary.image_url;
                            }
                        }
                    } catch (error) {
                        console.error('Error cargando servicio para reservas:', error);
                    }
                }

                const instructorMap: Record<string, string> = {};
                const uniqueInstructorIds: string[] = Array.from(
                    new Set(
                        items
                            .map((item) => item.instructor_id || item.instructorId)
                            .filter((value): value is string => Boolean(value)),
                    ),
                );

                for (const iid of uniqueInstructorIds) {
                    try {
                        const instResp = await vitalFitApi.client.get({
                            url: `/instructor/${String(iid)}`,
                            jwt: token,
                        });
                        const inst =
                            (instResp as { data?: ApiInstructor }).data ??
                            (instResp as ApiInstructor | undefined);

                        const fullName =
                            inst?.name ||
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
                    const startsAt = item.starts_at || item.startsAt || '';
                    const endsAt = item.ends_at || item.endsAt || '';

                    const extractTime = (value: string) => {
                        if (!value) return '';
                        const timePart = String(value).split('T')[1];
                        if (!timePart) return '';
                        return timePart.slice(0, 5);
                    };

                    const startTime = extractTime(String(startsAt));
                    const endTime = extractTime(String(endsAt));
                    const time = endTime ? `${startTime} - ${endTime}` : startTime;

                    const sid = item.service_id || item.serviceId || '';
                    const instructorId = item.instructor_id || item.instructorId || '';

                    const classId = item.class_id || item.classId || '';
                    const bookingId = bookingIdByClassId[String(classId)] || item.booking_id || item.id || '';

                    const title = serviceNameMap[String(sid)] || item.service_name || 'Clase';

                    const instructorNameFromMap = instructorId ? instructorMap[String(instructorId)] : undefined;

                    return {
                        bookingId,
                        classId,
                        serviceId: sid,
                        instructorId,
                        time,
                        title,
                        instructor: instructorNameFromMap ? `Con ${instructorNameFromMap}` : 'Instructor',
                        branch: item.branch_name || '',
                        imageUrl: serviceImageMap[String(sid)] || require('@/assets/images/rutina.png'),
                        capacity: item.max_capacity || 0,
                        occupied: item.occupied || 0,
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

    return (
        <ThemedView lightColor='#FFFFFF' darkColor='#050816' style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 80 }}
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
                            style={{ fontFamily: 'BebasNeue-Regular', fontSize: 28, marginBottom: 8 }}
                        >
                            CALENDARIO
                        </ThemedText>
                    </View>

                    <View className='mb-6'>
                        {activeTab === 'reservas' ? <MonthCalendar /> : <WeekCalendar />}
                    </View>

                    <View className='flex-row mb-6 border rounded-2xl border-neutral-600 bg-neutral-900/90 p-1'>
                        <Pressable
                            onPress={() => setActiveTab('classes')}
                            style={({ pressed }) => [{ transform: [{ scale: pressed ? 1.05 : 1 }] }]}
                            className={`flex-1 items-center py-2.5 rounded-xl ${
                                activeTab === 'classes' ? 'bg-neutral-700' : 'bg-transparent'
                            }`}
                        >
                            <ThemedText
                                lightColor={activeTab === 'classes' ? '#ffffff' : '#9ca3af'}
                                darkColor={activeTab === 'classes' ? '#ffffff' : '#6b7280'}
                                className='text-base font-semibold'
                            >
                                Horarios
                            </ThemedText>
                        </Pressable>
                        <Pressable
                            onPress={() => setActiveTab('reservas')}
                            style={({ pressed }) => [{ transform: [{ scale: pressed ? 1.05 : 1 }] }]}
                            className={`flex-1 items-center py-2.5 rounded-xl ${
                                activeTab === 'reservas' ? 'bg-neutral-700' : 'bg-transparent'
                            }`}
                        >
                            <ThemedText
                                lightColor={activeTab === 'reservas' ? '#ffffff' : '#9ca3af'}
                                darkColor={activeTab === 'reservas' ? '#ffffff' : '#6b7280'}
                                className='text-base font-semibold text-center'
                            >
                                Reservas
                            </ThemedText>
                        </Pressable>
                        <Pressable
                            onPress={() => setActiveTab('explorar')}
                            style={({ pressed }) => [{ transform: [{ scale: pressed ? 1.05 : 1 }] }]}
                            className={`flex-1 items-center py-2.5 rounded-xl ${
                                activeTab === 'explorar' ? 'bg-neutral-700' : 'bg-transparent'
                            }`}
                        >
                            <ThemedText
                                lightColor={activeTab === 'explorar' ? '#ffffff' : '#6b7280'}
                                darkColor={activeTab === 'explorar' ? '#ffffff' : '#6b7280'}
                                className='text-base font-semibold'
                            >
                                Explorar
                            </ThemedText>
                        </Pressable>
                    </View>

                    <View className='mb-6 z-50'>
                        <View className='flex-row items-center justify-between mt-2 z-50'>

                            <ThemedText
                                lightColor='#111827'
                                darkColor='#ffffff'
                                style={{ fontFamily: 'BebasNeue-Regular', fontSize: 28, marginBottom: 8 }}
                            >
                                Próximas clases
                            </ThemedText>

                            <View style={{ width: 180, zIndex: 100 }}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setBranchMenuVisible(!branchMenuVisible)}
                                    className='flex-row items-center justify-between bg-neutral-100 rounded-xl px-4 py-2.5 border border-neutral-200'
                                >
                                    <ThemedText className='text-sm font-semibold text-neutral-800' numberOfLines={1}>
                                        {loadingBranches
                                            ? 'Cargando...'
                                            : branches.find((b) => b.branch_id === selectedBranchId)?.name || 'Seleccionar'}
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
                                                <ThemedText className='text-sm text-neutral-400'>Sin sedes</ThemedText>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {activeTab === 'explorar' && (
                        <View className='mb-5'>
                            <RoutinesCarousel items={exploreRoutineChips} showTitle={false} />
                        </View>
                    )}

                    {activeTab === 'classes' && (
                        <View>
                            {loadingClasses && (
                                <View className='items-center py-4'>
                                    <ActivityIndicator size='small' color='#f97316' />
                                </View>
                            )}
                            {!loadingClasses && errorMessage && (
                                <ThemedText className='text-center text-sm text-red-500 mb-4'>{errorMessage}</ThemedText>
                            )}
                            {!loadingClasses && !errorMessage && classes.length === 0 && selectedBranchId && (
                                <ThemedText className='text-center text-sm text-neutral-500 mb-4'>
                                    No hay clases programadas para esta sede.
                                </ThemedText>
                            )}
                            {classes.slice(0, visibleCount).map((classItem, index) => (
                                <ClassCard
                                    key={classItem.classId || index.toString()}
                                    time={classItem.time}
                                    title={classItem.title}
                                    instructor={classItem.instructor}
                                    branch={classItem.branch}
                                    imageUrl={classItem.imageUrl}
                                    variant='overlay'
                                    category={`Disponibles: ${Math.max(
                                        (classItem.capacity || 0) - (classItem.occupied || 0),
                                        0,
                                    )} de ${classItem.capacity || 0}`}
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
                                            },
                                        });
                                    }}
                                />
                            ))}
                            {!loadingClasses &&
                                !errorMessage &&
                                classes.length > visibleCount && (
                                    <View className='items-center mt-2 mb-4'>
                                        <Pressable
                                            onPress={() =>
                                                setVisibleCount((prev) =>
                                                    Math.min(prev + PAGE_SIZE, classes.length),
                                                )
                                            }
                                            className='px-4 py-2 rounded-full border border-orange-500'
                                        >
                                            <ThemedText className='text-sm font-semibold text-orange-500'>
                                                Cargar más
                                            </ThemedText>
                                        </Pressable>
                                    </View>
                                )}
                        </View>
                    )}

                    {activeTab === 'reservas' && (
                        <View>
                            <ThemedText className='text-xl font-bold mb-4'>Mis reservas</ThemedText>

                            {loadingBookings && (
                                <View className='items-center py-4'>
                                    <ActivityIndicator size='small' color='#f97316' />
                                </View>
                            )}

                            {!loadingBookings && bookingsError && (
                                <ThemedText className='text-center text-sm text-red-500 mb-4'>
                                    {bookingsError}
                                </ThemedText>
                            )}

                            {!loadingBookings && !bookingsError && bookings.length === 0 && (
                                <ThemedText className='text-neutral-500'>
                                    Aún no tienes reservas.
                                </ThemedText>
                            )}

                            {!loadingBookings && !bookingsError &&
                                bookings.slice(0, visibleBookingsCount).map((booking) => (
                                    <ClassCard
                                        key={booking.bookingId}
                                        time={booking.time}
                                        title={booking.title}
                                        instructor={booking.instructor}
                                        branch={booking.branch}
                                        imageUrl={booking.imageUrl}
                                        variant='overlay'
                                        category={`Disponibles: ${Math.max(
                                            (booking.capacity || 0) - (booking.occupied || 0),
                                            0,
                                        )} de ${booking.capacity || 0}`}
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
                                                },
                                            });
                                        }}
                                    />
                                ))}

                            {!loadingBookings &&
                                !bookingsError &&
                                bookings.length > visibleBookingsCount && (
                                    <View className='items-center mt-2 mb-4'>
                                        <Pressable
                                            onPress={() =>
                                                setVisibleBookingsCount((prev) =>
                                                    Math.min(prev + PAGE_SIZE, bookings.length),
                                                )
                                            }
                                            className='px-4 py-2 rounded-full border border-orange-500'
                                        >
                                            <ThemedText className='text-sm font-semibold text-orange-500'>
                                                Cargar más
                                            </ThemedText>
                                        </Pressable>
                                    </View>
                                )}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </ThemedView>
    );
}