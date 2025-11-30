import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';

const benefits = [
  'Acceso ilimitado al gimnasio',
  '7 sesiones con consultor fitness',
  'Seguimiento nutricional',
  'Suplementos gratis',
  'Cordialidad en gimnasio',
  'Entrenador personal',
];

const includedServices = ['Gimnasio', 'Clases Premium', 'Seguimiento nutricional', 'Yoga'];

export default function MembershipDetailsScreen() {
  const router = useRouter();

  return (
    <ThemedView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 40, paddingBottom: 96 }}>
        {/* Franja superior */}
        <View
          className="w-full bg-[#F3F4F6] rounded-2xl py-2 mb-3 items-center justify-center"
          style={{ position: 'relative' }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={{ position: 'absolute', left: 12, top: 8, bottom: 8, justifyContent: 'center' }}>
            <ChevronLeftIcon width={20} height={20} color="#f97316" />
          </TouchableOpacity>

          <Text style={{ color: '#111827', fontSize: 16, fontWeight: '600' }}>Detalles de membresía</Text>
        </View>

        {/* Plan actual */}
        <View className="mb-4">
          <Text className="text-[14px] font-semibold text-[#111827] mb-2">Plan actual</Text>

          <View
            className="rounded-2xl px-4 py-4 border"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#F97316' }}>
            <View className="flex-row items-center justify-between mb-2">
              <View>
                <Text className="text-xs mb-1" style={{ color: '#6B7280' }}>
                  SUSCRIPCIÓN AVANZADA
                </Text>
                <Text className="text-lg font-semibold" style={{ color: '#F97316' }}>
                  Más beneficios para tu vida fitness
                </Text>
              </View>

              <View className="px-3 py-1 rounded-full" style={{ backgroundColor: '#FEF3C7' }}>
                <Text className="text-[10px] font-semibold" style={{ color: '#F97316' }}>
                  Activo
                </Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-xs mb-1" style={{ color: '#6B7280' }}>
                Fecha de vencimiento
              </Text>
              <Text className="text-xs" style={{ color: '#111827' }}>
                11 de Diciembre del 2025
              </Text>
            </View>

            <View className="mb-3">
              {benefits.map(item => (
                <View key={item} className="flex-row items-start mb-1">
                  <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#F97316' }} />
                  <Text className="text-xs ml-2" style={{ color: '#111827' }}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Servicios incluidos */}
        <View className="mb-4">
          <Text className="text-[14px] font-semibold text-[#111827] mb-2">Servicios incluidos</Text>

          <View
            className="rounded-2xl px-4 py-4 border"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
            {includedServices.map(service => (
              <View key={service} className="flex-row items-start mb-1">
                <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#F97316' }} />
                <Text className="text-xs ml-2" style={{ color: '#111827' }}>
                  {service}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Restricciones */}
        <View className="mb-4">
          <Text className="text-[14px] font-semibold text-[#111827] mb-2">Restricciones</Text>

          <View
            className="rounded-2xl px-4 py-4 border"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
            <Text className="text-xs" style={{ color: '#111827' }}>
              Cancelaciones requieren notificación 30 días antes de la fecha de renovación.
            </Text>
          </View>
        </View>

        {/* Cancelación */}
        <View className="mt-2">
          <View
            className="rounded-2xl border px-4 py-4"
            style={{ borderColor: '#DC2626', backgroundColor: '#FFFFFF' }}>
            <Text
              className="text-[12px] font-semibold mb-1"
              style={{ color: '#B91C1C' }}>
              CANCELAR MEMBRESÍA
            </Text>
            <Text className="text-xs mb-4" style={{ color: '#B91C1C' }}>
              Tu membresía permanecerá activa hasta el 31 de Dic 2024.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              className="w-full rounded-full py-3 items-center justify-center"
              style={{ backgroundColor: '#EF4444' }}
              onPress={() => {
                router.push('/profile/cancel-membership');
              }}>
              <Text className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>
                Cancelar renovación
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
