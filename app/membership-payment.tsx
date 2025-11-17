import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Tipos de datos que recibimos desde membership-extra
interface PaymentParams {
  id?: string;
  title?: string;
  price?: string;
  addonsJson?: string; // JSON string con los complementos seleccionados
  branch?: string;
  method?: string;
}

interface SelectedAddon {
  id: string;
  title: string;
  price: number;
  sessionsIncluded?: number;
}

const BRANCH_OPTIONS = [
  'VitalFit Centro',
  'VitalFit Este',
  'VitalFit Oeste',
  'VitalFit Norte',
];

export default function MembershipPaymentScreen() {
  const rawParams = useLocalSearchParams();
  const params = rawParams as PaymentParams;

  const selectedAddons: SelectedAddon[] = useMemo(() => {
    if (!params.addonsJson) return [];
    try {
      const parsed = JSON.parse(params.addonsJson as string);
      if (Array.isArray(parsed)) return parsed as SelectedAddon[];
      return [];
    } catch {
      return [];
    }
  }, [params.addonsJson]);

  const initialBranchIndex = Math.max(
    0,
    BRANCH_OPTIONS.findIndex(option => option === params.branch) ?? 0,
  );
  const [selectedBranchIndex, setSelectedBranchIndex] = useState<number>(
    initialBranchIndex,
  );
  const selectedBranch = BRANCH_OPTIONS[selectedBranchIndex] ?? BRANCH_OPTIONS[0];

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <ScrollView className='flex-1 px-6 pt-4 pb-8'>
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
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 bg-orange-500'>
                <ThemedText
                  lightColor='#ffffff'
                  darkColor='#ffffff'
                  className='text-xs font-semibold'
                >
                  2
                </ThemedText>
              </View>
              <ThemedText
                lightColor='#f97316'
                darkColor='#f97316'
                className='text-xs text-center'
              >
                Métodos de pago
              </ThemedText>
            </View>
            <View className='items-center flex-1'>
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 bg-white'>
                <ThemedText
                  lightColor='#000000'
                  darkColor='#000000'
                  className='text-xs font-semibold'
                >
                  3
                </ThemedText>
              </View>
              <ThemedText
                lightColor='#ffffff'
                darkColor='#ffffff'
                className='text-xs text-center'
              >
                Confirmación de compra
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Plan principal */}
        <View className='mb-4 border border-orange-500/80 rounded-2xl px-4 py-3 bg-black/90'>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='text-xs tracking-[0.2em] mb-1'
          >
            SUSCRIPCIÓN
          </ThemedText>
          <View className='flex-row items-baseline justify-between'>
            <View className='flex-1 mr-2'>
              <ThemedText
                lightColor='#ffffff'
                darkColor='#ffffff'
                className='text-xl font-extrabold mb-1'
              >
                {params.title ?? 'Plan seleccionado'}
              </ThemedText>
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
                ${params.price ?? '--'}
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
        </View>

        {/* Complementos seleccionados (si hay) */}
        {selectedAddons.map((addon) => (
          <View
            key={addon.id}
            className='mb-4 border border-orange-500/80 rounded-2xl px-4 py-3 bg-black/90'
          >
            <ThemedText
              lightColor='#f97316'
              darkColor='#f97316'
              className='text-xs tracking-[0.2em] mb-1'
            >
              SERVICIO ADICIONAL
            </ThemedText>
            <View className='flex-row items-baseline justify-between'>
              <View className='flex-1 mr-2'>
                <ThemedText
                  lightColor='#ffffff'
                  darkColor='#ffffff'
                  className='text-sm font-extrabold mb-1 uppercase'
                >
                  {addon.title}
                </ThemedText>
                {addon.sessionsIncluded ? (
                  <ThemedText
                    lightColor='#d1d5db'
                    darkColor='#d1d5db'
                    className='text-xs'
                  >
                    {addon.sessionsIncluded} sesiones incluidas
                  </ThemedText>
                ) : null}
              </View>
              <View className='items-end'>
                <ThemedText
                  lightColor='#ffffff'
                  darkColor='#ffffff'
                  className='text-2xl font-extrabold'
                >
                  ${addon.price.toFixed(2)}
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
          </View>
        ))}

        {/* Selección de sucursal */}
        <View className='mt-2 mb-8'>
          <ThemedText
            lightColor='#e5e7eb'
            darkColor='#e5e7eb'
            className='text-sm mb-2'
          >
            Seleccionar sucursal
          </ThemedText>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setSelectedBranchIndex((prev) => (prev + 1) % BRANCH_OPTIONS.length);
            }}
            className='border border-neutral-700 rounded-md h-12 px-3 justify-center bg-neutral-900'
          >
            <View className='flex-row items-center justify-between'>
              <ThemedText
                lightColor='#e5e7eb'
                darkColor='#e5e7eb'
                className='text-sm'
              >
                {selectedBranch}
              </ThemedText>
              <ThemedText
                lightColor='#e5e7eb'
                darkColor='#e5e7eb'
                className='text-lg'
              >
                ▾
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        <PrimaryButton
          title='Continuar'
          onPress={() => {
            // Aquí luego navegaremos a la pantalla de confirmación de compra
            console.log('Sucursal seleccionada:', selectedBranch);
            console.log('Plan:', params, 'Addons seleccionados:', selectedAddons);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
