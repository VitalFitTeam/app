import RoutinesCarousel from '@/components/auth/training/RoutinesCarousel';
import TrainingCard from '@/components/auth/training/TrainingCard';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function EntrenamientoScreen() {
    const router = useRouter();
    const routineChips = [
        { id: 'yoga', label: 'Yoga', image: require('@/assets/images/yoga (2).png') },
        { id: 'hiit', label: 'HIIT', image: require('@/assets/images/hiit.png') },
        { id: 'kick', label: 'Kick\nBoxing', image: require('@/assets/images/kick boxing.png') },
        { id: 'pilates', label: 'pilates', image: require('@/assets/images/pilates.png') },
    ];

    return (
        <ThemedView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 120 }}>
                    {/* Logo */}
                    <View className='items-center mb-6'>
                        <Image
                            source={require('@/assets/images/Frame.png')}
                            style={{ width: 150, height: 50, resizeMode: 'contain' }}
                        />
                    </View>

                    {/* Rutinas (carousel) */}
                    <RoutinesCarousel items={routineChips} />

                    {/* Filtro (píldora más grande centrada, Activas/Hoy a extremos) */}
                    <View className='items-center mb-2'>
                        <View className='flex-row items-center bg-neutral-200 rounded-full px-8 py-4' style={{ minWidth: '80%', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#111827', fontWeight: '800', fontSize: 18 }}>Activas</Text>
                            <Text style={{ color: '#6B7280', fontWeight: '600', fontSize: 16 }}>Hoy</Text>
                        </View>
                    </View>

                    {/* Ver historial (debajo a la derecha) */}
                    <View className='items-end mb-4'>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/routine/history')}>
                            <Text style={{ color: '#F27F2A', fontWeight: '800' }}>VER HISTORIAL</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Training cards */}
                    <TrainingCard
                        id='routine-1'
                        title='Fuerza Total – Semana 3'
                        subtitle='Full Body - Medium'
                        progressPercent={75}
                    />

                    <TrainingCard
                        id='routine-2'
                        title='Fuerza Total – Semana 3'
                        subtitle='Full Body - Medium'
                        progressPercent={75}
                    />
                </ScrollView>
            </SafeAreaView>
        </ThemedView>
    );
}
