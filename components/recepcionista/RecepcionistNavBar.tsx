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
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 60,
          paddingBottom: 28,
          paddingTop: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
          height: '100%',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 2,
        },
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
        name='personal-info'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='security'
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
