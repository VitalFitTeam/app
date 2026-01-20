import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { TrophyIcon as TrophyOutlineIcon } from 'react-native-heroicons/outline';
import { ChevronLeftIcon, GiftIcon, LockClosedIcon, StarIcon } from 'react-native-heroicons/solid';

export default function InsigniasScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const handleBack = React.useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/dashboard');
    }
  }, [router]);

   useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          handleBack(); 
          return true;
        };
  
        const subscription = BackHandler.addEventListener(
          'hardwareBackPress',
          onBackPress
        );
  
        return () => subscription.remove();
      }, [handleBack])
    );

      const badges = [
        { id: 'b1', titleKey: 'firstClass', rarityKey: 'common', medal: require('@/assets/images/medal1.png'), locked: false },
        { id: 'b2', titleKey: 'ironWarrior', rarityKey: 'epic', medal: require('@/assets/images/medal2.png'), locked: false },
        { id: 'b3', titleKey: 'earlyBird', rarityKey: 'rare', medal: require('@/assets/images/medal3.png'), locked: false },
        { id: 'b4', titleKey: 'firstClass', rarityKey: 'common', medal: require('@/assets/images/medal1.png'), locked: false },
        { id: 'b5', titleKey: 'ironWarrior', rarityKey: 'epic', medal: require('@/assets/images/medal2.png'), locked: false },
        { id: 'b6', titleKey: 'earlyBird', rarityKey: 'rare', medal: require('@/assets/images/medal3.png'), locked: false },
        { id: 'b7', titleKey: 'firstClass', rarityKey: 'common', medal: require('@/assets/images/medal1.png'), locked: false },
        {
          id: 'b8',
          titleKey: 'champion',
          rarityKey: 'legendary',
          medal: require('@/assets/images/medal4.png'),
          locked: true,
          requirementKey: 'champion',
        },
        {
          id: 'b9',
          titleKey: 'devoted',
          rarityKey: 'legendary',
          medal: require('@/assets/images/medal4.png'),
          locked: true,
          requirementKey: 'devoted',
        },
      ];

      return (
        <ThemedView className="flex-1 bg-white">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 40, paddingBottom: 96 }}
          >
            <View
              className="w-full bg-[#F3F4F6] rounded-2xl py-2 mb-3 items-center justify-center"
              style={{ position: 'relative' }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleBack}
                style={{ position: 'absolute', left: 12, top: 8, bottom: 8, justifyContent: 'center' }}
              >
                <ChevronLeftIcon width={20} height={20} color="#f97316" />
              </TouchableOpacity>

              <Text className='font-heading' style={{ color: '#111827', fontSize: 16, fontWeight: '600' }}>{t('insignias.title')}</Text>
            </View>

            <LinearGradient
              colors={['#FBBF24', '#F97316']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16, marginBottom: 16 }}
            >
              <View className="flex-row justify-between items-center mb-3">
                <View>
                  <Text className='font-body' style={{ color: '#FFFFFF', fontSize: 12 }}>{t('insignias.currentLevel')}</Text>
                  <Text className='font-heading' style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginTop: 4 }}>24 / 100</Text>
                  <Text className='font-body' style={{ color: '#FDE68A', fontSize: 11, marginTop: 2 }}>{t('insignias.progressToLevel', { level: 25 })}</Text>
                </View>
                <View className="items-center justify-center">
                  <Image
                    source={require('@/assets/images/medal2.png')}
                    style={{ width: 40, height: 40 }}
                    contentFit="contain"
                  />
                </View>
              </View>

              <View
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
              >
                <View className="h-full" style={{ width: '24%', backgroundColor: '#FDBA74' }} />
              </View>
            </LinearGradient>

            <View className="flex-row mb-4">
              <View
                className="flex-1 items-center py-3 rounded-2xl"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderWidth: 1, marginRight: 6 }}
              >
                <GiftIcon width={20} height={20} color="#F97316" />
                <Text className='font-heading' style={{ color: '#111827', fontSize: 18, fontWeight: '600', marginTop: 4 }}>4850</Text>
                <Text className='font-body' style={{ color: '#6B7280', fontSize: 11 }}>{t('insignias.stats.points')}</Text>
              </View>
              <View
                className="flex-1 items-center py-3 rounded-2xl"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderWidth: 1, marginHorizontal: 3 }}
              >
                <StarIcon width={20} height={20} color="#FACC15" />
                <Text className='font-heading' style={{ color: '#111827', fontSize: 18, fontWeight: '600', marginTop: 4 }}>4</Text>
                <Text className='font-body' style={{ color: '#6B7280', fontSize: 11 }}>{t('insignias.stats.badges')}</Text>
              </View>
              <View
                className="flex-1 items-center py-3 rounded-2xl"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderWidth: 1, marginLeft: 6 }}
              >
                <TrophyOutlineIcon width={20} height={20} color="#22C55E" />
                <Text className='font-heading' style={{ color: '#111827', fontSize: 18, fontWeight: '600', marginTop: 4 }}>5</Text>
                <Text className='font-body' style={{ color: '#6B7280', fontSize: 11 }}>{t('insignias.stats.referrals')}</Text>
              </View>
            </View>

            <View
              className="rounded-2xl mb-4 flex-row items-center justify-between px-4 py-3"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderWidth: 1 }}
            >
              <View>
                <Text className='font-heading' style={{ color: '#F97316', fontSize: 12, fontWeight: '600' }}>{t('insignias.badgesObtained')}</Text>
                <Text className='font-body' style={{ color: '#6B7280', fontSize: 11 }}>4 / 12</Text>
              </View>
              <View className="items-end">
                <Text className='font-body' style={{ color: '#6B7280', fontSize: 11 }}>{t('insignias.progress')}</Text>
                <Text className='font-heading' style={{ color: '#22C55E', fontSize: 13, fontWeight: '600' }}>33%</Text>
              </View>
            </View>

            <View className="mb-4">
              <View className="flex-row flex-wrap justify-between">
                {badges.map(badge => (
                  <View
                    key={badge.id}
                    className="mb-3 rounded-2xl px-3 py-3 items-center"
                    style={{
                      width: '31%',
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E5E7EB',
                      borderWidth: 1,
                      opacity: badge.locked ? 0.5 : 1,
                    }}
                  >
                    <View className="items-center mb-2">
                      {badge.locked ? (
                        <LockClosedIcon width={28} height={28} color="#9CA3AF" />
                      ) : (
                        <Image
                          source={badge.medal}
                          style={{ width: 40, height: 40 }}
                          contentFit="contain"
                        />
                      )}
                    </View>
                    <Text
                      className='font-heading'
                      style={{ color: '#111827', fontSize: 11, fontWeight: '600', textAlign: 'center', marginBottom: 6 }}
                      numberOfLines={2}
                    >
                      {t(`insignias.badgeNames.${badge.titleKey}`)}
                    </Text>

                    <View
                      className="rounded-full px-2 py-1"
                      style={{ backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', borderWidth: 1 }}
                    >
                      <Text className='font-body' style={{ color: '#6B7280', fontSize: 9, textAlign: 'center' }}>{t(`insignias.rarity.${badge.rarityKey}`)}</Text>
                    </View>

                    {badge.locked && badge.requirementKey ? (
                      <Text
                        className='font-body'
                        style={{
                          marginTop: 4,
                          color: '#9CA3AF',
                          fontSize: 9,
                          textAlign: 'center',
                        }}
                        numberOfLines={2}
                      >
                        {t(`insignias.requirements.${badge.requirementKey}`)}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </ThemedView>
      );
    }
