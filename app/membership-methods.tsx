import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MethodsParams {
  id?: string;
  title?: string;
  price?: string;
  addonsJson?: string;
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

const PAYMENT_METHODS = [
  { id: 'pagomovil', label: 'Pago Móvil' },
  { id: 'transferencia', label: 'Transferencia Bancaria' },
] as const;

type PaymentMethodId = (typeof PAYMENT_METHODS)[number]['id'];

export default function MembershipMethodsScreen() {
  const router = useRouter();
  const rawParams = useLocalSearchParams();
  const params = rawParams as MethodsParams;

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

  const [selectedBranchIndex, setSelectedBranchIndex] = useState<number>(0);
  const selectedBranch = BRANCH_OPTIONS[selectedBranchIndex] ?? BRANCH_OPTIONS[0];
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('pagomovil');

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <ScrollView className='flex-1 px-6 pt-4 pb-8'>
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

        {/* Complementos seleccionados (solo resumen texto) */}
        {selectedAddons.length > 0 && (
          <View className='mb-4 border border-orange-500/60 rounded-2xl px-4 py-3 bg-black/90'>
            <ThemedText
              lightColor='#f97316'
              darkColor='#f97316'
              className='text-xs tracking-[0.2em] mb-2'
            >
              COMPLEMENTOS AGREGADOS
            </ThemedText>
            {selectedAddons.map(addon => (
              <ThemedText
                key={addon.id}
                lightColor='#e5e7eb'
                darkColor='#e5e7eb'
                className='text-xs mb-1'
              >
                • {addon.title}
              </ThemedText>
            ))}
          </View>
        )}

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

        {/* Selección de sucursal */}
        <View className='mt-2 mb-6'>
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

        {/* Selección de método de pago */}
        <View className='mb-4'>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='text-xs tracking-[0.2em] mb-3'
          >
            SELECCIONE EL MÉTODO DE PAGO
          </ThemedText>

          {PAYMENT_METHODS.map((method) => {
            const isActive = selectedMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                activeOpacity={0.9}
                onPress={() => setSelectedMethod(method.id)}
                className={`mb-3 rounded-2xl border px-4 py-3 flex-row items-center justify-between bg-black/90 ${
                  isActive ? 'border-orange-500' : 'border-neutral-600'
                }`}
              >
                <View className='flex-row items-center'>
                  <View
                    className={`w-4 h-4 rounded-full mr-3 border-2 ${
                      isActive ? 'border-orange-500 bg-orange-500' : 'border-neutral-400'
                    }`}
                  />
                  <ThemedText
                    lightColor='#e5e7eb'
                    darkColor='#e5e7eb'
                    className='text-sm font-semibold'
                  >
                    {method.label}
                  </ThemedText>
                </View>
                {/* Icono simple placeholder */}
                <ThemedText
                  lightColor='#f97316'
                  darkColor='#f97316'
                  className='text-lg'
                >
                  {method.id === 'pagomovil' ? '📱' : '🏦'}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        <PrimaryButton
          title='Continuar'
          onPress={() => {
            const commonParams = {
              id: params.id ?? '',
              title: params.title ?? '',
              price: params.price ?? '',
              addonsJson: params.addonsJson ?? '',
              branch: selectedBranch,
              method: selectedMethod,
            };
            if (selectedMethod === 'pagomovil') {
              router.push({
                pathname: '/membership-payment-pagomovil',
                params: commonParams,
              } as never);
            } else {
              router.push({
                pathname: '/membership-payment-transfer',
                params: commonParams,
              } as never);
            }
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
