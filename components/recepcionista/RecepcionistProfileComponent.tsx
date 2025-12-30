import { ThemedView } from '@/components/themed-view';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  ArrowRightOnRectangleIcon,
  BellIcon,
  ChevronRightIcon,
  QrCodeIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  UserCircleIcon
} from 'react-native-heroicons/outline';

export default function RecepcionistProfileComponent() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No se encontró token en AsyncStorage');
          return;
        }

        const userData = await vitalFitApi.user.WhoAmI(token);
        setFirstName(userData?.user?.first_name || 'Laura');
        setLastName(userData?.user?.last_name || 'Torres');
      } catch (error: unknown) {
        let errorMessage = t('common.error.unexpected');
        if (isAPIError(error)) {
          errorMessage = error.messages.join(', ');
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        console.error('Error en la solicitud whoami (Perfil recepcionista):', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [t]);

  if (loading) {
    return (
      <ThemedView className='flex-1 justify-center items-center bg-white'>
        <ActivityIndicator size='large' color='#F27F2A' />
      </ThemedView>
    );
  }

  const displayName = lastName ? `${firstName ?? 'Laura'} ${lastName}` : firstName ?? 'Laura Torres';

  const handleConfirmLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Error al eliminar el token en logout:', error);
    } finally {
      setLogoutModalVisible(false);
      router.replace('/(auth)/login');
    }
  };

  return (
    <ThemedView className='flex-1 bg-white pt-10'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96 }}>
        <View className='mb-4 items-start'>
          <View className='w-24 h-24 rounded-full overflow-hidden mb-3 bg-[#FED7AA] items-center justify-center'>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/32.jpg' }}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
          <Text className='text-[20px] font-semibold text-[#111827]'>{displayName}</Text>
          <Text className='text-[13px] text-[#6b7280] mt-1'>{t('dashboard.recepcionistDefault')}</Text>
          <Text className='text-[13px] text-[#f97316] mt-0.5'>{t('profile.staffViralFit')}</Text>
        </View>
        <View className='mb-4'>
          <Text className='text-[14px] font-semibold text-[#111827] mb-1'>{t('profile.aboutMe')}</Text>
          <Text className='text-[13px] text-[#4b5563] leading-5'>
            {t('profile.aboutMeDescription')}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          className='w-full rounded-2xl border border-[#d1d5db] py-3 px-4 mb-4 flex-row items-center justify-center bg-white'
          onPress={() => setQrModalVisible(true)}>
          <QrCodeIcon width={18} height={18} color='#111827' />
          <Text className='ml-2 text-[13px] font-medium text-[#111827]'>{t('dashboard.validateCheckIn.scanQr')}</Text>
        </TouchableOpacity>

        <View className='flex-row justify-between mb-6'>
          <View className='flex-1 bg-white rounded-xl border border-[#e5e7eb] py-3 px-2 mx-1 items-center'>
            <Text className='text-[16px] font-bold text-[#f97316] mb-1'>6</Text>
            <Text className='text-[11px] text-[#4b5563]'>{t('common.years')}</Text>
          </View>
          <View className='flex-1 bg-white rounded-xl border border-[#e5e7eb] py-3 px-2 mx-1 items-center'>
            <Text className='text-[16px] font-bold text-[#f97316] mb-1'>46</Text>
            <Text className='text-[11px] text-[#4b5563]'>{t('common.classes')}</Text>
          </View>
          <View className='flex-1 bg-white rounded-xl border border-[#e5e7eb] py-3 px-2 mx-1 items-center'>
            <Text className='text-[16px] font-bold text-[#f97316] mb-1'>25</Text>
            <Text className='text-[11px] text-[#4b5563]'>{t('common.clients')}</Text>
          </View>
        </View>

        <View className='mb-2'>
          <Text className='text-[14px] font-semibold text-[#111827] mb-2'>{t('profile.settings')}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          className='w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3'
          onPress={() => {
            router.push('/(recepcionist)/personal-info');
          }}>
          <View className='flex-row items-center'>
            <View className='w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3'>
              <UserCircleIcon width={18} height={18} color='#111827' />
            </View>
            <Text className='text-[13px] text-[#111827]'>{t('profile.personalInfo')}</Text>
          </View>
          <ChevronRightIcon width={16} height={16} color='#9ca3af' />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className='w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3'
          onPress={() => {
            router.push('/(recepcionist)/security');
          }}>
          <View className='flex-row items-center'>
            <View className='w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3'>
              <ShieldCheckIcon width={18} height={18} color='#111827' />
            </View>
            <Text className='text-[13px] text-[#111827]'>{t('profile.security')}</Text>
          </View>
          <ChevronRightIcon width={16} height={16} color='#9ca3af' />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className='w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3'
          onPress={() => {
            router.push('/(recepcionist)/notifications');
          }}>
          <View className='flex-row items-center'>
            <View className='w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3'>
              <BellIcon width={18} height={18} color='#111827' />
            </View>
            <Text className='text-[13px] text-[#111827]'>{t('dashboard.notifications.title')}</Text>
          </View>
          <ChevronRightIcon width={16} height={16} color='#9ca3af' />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className='w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3'
          onPress={() => {
            alert(t('profile.helpSupportDev'));
          }}>
          <View className='flex-row items-center'>
            <View className='w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3'>
              <QuestionMarkCircleIcon width={18} height={18} color='#111827' />
            </View>
            <Text className='text-[13px] text-[#111827]'>{t('profile.helpSupport')}</Text>
          </View>
          <ChevronRightIcon width={16} height={16} color='#9ca3af' />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className='w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-6'
          onPress={() => {
            setLogoutModalVisible(true);
          }}>
          <View className='flex-row items-center'>
            <View className='w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3'>
              <ArrowRightOnRectangleIcon width={18} height={18} color='#b91c1c' />
            </View>
            <Text className='text-[13px] text-[#b91c1c] font-semibold'>{t('profile.logout')}</Text>
          </View>
          <ChevronRightIcon width={16} height={16} color='#b91c1c' />
        </TouchableOpacity>
      </ScrollView>

      <Modal
        animationType='fade'
        transparent
        visible={qrModalVisible}
        onRequestClose={() => setQrModalVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setQrModalVisible(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.55)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}>
          <View
            style={{
              width: '100%',
              maxWidth: 360,
              borderRadius: 16,
              backgroundColor: '#1f2937',
              paddingVertical: 24,
              paddingHorizontal: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#F9FAFB',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 8,
              }}>
              {t('profile.qrModalTitle')}
            </Text>
            <Text
              style={{
                color: '#E5E7EB',
                fontSize: 13,
                textAlign: 'center',
                marginBottom: 20,
              }}>
              {t('profile.qrModalDescription')}
            </Text>

            <View
              style={{
                width: 170,
                height: 170,
                borderRadius: 28,
                backgroundColor: '#374151',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}>
              <QrCodeIcon width={120} height={120} color='#F9FAFB' />
            </View>
            
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setQrModalVisible(false)}
              style={{
                marginTop: 12,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 999,
                backgroundColor: '#f97316',
              }}>
              <Text style={{ fontSize: 13, color: '#FFFFFF', fontWeight: '600' }}>
                {t('profile.startScan')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType='fade'
        onRequestClose={() => setLogoutModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}>
          <View
            style={{
              width: '100%',
              maxWidth: 360,
              borderRadius: 16,
              backgroundColor: '#FFFFFF',
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#111827',
                marginBottom: 8,
              }}>
              {t('profile.logoutConfirmTitle')}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: '#4b5563',
                marginBottom: 16,
              }}>
              {t('profile.logoutConfirmMessage')}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setLogoutModalVisible(false)}
                style={{ paddingVertical: 8, paddingHorizontal: 12, marginRight: 8 }}>
                <Text style={{ fontSize: 13, color: '#4b5563' }}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleConfirmLogout}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  backgroundColor: '#f97316',
                }}>
                <Text style={{ fontSize: 13, color: '#FFFFFF', fontWeight: '600' }}>
                  {t('profile.logout')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}
