import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CheckCircleIcon, ChevronLeftIcon } from 'react-native-heroicons/solid';

const membershipPlans = [
  {
    id: 'free-trial',
    title: 'FREE TRIAL',
    price: '0',
    description: '7 días de acceso libres',
    period: '',
    isFree: true,
    badgeLabel: 'Gratis',
  },
  {
    id: 'advanced',
    title: 'SUSCRIPCIÓN AVANZADA',
    price: '75',
    description: 'Más beneficios para tu vida fitness',
    period: '/mes',
    isFree: false,
    badgeLabel: 'Actual',
  },
  {
    id: 'athlete',
    title: 'PAQUETE ATLETA',
    price: '500',
    description: 'La mejor relación calidad-precio',
    period: '/año',
    isFree: false,
    badgeLabel: 'Popular',
  },
];

export default function MyMembershipScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentPlanId] = useState<string>('advanced');

  const currentPlan = useMemo(
    () => membershipPlans.find(plan => plan.id === currentPlanId) ?? membershipPlans[1],
    [currentPlanId],
  );

  return (
    <ThemedView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 40, paddingBottom: 96 }}>
        <View
          className="w-full bg-[#F3F4F6] rounded-2xl py-2 mb-3 items-center justify-center"
          style={{ position: 'relative' }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={{ position: 'absolute', left: 12, top: 8, bottom: 8, justifyContent: 'center' }}>
            <ChevronLeftIcon width={20} height={20} color="#f97316" />
          </TouchableOpacity>

          <Text className='font-heading' style={{ color: '#111827', fontSize: 16, fontWeight: '600' }}>{t('myMembership.title')}</Text>
        </View>

        <View className="mb-4">
          <Text
            className="font-heading text-[14px] font-semibold text-[#111827] mb-8">
            {t('myMembership.currentPlan')}
          </Text>

          <View
            className="rounded-2xl px-4 py-4 border"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#F97316' }}>
            <View className="flex-row items-center justify-between mb-2">
              <View>
                <Text className="font-body text-xs text-[#6B7280] mb-1">{t('myMembership.currentSubscription')}</Text>
                <Text className="font-heading text-lg font-semibold" style={{ color: '#F97316' }}>
                  {currentPlan.title}
                </Text>
              </View>

              <View className="px-3 py-1 rounded-full" style={{ backgroundColor: '#FEF3C7' }}>
                <Text className="font-body text-[10px] font-semibold" style={{ color: '#F97316' }}>
                  {t('myMembership.active')}
                </Text>
              </View>
            </View>

            <Text className="font-body text-xs mb-4" style={{ color: '#4B5563' }}>
              {currentPlan.description}
            </Text>

            <View className="flex-row justify-between items-center">
              <View>
                <Text className="font-body text-xs mb-1" style={{ color: '#6B7280' }}>
                  {t('myMembership.expirationDate')}
                </Text>
                <Text className="font-body text-xs" style={{ color: '#111827' }}>
                  {t('myMembership.mockDate')}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                className="px-3 py-2 rounded-full"
                style={{ borderColor: '#D1D5DB', borderWidth: 1 }}
                onPress={() => router.push('/profile/membership-details')}>
                <Text className="font-body text-[11px]" style={{ color: '#111827' }}>
                  {t('myMembership.viewDetails')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="mb-3">
          <Text
            className="font-heading text-[14px] font-semibold text-[#111827] mb-8">
            {t('myMembership.allPlans')}
          </Text>

          {membershipPlans.map(plan => {
            const isCurrent = plan.id === currentPlanId;

            return (
              <View
                key={plan.id}
                className="mb-3 rounded-2xl border px-4 py-3"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: isCurrent ? '#F97316' : '#E5E7EB',
                }}>
                <View className="flex-row items-center justify-between mb-1">
                  <View>
                    <Text className="font-body text-xs mb-1" style={{ color: '#6B7280' }}>
                      {plan.description}
                    </Text>
                    <Text className="font-heading text-base font-semibold" style={{ color: '#F97316' }}>
                      {plan.title}
                    </Text>
                  </View>

                  <View className="items-end">
                    <Text className="font-heading text-lg font-semibold" style={{ color: '#111827' }}>
                      ${plan.price}
                      <Text className="font-body text-xs" style={{ color: '#6B7280' }}>
                        {plan.period}
                      </Text>
                    </Text>

                    {isCurrent ? (
                      <View className="mt-1 flex-row items-center px-2 py-1 rounded-full"
                        style={{ backgroundColor: '#FFF7ED', borderColor: '#FDBA74', borderWidth: 1 }}>
                        <CheckCircleIcon size={14} color="#F97316" />
                        <Text className="font-body ml-1 text-[10px]" style={{ color: '#F97316' }}>
                          {t('myMembership.currentPlan')}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                {!isCurrent && (
                  <PrimaryButton
                    title={t('myMembership.update')}
                    onPress={() => {
                      router.push('/membership-entry');
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ThemedView>
  );
}
