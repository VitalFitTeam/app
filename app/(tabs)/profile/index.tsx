import { ClientQRModal } from '@/components/client/ClientQRModal';
import { useUser } from '@/contexts/UserContext';
import { useReservations } from '@/contexts/reservations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  ArrowRightOnRectangleIcon,
  BellIcon,
  ChevronRightIcon,
  CreditCardIcon,
  GlobeAltIcon,
  LanguageIcon,
  QrCodeIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  TicketIcon,
  TrophyIcon,
  UserCircleIcon,
} from 'react-native-heroicons/outline';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, loading, clearUser } = useUser();
  const { clearReservations } = useReservations();
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-neutral-950">
        <ActivityIndicator size="large" color="#F27F2A" />
      </View>
    );
  }

  const displayName = user
    ? user.lastName
      ? `${user.firstName || t('client.profile.defaultUser')} ${user.lastName}`
      : user.firstName || t('client.profile.defaultUser')
    : t('client.profile.defaultUser');

  const handleConfirmLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await clearReservations();
      clearUser();
    } catch (error) {
      console.error('Error al eliminar el token en logout:', error);
    } finally {
      setLogoutModalVisible(false);
      router.replace('/(auth)/login');
    }
  };

  const defaultImage = user?.gender === 'F' 
    ? require('@/assets/images/Female.svg') 
    : require('@/assets/images/Man.svg');

  const profileImageSource = user?.profilePicture ? { uri: user.profilePicture } : defaultImage;

  return (
    <View className="flex-1 bg-white dark:bg-neutral-950">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 40, paddingBottom: 96 }}
      >
        <View className="mb-4 items-start">
          <View className="w-24 h-24 rounded-full overflow-hidden mb-3 bg-[#FED7AA] items-center justify-center">
            <Image
              source={profileImageSource}
              style={{ width: '100%', height: '100%' }}
              contentFit='cover'
            />
          </View>
          <Text className="text-[20px] font-semibold text-[#111827]">{displayName}</Text>
          {(user?.roleName === 'Instructor' || user?.roleName === 'Staff') ? (
            <>
              <Text className="text-[13px] text-[#6b7280] mt-1">{user?.specialty || t('client.profile.personalTrainer')}</Text>
              <Text className="text-[13px] text-[#f97316] mt-0.5">{user?.roleName}</Text>
            </>
          ) : (
            <>
              <View className="flex-row items-center mt-1">
                <Text className="text-[13px] text-[#6b7280] mr-1">{t('client.profile.level')} 24</Text>
                <Image
                  source={require('@/assets/images/medal2.png')}
                  style={{ width: 14, height: 14 }}
                  contentFit="contain"
                />
              </View>
              <Text className="text-[13px] text-[#f97316] mt-0.5">{t('client.profile.premium')}</Text>
            </>
          )}
        </View>

        <View className="mb-4">
          <Text className="text-[14px] font-semibold text-[#111827] mb-1">{t('client.profile.aboutMe')}</Text>
          <Text className="text-[13px] text-[#4b5563] leading-5">
            {t('client.profile.aboutMeDescription')}
          </Text>
        </View>

        <View className="w-full bg-[#F3F4F6] rounded-2xl py-3 px-3 mb-6 flex-row justify-between">
          <View className="flex-1 items-center">
            <Text className="text-[18px] font-semibold text-[#111827]">6</Text>
            <Text className="text-[11px] text-[#4b5563] mt-1">{t('client.profile.stats.workouts')}</Text>
          </View>
          <View className="w-px bg-[#d1d5db] mx-2" />
          <View className="flex-1 items-center">
            <Text className="text-[18px] font-semibold text-[#111827]">46</Text>
            <Text className="text-[11px] text-[#4b5563] mt-1">{t('client.profile.stats.badges')}</Text>
          </View>
          <View className="w-px bg-[#d1d5db] mx-2" />
          <View className="flex-1 items-center">
            <Text className="text-[18px] font-semibold text-[#111827]">25</Text>
            <Text className="text-[11px] text-[#4b5563] mt-1">{t('client.profile.stats.points')}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          className="w-full rounded-2xl border border-[#d1d5db] py-3 px-4 mb-4 flex-row items-center justify-center bg-white"
          onPress={() => setQrModalVisible(true)}
        >
          <QrCodeIcon width={18} height={18} color="#111827" />
          <Text className="ml-2 text-[13px] font-medium text-[#111827]">{t('client.profile.checkIn')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          className="w-full rounded-2xl mb-6 flex-row items-center justify-between"
          style={{ backgroundColor: '#F3F4F6', paddingVertical: 14, paddingHorizontal: 16 }}
          onPress={() => router.push('/profile/referrals')}
        >
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#f97316',
                marginBottom: 4,
              }}
            >
              {t('client.profile.referralCode')}
            </Text>
            <Text
              style={{
                fontSize: 12,
                letterSpacing: 1,
                color: '#6B7280',
              }}
            >
              LUCASSCOTT2026
            </Text>
          </View>
          <ChevronRightIcon width={16} height={16} color="#9ca3af" />
        </TouchableOpacity>

        <View className="mb-2">
          <Text className="text-[14px] font-semibold text-[#111827] mb-2">{t('client.profile.settings')}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3"
          onPress={() => {
            router.push('/profile/my-profile');
          }}
        >
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3">
              <UserCircleIcon width={18} height={18} color="#111827" />
            </View>
            <Text className="text-[13px] text-[#111827]">{t('client.profile.personalInfo')}</Text>
          </View>
          <ChevronRightIcon width={16} height={16} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3"
          onPress={() => {
            router.push('/profile/profile-settings');
          }}
        >
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3">
              <ShieldCheckIcon width={18} height={18} color="#111827" />
            </View>
            <Text className="text-[13px] text-[#111827]">{t('client.profile.security')}</Text>
          </View>
          <ChevronRightIcon width={16} height={16} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3"
          onPress={() => {
            router.push('/profile/my-membership');
          }}
        >
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3">
              <TicketIcon width={18} height={18} color="#111827" />
            </View>
            <Text className="text-[13px] text-[#111827]">{t('client.profile.myMembership')}</Text>
          </View>
          <ChevronRightIcon width={16} height={16} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3"
          onPress={() => {
            router.push('/profile/insignias');
          }}
        >
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3">
              <TrophyIcon width={18} height={18} color="#111827" />
            </View>
            <Text className="text-[13px] text-[#111827]">{t('client.profile.badges')}</Text>
          </View>
          <ChevronRightIcon width={16} height={16} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3"
          onPress={() => {
            router.push('/profile/language');
          }}
        >
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3">
              <LanguageIcon width={18} height={18} color="#111827" />
            </View>
            <Text className="text-[13px] text-[#111827]">{t('client.profile.language')}</Text>
          </View>
          <ChevronRightIcon width={16} height={16} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3"
          onPress={() => {
            router.push('/profile/notifications');
          }}
        >
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3">
              <BellIcon width={18} height={18} color="#111827" />
            </View>
            <Text className="text-[13px] text-[#111827]">{t('client.profile.notifications')}</Text>
          </View>
          <ChevronRightIcon width={16} height={16} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3"
          onPress={() => {
            console.log('Ayuda y soporte');
          }}
        >
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3">
              <QuestionMarkCircleIcon width={18} height={18} color="#111827" />
            </View>
            <Text className="text-[13px] text-[#111827]">{t('client.profile.helpSupport')}</Text>
          </View>
          <ChevronRightIcon width={16} height={16} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3"
          onPress={() => {
            console.log('Términos y condiciones');
          }}
        >
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3">
              <GlobeAltIcon width={18} height={18} color="#111827" />
            </View>
            <Text className="text-[13px] text-[#111827]">{t('client.profile.termsConditions')}</Text>
          </View>
          <ChevronRightIcon width={16} height={16} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3"
          onPress={() => {
            router.push('/profile/payment-history');
          }}
        >
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3">
              <CreditCardIcon width={18} height={18} color="#111827" />
            </View>
            <Text className="text-[13px] text-[#111827]">{t('client.profile.paymentHistory')}</Text>
          </View>
          <ChevronRightIcon width={16} height={16} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-6"
          onPress={() => {
            setLogoutModalVisible(true);
          }}
        >
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3">
              <ArrowRightOnRectangleIcon width={18} height={18} color="#b91c1c" />
            </View>
            <Text className="text-[13px] text-[#b91c1c] font-semibold">{t('client.profile.logout')}</Text>
          </View>
          <ChevronRightIcon width={16} height={16} color="#b91c1c" />
        </TouchableOpacity>
      </ScrollView>

      <ClientQRModal visible={qrModalVisible} onClose={() => setQrModalVisible(false)} />

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 360,
              borderRadius: 16,
              backgroundColor: '#FFFFFF',
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#111827',
                marginBottom: 8,
              }}
            >
              {t('client.profile.logoutConfirm.title')}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: '#4b5563',
                marginBottom: 16,
              }}
            >
              {t('client.profile.logoutConfirm.message')}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setLogoutModalVisible(false)}
                style={{ paddingVertical: 8, paddingHorizontal: 12, marginRight: 8 }}
              >
                <Text style={{ fontSize: 13, color: '#4b5563' }}>{t('client.profile.logoutConfirm.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleConfirmLogout}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  backgroundColor: '#f97316',
                }}
              >
                <Text style={{ fontSize: 13, color: '#FFFFFF', fontWeight: '600' }}>
                  {t('client.profile.logout')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}