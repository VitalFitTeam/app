import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next'; // <--- 1. Importamos el hook

import { HapticTab } from '@/components/haptic-tab';
import { Dumbbell } from 'lucide-react-native';
import { View } from 'react-native';
import { CalendarIcon, HomeIcon, UserIcon, UsersIcon } from 'react-native-heroicons/solid';

export default function TabLayout() {
    // 2. Obtenemos la función para traducir
    const { t } = useTranslation(); 

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#f97316',
                tabBarInactiveTintColor: '#a1a1aa',
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: {
                    backgroundColor: '#1f2937',
                    borderTopWidth: 0,
                    borderRadius: 16,
                    marginHorizontal: 16,
                    height: 56,
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    bottom: 36, // Mantenemos tu estilo flotante
                    paddingHorizontal: 8,
                    overflow: 'hidden',
                    elevation: 0,
                    paddingBottom: 4,
                    paddingTop: 0,
                },
                tabBarItemStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 56,
                    paddingVertical: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    margin: 0,
                },
                tabBarIconStyle: {
                    marginTop: 0,
                    marginBottom: 0,
                },
                tabBarShowLabel: false, // Tienes los labels ocultos, pero el 'title' se usa para accesibilidad y header si se activara
                tabBarLabel: () => null,
            }}>
            <Tabs.Screen
                name='dashboard'
                options={{
                    title: t('nav.dashboard'), // <--- Traducción: Inicio / Home
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                backgroundColor: focused ? '#f97316' : 'transparent',
                                borderRadius: 12,
                                width: 44,
                                height: 44,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 16,
                            }}>
                            <HomeIcon color={focused ? '#fff' : '#a1a1aa'} size={24} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name='schedule'
                options={{
                    title: t('nav.schedule'), // <--- Traducción: Horarios / Schedule
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                backgroundColor: focused ? '#f97316' : 'transparent',
                                borderRadius: 12,
                                width: 44,
                                height: 44,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 16,
                            }}>
                            <CalendarIcon color={focused ? '#fff' : '#a1a1aa'} size={24} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name='training'
                options={{
                    title: t('nav.training'), // <--- Traducción: Entrenamiento / Training
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                backgroundColor: focused ? '#f97316' : 'transparent',
                                borderRadius: 12,
                                width: 44,
                                height: 44,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 16,
                            }}>
                            <Dumbbell
                                color={focused ? '#fff' : '#a1a1aa'}
                                size={24}
                                strokeWidth={1.5}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name='community'
                options={{
                    title: t('nav.community'), // <--- Traducción: Comunidad / Community
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                backgroundColor: focused ? '#f97316' : 'transparent',
                                borderRadius: 12,
                                width: 44,
                                height: 44,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 16,
                            }}>
                            <UsersIcon color={focused ? '#fff' : '#a1a1aa'} size={24} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: t('nav.profile'), // <--- Traducción: Perfil / Profile
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                backgroundColor: focused ? '#f97316' : 'transparent',
                                borderRadius: 12,
                                width: 44,
                                height: 44,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 16,
                            }}>
                            <UserIcon color={focused ? '#fff' : '#a1a1aa'} size={24} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}