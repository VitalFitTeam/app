import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
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

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <ScrollView className='flex-1 px-6 pt-8 pb-32'>
        {/* Header y pasos */}
        <View className='mb-6'>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='text-2xl font-extrabold mb-4 text-center'
          >
            COMPRAR MEMBRESÍA
          </ThemedText>

          <View className='flex-row justify-between items-center mb-4'>
            <View className='items-center flex-1'>
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 bg-white'>
                <ThemedText
                  lightColor='#000000'
                  darkColor='#000000'
                  className='text-xs font-semibold'
                >
                  1
                </ThemedText>
              </View>
              <ThemedText
                lightColor='#ffffff'
                darkColor='#ffffff'
                className='text-xs text-center'
              >
                Opciones de producto
              </ThemedText>
            </View>
            <View className='items-center flex-1'>
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 bg-white'>
                <ThemedText
                  lightColor='#000000'
                  darkColor='#000000'
                  className='text-xs font-semibold'
                >
                  2
                </ThemedText>
              </View>
              <ThemedText
                lightColor='#ffffff'
                darkColor='#ffffff'
                className='text-xs text-center'
              >
                Métodos de pago
              </ThemedText>
            </View>
            <View className='items-center flex-1'>
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 bg-orange-500'>
                <ThemedText
                  lightColor='#ffffff'
                  darkColor='#ffffff'
                  className='text-xs font-semibold'
                >
                  3
                </ThemedText>
              </View>
              <ThemedText
                lightColor='#f97316'
                darkColor='#f97316'
                className='text-xs text-center'
              >
                Confirmación de compra
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Complementos seleccionados */}
        {addons.length > 0 && (
          <View className='mb-6 border border-orange-500/60 rounded-2xl px-4 py-3 bg-black/90'>
            <ThemedText
              lightColor='#f97316'
              darkColor='#f97316'
              className='text-xs tracking-[0.2em] mb-2'
            >
              COMPLEMENTOS AGREGADOS
            </ThemedText>
            {addons.map(addon => (
              <View key={addon.id} className='flex-row items-baseline justify-between mb-1'>
                <ThemedText
                  lightColor='#e5e7eb'
                  darkColor='#e5e7eb'
                  className='text-xs flex-1 mr-2'
                >
                  {addon.title}
                </ThemedText>
                <ThemedText
                  lightColor='#ffffff'
                  darkColor='#ffffff'
                  className='text-xs font-semibold'
                >
                  ${addon.price.toFixed(2)}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        {/* Icono y mensaje de éxito */}
        <View className='items-center mb-6'>
          <View className='w-16 h-16 rounded-2xl bg-orange-500 items-center justify-center mb-3'>
            <CheckCircleIcon size={40} color='#ffffff' />
          </View>
          <ThemedText
            lightColor='#ffffff'
            darkColor='#ffffff'
            className='text-lg font-extrabold mb-1'
          >
            ¡Compra registrada!
          </ThemedText>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='text-xs text-center'
          >
            Tu compra ha sido registrada y está en proceso de verificación.
          </ThemedText>
        </View>

        {/* Tarjeta de suscripción */}
        <View className='mb-6 border border-orange-500/80 rounded-2xl px-4 py-3 bg-black/90'>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='text-xs tracking-[0.2em] mb-1'
          >
            {params.title ? params.title.toUpperCase() : 'SUSCRIPCIÓN'}
          </ThemedText>
          <View className='flex-row items-baseline justify-between mb-3'>
            <View className='flex-1 mr-2'>
              <ThemedText
                lightColor='#d1d5db'
                darkColor='#d1d5db'
                className='text-xs'
              >
                Más beneficios para tu vida fitness
              </ThemedText>
            </View>
            <View className='items-end'>
              <ThemedText
                lightColor='#ffffff'
                darkColor='#ffffff'
                className='text-2xl font-extrabold'
              >
                ${totalPrice.toFixed(2)}
              </ThemedText>
              <ThemedText
                lightColor='#d1d5db'
                darkColor='#d1d5db'
                className='text-xs mt-[-4]'
              >
                /mes
              </ThemedText>
            </View>
          </View>

          {/* Resumen simple de beneficios (placeholders) */}
          <View className='flex-row justify-between'>
            <View className='flex-1 items-center'>
              <ThemedText
                lightColor='#f97316'
                darkColor='#f97316'
                className='text-2xl mb-1'
              >
                🏅
              </ThemedText>
              <ThemedText
                lightColor='#e5e7eb'
                darkColor='#e5e7eb'
                className='text-[11px] text-center'
              >
                Válida 30 días
              </ThemedText>
            </View>
            <View className='flex-1 items-center'>
              <ThemedText
                lightColor='#f97316'
                darkColor='#f97316'
                className='text-2xl mb-1'
              >
                🎯
              </ThemedText>
              <ThemedText
                lightColor='#e5e7eb'
                darkColor='#e5e7eb'
                className='text-[11px] text-center'
              >
                Acceso ilimitado
              </ThemedText>
            </View>
            <View className='flex-1 items-center'>
              <ThemedText
                lightColor='#f97316'
                darkColor='#f97316'
                className='text-2xl mb-1'
              >
                ⭐
              </ThemedText>
              <ThemedText
                lightColor='#e5e7eb'
                darkColor='#e5e7eb'
                className='text-[11px] text-center'
              >
                Beneficios extra
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Aviso de verificación */}
        <View className='mb-6 border border-orange-500/80 rounded-2xl px-4 py-3 bg-orange-500/10 flex-row'>
          <View className='mr-3 mt-1'>
            <ThemedText
              lightColor='#f97316'
              darkColor='#f97316'
              className='text-lg'
            >
              !
            </ThemedText>
          </View>
          <View className='flex-1'>
            <ThemedText
              lightColor='#f97316'
              darkColor='#f97316'
              className='text-xs font-semibold mb-1'
            >
              Pago en verificación
            </ThemedText>
            <ThemedText
              lightColor='#e5e7eb'
              darkColor='#e5e7eb'
              className='text-[11px]'
            >
              Tu pago está siendo verificado por nuestro equipo. Recibirás un correo de confirmación cuando sea aprobado (2-24 horas hábiles).
            </ThemedText>
          </View>
        </View>

        <View className='mb-16'>
          <PrimaryButton
            title='Ir al inicio'
            onPress={() => {
              router.push('/(tabs)/dashboard' as never);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
