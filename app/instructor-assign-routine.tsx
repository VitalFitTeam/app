import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon, UserGroupIcon, UserIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InstructorAssignRoutineScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{
    clientId?: string;
    name?: string;
    level?: string;
    program?: string;
  }>();

  const clientName = params.name ?? t('instructor.assignRoutine.defaultClient');
  const clientLevel = params.level ?? t('instructor.assignRoutine.defaultLevel');
  const currentProgram = params.program ?? t('instructor.assignRoutine.defaultProgram');

  const exercises = [
    { id: 'ex1', title: t('instructor.assignRoutine.exercises.squats'), day: t('instructor.assignRoutine.exercises.monday'), series: 4, reps: 12, time: `5 ${t('instructor.assignRoutine.minutes')}` },
    { id: 'ex2', title: t('instructor.assignRoutine.exercises.benchPress'), day: t('instructor.assignRoutine.exercises.monday'), series: 4, reps: 10, time: `6 ${t('instructor.assignRoutine.minutes')}` },
    { id: 'ex3', title: t('instructor.assignRoutine.exercises.barbellRow'), day: t('instructor.assignRoutine.exercises.monday'), series: 4, reps: 12, time: `5 ${t('instructor.assignRoutine.minutes')}` },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 16, paddingBottom: 96 }}
      >
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Image
            source={require('@/assets/images/Frame.png')}
            style={{ width: 150, height: 50, resizeMode: 'contain' }}
          />
        </View>
        <View
          style={{
            width: '100%',
            backgroundColor: '#F3F4F6',
            borderRadius: 16,
            paddingVertical: 8,
            marginBottom: 12,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={{ position: 'absolute', left: 12, top: 8, bottom: 8, justifyContent: 'center' }}
          >
            <ChevronLeftIcon width={20} height={20} color='#f97316' />
          </TouchableOpacity>

          <ThemedText
            lightColor='#111827'
            style={{ fontFamily: 'System', fontSize: 16, fontWeight: '600' }}
          >
            {t('instructor.assignRoutine.title')}
          </ThemedText>
        </View>
        <View style={{ alignItems: 'flex-start', marginBottom: 16 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: '#FED7AA',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}
          >
            <UserIcon width={40} height={40} color='#f97316' />
          </View>

          <Text style={{ color: '#111827', fontSize: 20, fontWeight: '700', marginBottom: 2 }} className="font-body">
            {clientName}
          </Text>
          <Text style={{ color: '#6b7280', fontSize: 14 }} className="font-body">{clientLevel}</Text>
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }} className="font-body">{t('instructor.assignRoutine.selectRoutine')}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFFFFF' }}
          >
            <Text style={{ color: '#111827', fontSize: 14, fontWeight: '500' }} className="font-body">{t('instructor.assignRoutine.routineStrength')}</Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }} className="font-body">{currentProgram}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F3F4F6',
              borderRadius: 20,
              paddingVertical: 14,
              paddingHorizontal: 20,
            }}
          >
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ color: '#111827', fontSize: 18, fontWeight: '700', marginBottom: 2 }} className="font-body">{clientLevel.replace(t('instructor.assignRoutine.level') + ' ', '') || '1'}</Text>
              <Text style={{ color: '#4B5563', fontSize: 12 }} className="font-body">{t('instructor.assignRoutine.level')}</Text>
            </View>

            <View style={{ width: 1, height: 32, backgroundColor: '#D1D5DB' }} />

            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ color: '#111827', fontSize: 18, fontWeight: '700', marginBottom: 2 }} className="font-body">4/5</Text>
              <Text style={{ color: '#4B5563', fontSize: 12 }} className="font-body">{t('instructor.assignRoutine.progress')}</Text>
            </View>

            <View style={{ width: 1, height: 32, backgroundColor: '#D1D5DB' }} />

            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ color: '#111827', fontSize: 18, fontWeight: '700', marginBottom: 2 }} className="font-body">3/4</Text>
              <Text style={{ color: '#4B5563', fontSize: 12, textAlign: 'center' }} className="font-body">{t('instructor.assignRoutine.workouts')}</Text>
            </View>
          </View>
        </View>
        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              borderRadius: 20,
              backgroundColor: '#F3F4F6',
              paddingHorizontal: 12,
              paddingVertical: 12,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginBottom: 8,
              }}
            >
              <UserGroupIcon width={18} height={18} color='#f97316' />
              <Text style={{ color: '#111827', fontSize: 14, fontWeight: '600', marginLeft: 6 }} className="font-body">
                {t('instructor.assignRoutine.routineDetails')}
              </Text>
            </View>

            {exercises.map((ex) => (
              <LinearGradient
                key={ex.id}
                colors={['#3A2618', '#F27F2A', '#3A2618']}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ borderRadius: 16, padding: 14, marginBottom: 12 }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '500', fontSize: 16, marginBottom: 10 }} className="font-body">
                  {ex.title}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }} className="font-body">{t('instructor.assignRoutine.time')}</Text>
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }} className="font-body">{ex.time}</Text>
                  </View>
                </View>
              </LinearGradient>
            ))}
          </View>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }} className="font-body">{t('instructor.assignRoutine.routineNotes')}</Text>
          <TextInput
            placeholder={t('instructor.assignRoutine.notesPlaceholder')}
            placeholderTextColor='#9CA3AF'
            multiline
            style={{
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 16,
              paddingHorizontal: 12,
              paddingVertical: 12,
              minHeight: 120,
              textAlignVertical: 'top',
              fontSize: 13,
              color: '#111827',
            }}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          style={{ width: '100%', paddingVertical: 14, borderRadius: 16, backgroundColor: '#f97316', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }} className="font-body">{t('instructor.assignRoutine.assignButton')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={{ width: '100%', paddingVertical: 14, borderRadius: 16, backgroundColor: '#4b5563', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }} className="font-body">{t('instructor.assignRoutine.backToClients')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
