import { HapticTab } from '@/components/haptic-tab';
import { Tabs } from 'expo-router';
import { CalendarIcon, HomeIcon, QrCodeIcon, UserIcon } from 'react-native-heroicons/solid';

export default function RecepcionistNavBar() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 6,
          paddingTop: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
          height: '100%',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        contentStyle: {
          paddingBottom: 70, // Espacio para que no se tape el contenido con el navbar
        }
      }}>
      <Tabs.Screen
        name='dashboard'
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name='check-in'
        options={{
          title: 'QR',
          tabBarIcon: ({ color }) => <QrCodeIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name='schedule'
        options={{
          title: 'Horarios',
          tabBarIcon: ({ color }) => <CalendarIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name='class-details'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <UserIcon color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
