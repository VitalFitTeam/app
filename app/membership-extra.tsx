import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { PlusIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

type Addon = {
  id: string;
  title: string;
  description: string;
  price: number;
  sessionsIncluded?: number;
};

const OPTIONAL_ADDONS: Addon[] = [
  {
    id: 'pt-4',
    title: 'Entrenamiento personal - 4 sesiones',
    description:
      'Paquete de 4 sesiones de entrenamiento personalizado con instructor certificado.',
    price: 25,
    sessionsIncluded: 4,
  },
  {
    id: 'pt-8',
    title: 'Entrenamiento personal - 8 sesiones',
    description: 'Aumenta la frecuencia de tus sesiones para acelerar resultados.',
    price: 45,
    sessionsIncluded: 8,
  },
  {
    id: 'nutrition-pack',
    title: 'Pack nutricional',
    description: 'Asesoría nutricional y plan de alimentación personalizado.',
    price: 30,
  },
];

export default function MembershipExtraScreen() {
  const params = useLocalSearchParams<{ id?: string; title?: string; price?: string }>();
  const router = useRouter();
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [addonsExpanded, setAddonsExpanded] = useState(true);

  const selectedAddons = useMemo(
    () => OPTIONAL_ADDONS.filter((a) => selectedAddonIds.includes(a.id)),
    [selectedAddonIds],
  );

  const currentStep: number = 2;

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView className='flex-1 px-6 pt-8 pb-32'>
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

        {/* Plan principal */}
        <View className='mb-6 border border-orange-500/80 rounded-2xl px-4 py-3 bg-white'>
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

        {/* Barra de complementos */}
        <View className='mb-3'>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setAddonsExpanded((prev) => !prev)}
            className='w-full flex-row items-center justify-between border border-neutral-300 rounded-md px-4 py-3 bg-white'
          >
            <ThemedText
              lightColor='#111827'
              darkColor='#e5e7eb'
              className='text-sm'
              style={{ fontFamily: 'Montserrat_400Regular' }}
            >
              Complementa tu plan (Opcional)
            </ThemedText>
            <ThemedText
              lightColor='#4b5563'
              darkColor='#e5e7eb'
              className='text-lg'
            >
              {addonsExpanded ? '▴' : '▾'}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Lista de complementos */}
        {addonsExpanded && OPTIONAL_ADDONS.map((addon) => {
          const isSelected = selectedAddonIds.includes(addon.id);
          return (
            <View
              key={addon.id}
              className='border border-orange-500/70 rounded-2xl px-4 py-3 mb-3 bg-white'
            >
              <ThemedText
                lightColor='#f97316'
                darkColor='#f97316'
                className='text-xs mb-1 uppercase'
                style={{ fontFamily: 'Montserrat_600SemiBold' }}
              >
                {addon.title}
              </ThemedText>
              <ThemedText
                lightColor='#111827'
                darkColor='#e5e7eb'
                className='text-xs mb-1'
                style={{ fontFamily: 'Montserrat_400Regular' }}
              >
                {addon.description}
              </ThemedText>
              {addon.sessionsIncluded ? (
                <ThemedText
                  lightColor='#6b7280'
                  darkColor='#9ca3af'
                  className='text-[11px] mb-2'
                  style={{ fontFamily: 'Montserrat_400Regular' }}
                >
                  {addon.sessionsIncluded} sesiones incluidas
                </ThemedText>
              ) : null}

              <View className='flex-row items-center justify-between mt-1'>
                <ThemedText
                  lightColor='#111827'
                  darkColor='#ffffff'
                  className='text-xl'
                  style={{ fontFamily: 'Montserrat_700Bold' }}
                >
                  ${addon.price.toFixed(2).replace('.', ',')}
                </ThemedText>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedAddonIds((prev) =>
                      prev.includes(addon.id)
                        ? prev.filter((id) => id !== addon.id)
                        : [...prev, addon.id],
                    );
                  }}
                  className='flex-row items-center justify-center px-5 h-11 rounded-xl bg-orange-500'
                >
                  <PlusIcon size={18} color='#ffffff' />
                  <ThemedText
                    lightColor='#ffffff'
                    darkColor='#ffffff'
                    className='text-sm ml-2'
                    style={{ fontFamily: 'Montserrat_500Medium' }}
                  >
                    {isSelected ? 'Agregado' : 'Agregar'}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <View className='mt-6 mb-16'>
          <PrimaryButton
            title='Continuar'
            onPress={() => {
              const addonsPayload = selectedAddons.map(addon => ({
                id: addon.id,
                title: addon.title,
                price: addon.price,
                sessionsIncluded: addon.sessionsIncluded,
              }));
              router.push({
                pathname: '/membership-methods',
                params: {
                  id: params.id ?? '',
                  title: params.title ?? '',
                  price: params.price ?? '',
                  addonsJson: JSON.stringify(addonsPayload),
                },
              } as never);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
