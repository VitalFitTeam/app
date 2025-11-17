import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
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

  return (
    <SafeAreaView className='flex-1 bg-black'>
      <ScrollView className='flex-1 px-6 pt-8 pb-32'>
        <View className='mb-6'>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='text-2xl font-extrabold text-orange-400 mb-4 text-center'
          >
            COMPRAR MEMBRESÍA
          </ThemedText>

          <View className='flex-row justify-between items-center mb-4'>
            <View className='items-center flex-1'>
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 bg-orange-500'>
                <ThemedText
                  lightColor='#ffffff'
                  darkColor='#ffffff'
                  className='text-xs font-semibold text-white'
                >
                  1
                </ThemedText>
              </View>
              <ThemedText
                lightColor='#f97316'
                darkColor='#f97316'
                className='text-xs text-center text-orange-400'
              >
                Opciones de producto
              </ThemedText>
            </View>
            <View className='items-center flex-1'>
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 bg-white'>
                <ThemedText
                  lightColor='#000000'
                  darkColor='#000000'
                  className='text-xs font-semibold text-black'
                >
                  2
                </ThemedText>
              </View>
              <ThemedText
                lightColor='#ffffff'
                darkColor='#ffffff'
                className='text-xs text-white text-center'
              >
                Métodos de pago
              </ThemedText>
            </View>
            <View className='items-center flex-1'>
              <View className='w-8 h-8 rounded-full items-center justify-center mb-1 bg-white'>
                <ThemedText
                  lightColor='#000000'
                  darkColor='#000000'
                  className='text-xs font-semibold text-black'
                >
                  3
                </ThemedText>
              </View>
              <ThemedText
                lightColor='#ffffff'
                darkColor='#ffffff'
                className='text-xs text-white text-center'
              >
                Confirmación de compra
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Plan principal */}
        <View className='mb-6 border border-orange-500/80 rounded-2xl px-4 py-3 bg-black/90'>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='text-xs tracking-[0.2em] text-orange-400 mb-1'
          >
            SUSCRIPCIÓN
          </ThemedText>
          <View className='flex-row items-baseline justify-between'>
            <View className='flex-1 mr-2'>
              <ThemedText
                lightColor='#ffffff'
                darkColor='#ffffff'
                className='text-xl font-extrabold text-white mb-1'
              >
                {params.title ?? 'Plan seleccionado'}
              </ThemedText>
              <ThemedText
                lightColor='#d1d5db'
                darkColor='#d1d5db'
                className='text-xs text-neutral-300'
              >
                Más beneficios para tu vida fitness
              </ThemedText>
            </View>
            <View className='items-end'>
              <ThemedText
                lightColor='#ffffff'
                darkColor='#ffffff'
                className='text-2xl font-extrabold text-white'
              >
                ${params.price ?? '--'}
              </ThemedText>
              <ThemedText
                lightColor='#d1d5db'
                darkColor='#d1d5db'
                className='text-xs text-neutral-300 mt-[-4]'
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
            className='w-full flex-row items-center justify-between border border-neutral-600 rounded-md px-4 py-3 bg-black'
          >
            <ThemedText
              lightColor='#e5e7eb'
              darkColor='#e5e7eb'
              className='text-sm text-neutral-100'
            >
              Complementa tu plan (Opcional)
            </ThemedText>
            <ThemedText
              lightColor='#e5e7eb'
              darkColor='#e5e7eb'
              className='text-lg text-neutral-100'
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
              className='border border-orange-500/70 rounded-2xl px-4 py-3 mb-3 bg-black/90'
            >
              <ThemedText
                lightColor='#f97316'
                darkColor='#f97316'
                className='text-xs font-semibold text-orange-400 mb-1 uppercase'
              >
                {addon.title}
              </ThemedText>
              <ThemedText
                lightColor='#e5e7eb'
                darkColor='#e5e7eb'
                className='text-xs text-neutral-200 mb-1'
              >
                {addon.description}
              </ThemedText>
              {addon.sessionsIncluded ? (
                <ThemedText
                  lightColor='#9ca3af'
                  darkColor='#9ca3af'
                  className='text-[11px] text-neutral-400 mb-2'
                >
                  {addon.sessionsIncluded} sesiones incluidas
                </ThemedText>
              ) : null}

              <View className='flex-row items-center justify-between mt-1'>
                <ThemedText
                  lightColor='#ffffff'
                  darkColor='#ffffff'
                  className='text-xl font-extrabold text-white'
                >
                  ${addon.price.toFixed(2)}
                </ThemedText>
                <View className='w-32'>
                  <PrimaryButton
                    title={isSelected ? 'Agregado' : 'Agregar'}
                    onPress={() => {
                      setSelectedAddonIds((prev) =>
                        prev.includes(addon.id)
                          ? prev.filter((id) => id !== addon.id)
                          : [...prev, addon.id],
                      );
                    }}
                  />
                </View>
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
