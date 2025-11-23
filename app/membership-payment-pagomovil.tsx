import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import {
  MembershipPagoMovilPaymentData,
  MembershipPagoMovilPaymentSchema,
} from '@/schemas/membership';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { ExclamationTriangleIcon } from 'react-native-heroicons/outline';
import PhoneInput, { IPhoneInputRef } from 'react-native-international-phone-number';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PaymentParams {
  id?: string;
  title?: string;
  price?: string;
  addonsJson?: string;
  branch?: string;
}

interface SelectedAddon {
  id: string;
  title: string;
  price: number;
  sessionsIncluded?: number;
}

export default function MembershipPaymentPagoMovilScreen() {
  const router = useRouter();
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

  const basePrice = Number(params.price ?? '0') || 0;
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  const totalPrice = basePrice + addonsTotal;

  const {
    getValues,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<MembershipPagoMovilPaymentData>({
    defaultValues: {
      id: params.id ?? '',
      title: params.title ?? '',
      price: params.price ?? '',
      branch: params.branch ?? '',
      addonsJson: params.addonsJson ?? '',
      reference: '',
      documentNumber: '',
      phone: '',
    },
  });

  const currentStep: number = 3;

  const onConfirm = () => {
    const result = MembershipPagoMovilPaymentSchema.safeParse(getValues());

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof MembershipPagoMovilPaymentData;
        setError(field, {
          type: 'manual',
          message: issue.message,
        });
      });
      return;
    }

    const data = result.data;

    router.push({
      pathname: '/membership-confirm',
      params: {
        id: data.id,
        title: data.title,
        price: data.price,
        branch: data.branch,
        method: 'pagomovil',
        addonsJson: data.addonsJson ?? '',
      },
    } as never);
  };

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

        {/* Bloque instrucciones Pago Móvil */}
        <View className='mb-6 border border-orange-500/80 rounded-2xl px-4 py-3 bg-white'>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='text-xs tracking-[0.2em] mb-1'
          >
            REALIZA TU PAGO MÓVIL
          </ThemedText>
          <ThemedText
            lightColor='#4b5563'
            darkColor='#e5e7eb'
            className='text-xs mb-1'
            style={{ fontFamily: 'Montserrat_400Regular' }}
          >
            Realiza el pago en la siguiente cuenta de VitalFit Cabudare.
          </ThemedText>
          <ThemedText
            lightColor='#4b5563'
            darkColor='#e5e7eb'
            className='text-[11px]'
            style={{ fontFamily: 'Montserrat_400Regular' }}
          >
            Debes hacer el pago del monto exacto, de lo contrario no se creará la orden.
          </ThemedText>
        </View>

        {/* Datos fijos de cuenta */}
        <View className='mb-6'>
          <View className='flex-row mb-4'>
            <View className='flex-1 mr-2'>
              <ThemedText
                lightColor='#9ca3af'
                darkColor='#9ca3af'
                className='text-[11px] mb-1'
                style={{ fontFamily: 'Montserrat_400Regular' }}
              >
                Titular
              </ThemedText>
              <View className='h-12 px-3 rounded-md bg-white border border-orange-500 justify-center'>
                <ThemedText
                  lightColor='#111827'
                  darkColor='#e5e7eb'
                  className='text-base'
                  style={{ fontFamily: 'Montserrat_400Regular' }}
                >
                  VitalFit Cabudare
                </ThemedText>
              </View>
            </View>
            <View className='flex-1 ml-2'>
              <ThemedText
                lightColor='#9ca3af'
                darkColor='#9ca3af'
                className='text-[11px] mb-1'
                style={{ fontFamily: 'Montserrat_400Regular' }}
              >
                Banco asociado
              </ThemedText>
              <View className='h-12 px-3 rounded-md bg-white border border-orange-500 justify-center'>
                <ThemedText
                  lightColor='#111827'
                  darkColor='#e5e7eb'
                  className='text-base'
                  style={{ fontFamily: 'Montserrat_400Regular' }}
                >
                  Banco de Venezuela
                </ThemedText>
              </View>
            </View>
          </View>

          <View className='flex-row mb-4'>
            <View className='flex-1 mr-2'>
              <ThemedText
                lightColor='#9ca3af'
                darkColor='#9ca3af'
                className='text-[11px] mb-1'
                style={{ fontFamily: 'Montserrat_400Regular' }}
              >
                RIF/DNI
              </ThemedText>
              <View className='h-12 px-3 rounded-md bg-white border border-orange-500 justify-center'>
                <ThemedText
                  lightColor='#111827'
                  darkColor='#e5e7eb'
                  className='text-sm'
                  style={{ fontFamily: 'Montserrat_400Regular' }}
                >
                  J-123456789
                </ThemedText>
              </View>
            </View>
            <View className='flex-1 ml-2'>
              <ThemedText
                lightColor='#9ca3af'
                darkColor='#9ca3af'
                className='text-[11px] mb-1'
                style={{ fontFamily: 'Montserrat_400Regular' }}
              >
                Teléfono móvil
              </ThemedText>
              <View className='h-12 px-3 rounded-md bg-white border border-orange-500 justify-center'>
                <ThemedText
                  lightColor='#111827'
                  darkColor='#e5e7eb'
                  className='text-sm'
                  style={{ fontFamily: 'Montserrat_400Regular' }}
                >
                  0414-1234567
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Monto a pagar */}
        <LinearGradient
          colors={['#4F3521', '#F27F2A']}
          locations={[0.2, 0.9]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginBottom: 24,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <ThemedText
              lightColor='#ffffff'
              darkColor='#ffffff'
              className='text-xs tracking-[0.2em] mb-1'
            >
              MONTO A PAGAR
            </ThemedText>
          </View>
          <View className='items-end'>
            <ThemedText
              lightColor='#ffffff'
              darkColor='#ffffff'
              className='text-2xl'
              style={{ fontFamily: 'Montserrat_700Bold' }}
            >
              ${totalPrice.toFixed(2)}
            </ThemedText>
            <ThemedText
              lightColor='#e5e7eb'
              darkColor='#e5e7eb'
              className='text-xs mt-[-4]'
              style={{ fontFamily: 'Montserrat_500Medium' }}
            >
              /mes
            </ThemedText>
          </View>
        </LinearGradient>

        {/* Campos de referencia */}
        <View className='mb-8'>
          <ThemedText
            lightColor='#4b5563'
            darkColor='#e5e7eb'
            className='text-sm mb-2'
            style={{ fontFamily: 'Montserrat_500Medium' }}
          >
            Referencia
          </ThemedText>
          {errors.reference?.message && (
            <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
              {errors.reference.message}
            </Text>
          )}
          <View className='border border-orange-500 rounded-md h-12 px-3 justify-center bg-white mb-5'>
            <TextInput
              value={getValues('reference')}
              onChangeText={(text) => {
                setValue('reference', text, { shouldValidate: true });
                clearErrors('reference');
              }}
              placeholder='Ingrese la referencia'
              placeholderTextColor='#9CA3AF'
              className='text-black text-base'
            />
          </View>

          <ThemedText
            lightColor='#4b5563'
            darkColor='#e5e7eb'
            className='text-sm mb-2'
            style={{ fontFamily: 'Montserrat_500Medium' }}
          >
            Número de documento
          </ThemedText>
          {errors.documentNumber?.message && (
            <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
              {errors.documentNumber.message}
            </Text>
          )}
          <View className='border border-orange-500 rounded-md h-12 px-3 justify-center bg-white mb-5'>
            <TextInput
              value={getValues('documentNumber')}
              onChangeText={(text) => {
                setValue('documentNumber', text, { shouldValidate: true });
                clearErrors('documentNumber');
              }}
              placeholder='Ingrese su número de documento'
              placeholderTextColor='#9CA3AF'
              className='text-black text-base'
            />
          </View>

          <ThemedText
            lightColor='#4b5563'
            darkColor='#e5e7eb'
            className='text-sm mb-2'
            style={{ fontFamily: 'Montserrat_500Medium' }}
          >
            Teléfono
          </ThemedText>
          {errors.phone?.message && (
            <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
              {errors.phone.message}
            </Text>
          )}
          <View className='border border-orange-500 rounded-md bg-white px-2 py-1 justify-center'>
            <PhoneInput
              ref={useRef<IPhoneInputRef | null>(null)}
              value={getValues('phone') || ''}
              onChangePhoneNumber={(phoneNumber) => {
                setValue('phone', phoneNumber, { shouldValidate: true });
                clearErrors('phone');
              }}
              defaultCountry='VE'
              placeholder='Número de teléfono'
              phoneInputStyles={{
                container: {
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  height: 40,
                },
                flagContainer: {
                  backgroundColor: 'transparent',
                },
                callingCode: {
                  color: '#6b7280',
                  fontSize: 14,
                },
                input: {
                  color: '#111827',
                  fontSize: 14,
                },
                divider: {
                  backgroundColor: '#e5e7eb',
                },
              }}
            />
          </View>
        </View>

        {/* Bloque importante */}
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
              Importante
            </ThemedText>
            <ThemedText
              lightColor='#4b5563'
              darkColor='#e5e7eb'
              className='text-[11px]'
              style={{ fontFamily: 'Montserrat_400Regular' }}
            >
              Asegúrate de incluir el monto exacto. Guarda el comprobante de la transacción.
            </ThemedText>
          </View>
        </View>

        <View className='mb-16'>
          <PrimaryButton
            title='Confirmar pago'
            onPress={onConfirm}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
