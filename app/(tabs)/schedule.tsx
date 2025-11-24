import { MonthCalendar } from '@/components/auth/dashboard/monthcalendar';
import { WeekCalendar } from '@/components/auth/dashboard/weekcalendar';
import RoutinesCarousel, { RoutineChip } from '@/components/auth/training/RoutinesCarousel';
import ClassCard from '@/components/ClassCard';
import Dropdown from '@/components/Dropdown';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useReservations } from '@/contexts/reservations';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const classes = [
    {
        time: '12:00 PM',
        title: 'Zumba',
        instructor: 'Con Laura Torres',
        branch: 'Sucursal Sur',
        imageUrl: require('@/assets/images/zumba-w.jpg'),
        capacity: 25,
        occupied: 18,
    },
    {
        time: '11:00 AM',
        title: 'Spinning',
        instructor: 'Con Carlos Mendoza',
        branch: 'Sucursal Norte',
        imageUrl: require('@/assets/images/spinning-w.jpg'),
        capacity: 25,
        occupied: 22,
    },
    {
        time: '10:00 AM',
        title: 'Yoga Flow',
        instructor: 'Con Sofia Ramirez',
        branch: 'Sucursal Centro',
        imageUrl: require('@/assets/images/yoga-w.jpg'),
        capacity: 25,
        occupied: 18,
    },
    // Full class example
    {
        time: '07:00 AM',
        title: 'Crossfit',
        instructor: 'Con Laura Torres',
        branch: 'Sucursal Sur',
        imageUrl: require('@/assets/images/crossfit-w.jpg'),
        capacity: 25,
        occupied: 24,
    },
];

const exploreRoutineChips: RoutineChip[] = [
    { id: 'yoga', label: 'Yoga', image: require('@/assets/images/yoga (2).png') },
    { id: 'hiit', label: 'HIIT', image: require('@/assets/images/hiit.png') },
    { id: 'kick', label: 'Kick\nBoxing', image: require('@/assets/images/kick boxing.png') },
    { id: 'pilates', label: 'Pilates', image: require('@/assets/images/pilates.png') },
];

type Reservation = {
    time: string;
    title: string;
    instructor: string;
    branch: string;
    imageUrl: string | number;
    status: 'assisted' | 'absent' | 'cancelled';
    capacity: number;
    occupied: number;
};

const reservations: Reservation[] = [
    {
        time: '10:00 AM',
        title: 'Yoga Flow',
        instructor: 'Con Sofia Ramirez',
        branch: 'Sucursal Centro',
        imageUrl: require('@/assets/images/yoga-w.jpg'),
        status: 'assisted',
        capacity: 25,
        occupied: 18,
    },
    {
        time: '11:00 AM',
        title: 'Spinning',
        instructor: 'Con Carlos Mendoza',
        branch: 'Sucursal Norte',
        imageUrl: require('@/assets/images/spinning-w.jpg'),
        status: 'cancelled',
        capacity: 25,
        occupied: 22,
    },
    {
        time: '07:00 AM',
        title: 'Crossfit',
        instructor: 'Con Laura Torres',
        branch: 'Sucursal Sur',
        imageUrl: require('@/assets/images/crossfit-w.jpg'),
        status: 'assisted',
        capacity: 25,
        occupied: 23,
    },
];

export default function HorariosScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'classes' | 'reservas' | 'explorar'>('classes');
    const { isReserved } = useReservations();

    return (
        <ThemedView lightColor='#FFFFFF' darkColor='#050816' style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 80 }}>
                    {/* Logo como en training.tsx */}
                    <View className='items-center mb-6'>
                        <Image
                            source={require('@/assets/images/Frame.png')}
                            style={{ width: 150, height: 50, resizeMode: 'contain' }}
                        />
                    </View>

                    {/* Título CALENDARIO con mismo estilo que "Rutinas" */}
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

                    {/* Tabs grises: Horarios / Reservas / Explorar */}
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
                                className='text-base font-semibold'>
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
                                className='text-base font-semibold text-center'>
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
                                className='text-base font-semibold'>
                                Explorar
                            </ThemedText>
                        </Pressable>
                    </View>

                    <View className='mb-6'>
                        <View className='flex-row items-center justify-between mt-2'>
                            <ThemedText
                                lightColor='#111827'
                                darkColor='#ffffff'
                                style={{ fontFamily: 'BebasNeue-Regular', fontSize: 28, marginBottom: 8 }}
                            >
                                Próximas clases
                            </ThemedText>
                            <View style={{ width: 120 }}>
                                <Dropdown label='Filter' onPress={() => {}} />
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
                            {classes.map((classItem, index) => (
                                <ClassCard
                                    key={index}
                                    time={classItem.time}
                                    title={classItem.title}
                                    instructor={classItem.instructor}
                                    branch={classItem.branch}
                                    imageUrl={classItem.imageUrl}
                                    variant='overlay'
                                    category={'categoría'}
                                    reserved={isReserved(`${classItem.title}|${classItem.time}`)}
                                    onPress={(classData) => {
                                        router.push({
                                            pathname: '/class-details',
                                            params: {
                                                ...classData,
                                                capacity: String(classItem.capacity),
                                                occupied: String(classItem.occupied),
                                            },
                                        });
                                    }}
                                />
                            ))}
                        </View>
                    )}

                    {activeTab === 'reservas' && (
                        <View>
                            <ThemedText className='text-xl font-bold mb-4'>Mis reservas</ThemedText>
                            {reservations.map((reservation, index) => (
                                <ClassCard
                                    key={index}
                                    time={reservation.time}
                                    title={reservation.title}
                                    instructor={reservation.instructor}
                                    branch={reservation.branch}
                                    imageUrl={reservation.imageUrl}
                                    variant='overlay'
                                    category={'categoría'}
                                    reserved={isReserved(`${reservation.title}|${reservation.time}`)}
                                    onPress={(classData) => {
                                        router.push({
                                            pathname: '/class-details',
                                            params: {
                                                ...classData,
                                                capacity: String(reservation.capacity),
                                                occupied: String(reservation.occupied),
                                            },
                                        });
                                    }}
                                />
                            ))}
                            {reservations.length === 0 && (
                                <ThemedText className='text-neutral-500'>
                                    Aún no tienes reservas.
                                </ThemedText>
                            )}
                        </View>
                    )}

                    {activeTab === 'explorar' && (
                        <View>
                            {classes.map((classItem, index) => (
                                <ClassCard
                                    key={index}
                                    time={classItem.time}
                                    title={classItem.title}
                                    instructor={classItem.instructor}
                                    branch={classItem.branch}
                                    imageUrl={classItem.imageUrl}
                                    variant='overlay'
                                    category={'categoría'}
                                    reserved={isReserved(`${classItem.title}|${classItem.time}`)}
                                    onPress={(classData) => {
                                        router.push({
                                            pathname: '/class-details',
                                            params: {
                                                ...classData,
                                                capacity: String(classItem.capacity),
                                                occupied: String(classItem.occupied),
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
