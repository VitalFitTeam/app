import { HapticTab } from '@/components/haptic-tab';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CalendarIcon, HomeIcon, QrCodeIcon, UserIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecepcionistNavBar() {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
            height: 55,
            paddingBottom: 4,
            paddingTop: 4,
            paddingHorizontal: 16,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 8,
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
            marginBottom: 2,
          },
        }}>
      <Tabs.Screen
        name='dashboard'
        options={{
          title: t('nav.dashboard'),
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name='check-in'
        options={{
          title: t('nav.qr'),
          tabBarIcon: ({ color }) => <QrCodeIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name='schedule'
        options={{
          title: t('nav.schedule'),
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
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name='security'
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name='enroll-client'
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name='notifications'
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: t('nav.profile'),
          tabBarIcon: ({ color }) => <UserIcon color={color} size={24} />,
        }}
      />
    </Tabs>
    </SafeAreaView>
  );
}
