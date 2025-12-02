import { PrimaryButton } from '@/components/PrimaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedText } from '@/components/themed-text';
import { MembershipCheckoutData, MembershipCheckoutSchema } from '@/schemas/membership';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CheckCircleIcon, TrashIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';

// Interfaces locales para manejar respuestas del SDK
interface BranchLike {
  branch_id?: string;
  id?: string;
  branch_map_id?: string;
}

const PLAN_BENEFITS: Record<string, string[]> = {
  'free-trial': ['Acceso limitado al gimnasio', '7 días de acceso libre'],
  advanced: [
    'Acceso ilimitado al gimnasio',
    '7 sesiones con consultor fitness',
    'Seguimiento nutricional',
    '5 suplementos gratis',
    'Credencial de gimnasio',
    'Entrenador personal',
  ],
  athlete: [
    'Acceso total al gimnasio',
    'Plan de entrenamiento personalizado',
    'Seguimiento de progreso mensual',
  ],
  premium: [
    'Todos los beneficios del plan Avanzado',
    'Sesiones ilimitadas con consultor fitness',
    'Plan nutricional avanzado',
  ],
};

export default function MembershipCheckoutScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    price?: string;
    period?: string;
    type?: string;
  }>();
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    getValues,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<MembershipCheckoutData>({
    defaultValues: {
      startDate: '',
    },
  });

  const onContinue = async () => {
    // 1. Validar el formulario (Fecha de inicio)
    const result = MembershipCheckoutSchema.safeParse(getValues());

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof MembershipCheckoutData;
        setError(field, {
          type: 'manual',
          message: issue.message,
        });
      });
      return;
    }

    if (!params.id || !params.title || !params.price) {
      Alert.alert('Error', 'Faltan datos del plan seleccionado.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        return;
      }

      // 2. Obtener datos necesarios (Usuario y Sucursal)
      const [userResponse, branchesResponse] = await Promise.all([
        vitalFitApi.user.WhoAmI(token),
        vitalFitApi.public.getBranchMap(token),
      ]);

      const userId = userResponse.user?.user_id;
      const firstBranch = branchesResponse.data?.[0];

      // Normalizar objeto de sucursal
      const branchObj = firstBranch as unknown as BranchLike;
      const branchId = branchObj?.branch_id || branchObj?.id || branchObj?.branch_map_id;

      if (!userId) {
        throw new Error('No se pudo identificar al usuario.');
      }
      if (!branchId) {
        throw new Error('No se encontró una sucursal disponible para asignar la factura.');
      }

      // 3. CAMBIO IMPORTANTE: NO CREAMOS LA FACTURA AQUÍ.
      // Pasamos los datos a la pantalla de Extras para crearla allá junto con los paquetes.
      router.push({
        pathname: '/membership-extra',
        params: {
          // Datos del ítem principal (Membresía o Servicio)
          mainItemId: params.id,
          mainItemTitle: params.title,
          mainItemPrice: params.price,
          mainItemType: params.type || 'membership', // Default a 'membership'
          startDate: result.data.startDate,
          
          // Datos de contexto para crear la factura luego
          userId: userId,
          branchId: branchId,
        },
      } as never);

    } catch (error) {
      console.error('Error en checkout:', error);
      const msg = error instanceof Error ? error.message : 'Inténtalo de nuevo.';
      Alert.alert('No se pudo continuar', msg);
    } finally {
      setLoading(false);
    }
  };

  const benefits = useMemo(() => {
    if (!params.id) return [];
    return PLAN_BENEFITS[params.id] ?? [];
  }, [params.id]);

  const currentStep: number = 1;

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView className='flex-1 px-6 pt-8 pb-32'>
        <View className='mb-6'>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='text-4xl mb-4 text-center'
            style={{ fontFamily: 'BebasNeue-Regular' }}>
            COMPRAR MEMBRESÍA
          </ThemedText>
          
          {/* Indicador de Pasos Visuales */}
          <View className='flex-row justify-between items-center mb-4'>
            <View className='items-center flex-1'>
              <View
                className={`w-8 h-8 rounded-full items-center justify-center mb-1 border ${
                  currentStep === 1
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-white border-neutral-400'
                }`}>
                <ThemedText
                  lightColor={currentStep === 1 ? '#ffffff' : '#111827'}
                  darkColor={currentStep === 1 ? '#ffffff' : '#111827'}
                  className='text-[10px] font-semibold'
                  style={{ fontFamily: 'Montserrat_500Medium' }}>
                  1
                </ThemedText>
              </View>
              <ThemedText
                lightColor={currentStep === 1 ? '#f97316' : '#111827'}
                darkColor={currentStep === 1 ? '#f97316' : '#111827'}
                className='text-[11px] text-center'
                style={{ fontFamily: 'Montserrat_500Medium' }}>
                Opciones
              </ThemedText>
            </View>
            <View className='items-center flex-1'>
              <View
                className={`w-8 h-8 rounded-full items-center justify-center mb-1 border ${
                  currentStep === 2
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-white border-neutral-400'
                }`}>
                <ThemedText
                  lightColor={currentStep === 2 ? '#ffffff' : '#111827'}
                  darkColor={currentStep === 2 ? '#ffffff' : '#111827'}
                  className='text-[10px] font-semibold'
                  style={{ fontFamily: 'Montserrat_500Medium' }}>
                  2
                </ThemedText>
              </View>
              <ThemedText
                lightColor={currentStep === 2 ? '#f97316' : '#111827'}
                darkColor={currentStep === 2 ? '#f97316' : '#111827'}
                className='text-[11px] text-center'
                style={{ fontFamily: 'Montserrat_500Medium' }}>
                Extras
              </ThemedText>
            </View>
            <View className='items-center flex-1'>
              <View
                className={`w-8 h-8 rounded-full items-center justify-center mb-1 border ${
                  currentStep === 3
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-white border-neutral-400'
                }`}>
                <ThemedText
                  lightColor={currentStep === 3 ? '#ffffff' : '#111827'}
                  darkColor={currentStep === 3 ? '#ffffff' : '#111827'}
                  className='text-[10px] font-semibold'
                  style={{ fontFamily: 'Montserrat_500Medium' }}>
                  3
                </ThemedText>
              </View>
              <ThemedText
                lightColor={currentStep === 3 ? '#f97316' : '#111827'}
                darkColor={currentStep === 3 ? '#f97316' : '#111827'}
                className='text-[11px] text-center'
                style={{ fontFamily: 'Montserrat_500Medium' }}>
                Confirmación
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Resumen del Plan Seleccionado */}
        <View className='mb-6'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-1 mr-2'>
              <ThemedText
                lightColor='#111827'
                darkColor='#ffffff'
                className='text-xl mb-1'
                style={{ fontFamily: 'Montserrat_400Regular' }}>
                {params.title ?? 'Plan seleccionado'}
              </ThemedText>
              <ThemedText
                lightColor='#4b5563'
                darkColor='#d1d5db'
                className='text-xs'
                style={{ fontFamily: 'Montserrat_400Regular' }}>
                Más beneficios para tu vida fitness
              </ThemedText>
            </View>
            <View className='flex-row items-center'>
              <View className='items-end mr-3'>
                <ThemedText
                  lightColor='#111827'
                  darkColor='#ffffff'
                  className='text-2xl'
                  style={{ fontFamily: 'Montserrat_700Bold' }}>
                  ${params.price ?? '--'}
                </ThemedText>
                <ThemedText
                  lightColor='#4b5563'
                  darkColor='#d1d5db'
                  className='text-xs mt-[-4]'
                  style={{ fontFamily: 'Montserrat_500Medium' }}>
                  {params.period ?? ''}
                </ThemedText>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.back()}
                className='p-1'>
                <TrashIcon size={18} color='#111827' />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Lista de Beneficios */}
        <View className='mb-6'>
          {benefits.map((benefit) => (
            <View key={benefit} className='flex-row items-center mb-3'>
              <CheckCircleIcon size={18} color='#F97316' />
              <ThemedText
                lightColor='#111827'
                darkColor='#e5e7eb'
                className='text-sm ml-2'
                style={{ fontFamily: 'Montserrat_400Regular' }}>
                {benefit}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Selector de Fecha */}
        <View className='mb-8'>
          <ThemedText
            lightColor='#111827'
            darkColor='#e5e7eb'
            className='text-sm mb-2'
            style={{ fontFamily: 'Montserrat_500Medium' }}>
            Fecha de inicio
          </ThemedText>
          {errors.startDate?.message && (
            <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
              {errors.startDate.message}
            </Text>
          )}
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowDatePicker(true)}
              style={{ position: 'relative' }}>
              <StyledTextInput
                label={undefined}
                value={
                  getValues('startDate')
                    ? format(new Date(getValues('startDate')), 'yyyy-MM-dd')
                    : ''
                }
                editable={false}
                pointerEvents='none'
              />
              <View style={{ position: 'absolute', right: 12, bottom: 12 }}>
                <Calendar size={20} color='#111827' />
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={getValues('startDate') ? new Date(getValues('startDate')) : new Date()}
                mode='date'
                display='default'
                minimumDate={new Date()}
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setValue('startDate', selectedDate.toISOString(), { shouldValidate: true });
                    clearErrors('startDate');
                  }
                }}
              />
            )}
          </View>
        </View>

        <View className='mb-16'>
          {loading ? (
            <ActivityIndicator size='large' color='#f97316' />
          ) : (
            <PrimaryButton title='Continuar' onPress={onContinue} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}