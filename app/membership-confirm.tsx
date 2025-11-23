import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Dumbbell } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { CheckCircleIcon, ExclamationTriangleIcon } from 'react-native-heroicons/outline';
import { StarIcon, TrophyIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ConfirmParams {
  id?: string;
  title?: string;
  price?: string;
  branch?: string;
  method?: string;
  addonsJson?: string;
}

export default function MembershipConfirmScreen() {
  const router = useRouter();
  const rawParams = useLocalSearchParams();
  const params = rawParams as ConfirmParams;

  const addons = useMemo(() => {
    if (!params.addonsJson) return [] as { id: string; title: string; price: number }[];
    try {
      const parsed = JSON.parse(params.addonsJson as string);
      if (Array.isArray(parsed)) return parsed as { id: string; title: string; price: number }[];
      return [];
    } catch {
      return [];
    }
  }, [params.addonsJson]);

  const basePrice = Number(params.price ?? '0') || 0;
  const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0);
  const totalPrice = basePrice + addonsTotal;

  const currentStep: number = 3;

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView className='flex-1 px-6 pt-8 pb-32'>
        {/* Header y pasos */}
        <View className='mb-6'>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='text-4xl mb-4 text-center'
            style={{ fontFamily: 'BebasNeue-Regular' }}
          >
            COMPRAR MEMBRESÍA
          </ThemedText>

          <View className='flex-row justify-between items-center mb-4'>
            <View className='items-center flex-1'>
              <View
                className={`w-8 h-8 rounded-full items-center justify-center mb-1 border ${
                  currentStep === 1 ? 'bg-orange-500 border-orange-500' : 'bg-white border-neutral-400'
                }`}
              >
                <ThemedText
                  lightColor={currentStep === 1 ? '#ffffff' : '#111827'}
                  darkColor={currentStep === 1 ? '#ffffff' : '#111827'}
                  className='text-[10px] font-semibold'
                  style={{ fontFamily: 'Montserrat_500Medium' }}
                >
                  1
                </ThemedText>
              </View>
              <ThemedText
                lightColor={currentStep === 1 ? '#f97316' : '#111827'}
                darkColor={currentStep === 1 ? '#f97316' : '#111827'}
                className='text-[11px] text-center'
                style={{ fontFamily: 'Montserrat_500Medium' }}
              >
                Opciones de producto
              </ThemedText>
            </View>
            <View className='items-center flex-1'>
              <View
                className={`w-8 h-8 rounded-full items-center justify-center mb-1 border ${
                  currentStep === 2 ? 'bg-orange-500 border-orange-500' : 'bg-white border-neutral-400'
                }`}
              >
                <ThemedText
                  lightColor={currentStep === 2 ? '#ffffff' : '#111827'}
                  darkColor={currentStep === 2 ? '#ffffff' : '#111827'}
                  className='text-[10px] font-semibold'
                  style={{ fontFamily: 'Montserrat_500Medium' }}
                >
                  2
                </ThemedText>
              </View>
              <ThemedText
                lightColor={currentStep === 2 ? '#f97316' : '#111827'}
                darkColor={currentStep === 2 ? '#f97316' : '#111827'}
                className='text-[11px] text-center'
                style={{ fontFamily: 'Montserrat_500Medium' }}
              >
                Métodos de pago
              </ThemedText>
            </View>
            <View className='items-center flex-1'>
              <View
                className={`w-8 h-8 rounded-full items-center justify-center mb-1 border ${
                  currentStep === 3 ? 'bg-orange-500 border-orange-500' : 'bg-white border-neutral-400'
                }`}
              >
                <ThemedText
                  lightColor={currentStep === 3 ? '#ffffff' : '#111827'}
                  darkColor={currentStep === 3 ? '#ffffff' : '#111827'}
                  className='text-[10px] font-semibold'
                  style={{ fontFamily: 'Montserrat_500Medium' }}
                >
                  3
                </ThemedText>
              </View>
              <ThemedText
                lightColor={currentStep === 3 ? '#f97316' : '#111827'}
                darkColor={currentStep === 3 ? '#f97316' : '#111827'}
                className='text-[11px] text-center'
                style={{ fontFamily: 'Montserrat_500Medium' }}
              >
                Confirmación de compra
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Complementos seleccionados */}
        {addons.length > 0 && (
          <View className='mb-6 border border-orange-500/60 rounded-2xl px-4 py-3 bg-white'>
            <ThemedText
              lightColor='#f97316'
              darkColor='#f97316'
              className='text-xs tracking-[0.2em] mb-2'
              style={{ fontFamily: 'Montserrat_500Medium' }}
            >
              COMPLEMENTOS AGREGADOS
            </ThemedText>
            {addons.map(addon => (
              <View key={addon.id} className='flex-row items-baseline justify-between mb-1'>
                <ThemedText
                  lightColor='#4b5563'
                  darkColor='#e5e7eb'
                  className='text-xs flex-1 mr-2'
                  style={{ fontFamily: 'Montserrat_400Regular' }}
                >
                  {addon.title}
                </ThemedText>
                <ThemedText
                  lightColor='#111827'
                  darkColor='#ffffff'
                  className='text-xs font-semibold'
                  style={{ fontFamily: 'Montserrat_600SemiBold' }}
                >
                  ${addon.price.toFixed(2)}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        {/* Icono y mensaje de éxito */}
        <View className='items-center mb-6'>
          <View className='w-20 h-20 rounded-full bg-orange-500 items-center justify-center mb-3'>
            <CheckCircleIcon size={56} color='#ffffff' />
          </View>
          <ThemedText
            lightColor='#111827'
            darkColor='#ffffff'
            className='text-lg mb-1'
            style={{ fontFamily: 'Montserrat_700Bold' }}
          >
            ¡Compra registrada!
          </ThemedText>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='text-xs text-center'
            style={{ fontFamily: 'Montserrat_400Regular' }}
          >
            Tu compra ha sido registrada y está en proceso de verificación.
          </ThemedText>
        </View>

        {/* Tarjeta de suscripción */}
        <View className='mb-6 border border-orange-500/80 rounded-2xl px-4 py-3 bg-white'>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='text-xs tracking-[0.2em] mb-1'
            style={{ fontFamily: 'Montserrat_500Medium' }}
          >
            {params.title ? params.title.toUpperCase() : 'SUSCRIPCIÓN'}
          </ThemedText>
          <View className='flex-row items-baseline justify-between mb-3'>
            <View className='flex-1 mr-2'>
              <ThemedText
                lightColor='#4b5563'
                darkColor='#d1d5db'
                className='text-xs'
                style={{ fontFamily: 'Montserrat_400Regular' }}
              >
                Más beneficios para tu vida fitness
              </ThemedText>
            </View>
            <View className='items-end'>
              <ThemedText
                lightColor='#111827'
                darkColor='#ffffff'
                className='text-2xl'
                style={{ fontFamily: 'Montserrat_700Bold' }}
              >
                ${totalPrice.toFixed(2)}
              </ThemedText>
              <ThemedText
                lightColor='#4b5563'
                darkColor='#d1d5db'
                className='text-xs mt-[-4]'
                style={{ fontFamily: 'Montserrat_500Medium' }}
              >
                /mes
              </ThemedText>
            </View>
          </View>

          {/* Resumen de beneficios */}
          <View className='flex-row justify-between'>
            <View className='flex-1 items-center'>
              <View className='w-10 h-10 rounded-full border border-orange-500 items-center justify-center mb-1'>
                <TrophyIcon size={20} color='#f97316' />
              </View>
              <ThemedText
                lightColor='#4b5563'
                darkColor='#e5e7eb'
                className='text-[11px] text-center'
                style={{ fontFamily: 'Montserrat_400Regular' }}
              >
                Válida 30 días
              </ThemedText>
            </View>
            <View className='flex-1 items-center'>
              <View className='w-10 h-10 rounded-full border border-orange-500 items-center justify-center mb-1'>
                <Dumbbell size={18} color='#f97316' strokeWidth={2.8} />
              </View>
              <ThemedText
                lightColor='#4b5563'
                darkColor='#e5e7eb'
                className='text-[11px] text-center'
                style={{ fontFamily: 'Montserrat_400Regular' }}
              >
                Acceso ilimitado
              </ThemedText>
            </View>
            <View className='flex-1 items-center'>
              <View className='w-10 h-10 rounded-full border border-orange-500 items-center justify-center mb-1'>
                <StarIcon size={20} color='#f97316' />
              </View>
              <ThemedText
                lightColor='#4b5563'
                darkColor='#e5e7eb'
                className='text-[11px] text-center'
                style={{ fontFamily: 'Montserrat_400Regular' }}
              >
                Beneficios extra
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Aviso de verificación */}
        <View className='mb-6 border border-orange-500/80 rounded-2xl px-4 py-3 bg-white flex-row'>
          <View className='mr-3 mt-1'>
            <ExclamationTriangleIcon size={20} color='#f97316' />
          </View>
          <View className='flex-1'>
            <ThemedText
              lightColor='#f97316'
              darkColor='#f97316'
              className='text-xs font-semibold mb-1'
              style={{ fontFamily: 'Montserrat_600SemiBold' }}
            >
              Pago en verificación
            </ThemedText>
            <ThemedText
              lightColor='#4b5563'
              darkColor='#e5e7eb'
              className='text-[11px]'
              style={{ fontFamily: 'Montserrat_400Regular' }}
            >
              Tu pago está siendo verificado por nuestro equipo. Recibirás un correo de confirmación cuando sea aprobado (2-24 horas hábiles).
            </ThemedText>
          </View>
        </View>

        <View className='mb-6'>
          <PrimaryButton
            title='Ir al inicio'
            onPress={() => {
              router.push('/(tabs)/dashboard' as never);
            }}
          />
        </View>

        <View className='mb-10 px-4'>
          <ThemedText
            lightColor='#4b5563'
            darkColor='#e5e7eb'
            className='text-xs text-center'
            style={{ fontFamily: 'Montserrat_400Regular' }}
          >
            Si tienes alguna pregunta, contáctanos al (555) 123-4567 o info@Vitalfit.com
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
