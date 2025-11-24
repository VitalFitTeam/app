import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { BuildingLibraryIcon, PhoneIcon } from 'react-native-heroicons/outline';
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
  const [showBranchOptions, setShowBranchOptions] = useState(false);
  const selectedBranch = BRANCH_OPTIONS[selectedBranchIndex] ?? BRANCH_OPTIONS[0];
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('pagomovil');

  const currentStep: number = 2;

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

        {/* Complementos seleccionados (solo resumen texto) */}
        {selectedAddons.length > 0 && (
          <View className='mb-4 border border-orange-500/60 rounded-2xl px-4 py-3 bg-white'>
            <ThemedText
              lightColor='#f97316'
              darkColor='#f97316'
              className='text-xs tracking-[0.2em] mb-2'
              style={{ fontFamily: 'Montserrat_600SemiBold' }}
            >
              COMPLEMENTOS AGREGADOS
            </ThemedText>
            {selectedAddons.map(addon => (
              <ThemedText
                key={addon.id}
                lightColor='#111827'
                darkColor='#e5e7eb'
                className='text-xs mb-1'
                style={{ fontFamily: 'Montserrat_400Regular' }}
              >
                • {addon.title}
              </ThemedText>
            ))}
          </View>
        )}

        {/* Plan principal */}
        <View className='mb-4 border border-orange-500/80 rounded-2xl px-4 py-3 bg-white'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-1 mr-2'>
              <ThemedText
                lightColor='#111827'
                darkColor='#ffffff'
                className='text-xl mb-1'
                style={{ fontFamily: 'Montserrat_400Regular' }}
              >
                {params.title ?? 'Plan seleccionado'}
              </ThemedText>
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
                ${params.price ?? '--'}
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
        </View>

        {/* Selección de sucursal */}
        <View className='mt-2 mb-6'>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='text-xs tracking-[0.2em] mb-3'
            style={{ fontFamily: 'Montserrat_600SemiBold' }}
          >
            SELECCIONE LA SUCURSAL
          </ThemedText>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowBranchOptions((prev) => !prev)}
            className='border border-orange-500 rounded-md h-12 px-3 justify-center bg-white'
          >
            <View className='flex-row items-center justify-between'>
              <ThemedText
                lightColor='#111827'
                darkColor='#e5e7eb'
                className='text-sm'
                style={{ fontFamily: 'Montserrat_400Regular' }}
              >
                {selectedBranch}
              </ThemedText>
              <ThemedText
                lightColor='#4b5563'
                darkColor='#e5e7eb'
                className='text-lg'
              >
                {showBranchOptions ? '▴' : '▾'}
              </ThemedText>
            </View>
          </TouchableOpacity>
          {showBranchOptions && (
            <View className='mt-2 border border-neutral-200 rounded-md bg-white overflow-hidden'>
              {BRANCH_OPTIONS.map((branch, index) => (
                <TouchableOpacity
                  key={branch}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedBranchIndex(index);
                    setShowBranchOptions(false);
                  }}
                  className={`px-3 py-2 ${
                    index === selectedBranchIndex ? 'bg-orange-50' : 'bg-white'
                  }`}
                >
                  <ThemedText
                    lightColor='#111827'
                    darkColor='#e5e7eb'
                    className='text-sm'
                    style={{ fontFamily: 'Montserrat_400Regular' }}
                  >
                    {branch}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Selección de método de pago */}
        <View className='mb-4'>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='text-xs tracking-[0.2em] mb-3'
            style={{ fontFamily: 'Montserrat_600SemiBold' }}
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
                className={`mb-3 rounded-2xl border px-4 py-3 flex-row items-center justify-between bg-white ${
                  isActive ? 'border-orange-500' : 'border-neutral-300'
                }`}
              >
                <View className='flex-row items-center'>
                  <View
                    className={`w-4 h-4 rounded-full mr-3 border-2 ${
                      isActive ? 'border-orange-500 bg-orange-500' : 'border-neutral-400'
                    }`}
                  />
                  <ThemedText
                    lightColor='#111827'
                    darkColor='#e5e7eb'
                    className='text-sm'
                    style={{ fontFamily: 'Montserrat_500Medium' }}
                  >
                    {method.label}
                  </ThemedText>
                </View>
                <View className='flex-row items-center'>
                  {method.id === 'pagomovil' ? (
                    <PhoneIcon size={20} color={isActive ? '#F97316' : '#6B7280'} />
                  ) : (
                    <BuildingLibraryIcon size={20} color={isActive ? '#F97316' : '#6B7280'} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className='mt-6 mb-16'>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
