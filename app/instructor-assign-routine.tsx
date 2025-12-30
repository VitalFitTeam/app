import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon, UserGroupIcon, UserIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InstructorAssignRoutineScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    clientId?: string;
    name?: string;
    level?: string;
    program?: string;
  }>();

  const clientName = params.name ?? 'Cliente';
  const clientLevel = params.level ?? 'Nivel 1';
  const currentProgram = params.program ?? 'Rutina actual - Semana 1';

  const exercises = [
    { id: 'ex1', title: 'Sentadillas con barra – 4×12', day: 'Lunes', series: 4, reps: 12, time: '5 minutos' },
    { id: 'ex2', title: 'Press banca – 4×10', day: 'Lunes', series: 4, reps: 10, time: '6 minutos' },
    { id: 'ex3', title: 'Remo con barra – 4×12', day: 'Lunes', series: 4, reps: 12, time: '5 minutos' },
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
            Asignar rutina
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

          <Text style={{ color: '#111827', fontSize: 20, fontWeight: '700', marginBottom: 2 }}>
            {clientName}
          </Text>
          <Text style={{ color: '#6b7280', fontSize: 14 }}>{clientLevel}</Text>
        </View>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}>Seleccionar rutina</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFFFFF' }}
          >
            <Text style={{ color: '#111827', fontSize: 14, fontWeight: '500' }}>Rutina fuerza - Semana 1</Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>{currentProgram}</Text>
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
              <Text style={{ color: '#111827', fontSize: 18, fontWeight: '700', marginBottom: 2 }}>{clientLevel.replace('Nivel ', '') || '1'}</Text>
              <Text style={{ color: '#4B5563', fontSize: 12 }}>Nivel</Text>
            </View>

            <View style={{ width: 1, height: 32, backgroundColor: '#D1D5DB' }} />

            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ color: '#111827', fontSize: 18, fontWeight: '700', marginBottom: 2 }}>4/5</Text>
              <Text style={{ color: '#4B5563', fontSize: 12 }}>progreso</Text>
            </View>

            <View style={{ width: 1, height: 32, backgroundColor: '#D1D5DB' }} />

            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ color: '#111827', fontSize: 18, fontWeight: '700', marginBottom: 2 }}>3/4</Text>
              <Text style={{ color: '#4B5563', fontSize: 12, textAlign: 'center' }}>Entrenamientos</Text>
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
              <Text style={{ color: '#111827', fontSize: 14, fontWeight: '600', marginLeft: 6 }}>
                Detalles de la rutina seleccionada
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
                <Text style={{ color: '#FFFFFF', fontWeight: '500', fontSize: 16, marginBottom: 10 }}>
                  {ex.title}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>Tiempo</Text>
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>{ex.time}</Text>
                  </View>
                </View>
              </LinearGradient>
            ))}
          </View>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}>Notas de la rutina</Text>
          <TextInput
            placeholder='Instrucciones personalizadas para el cliente'
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
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>Asignar rutina</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={{ width: '100%', paddingVertical: 14, borderRadius: 16, backgroundColor: '#4b5563', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>Volver a Mis clientes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
