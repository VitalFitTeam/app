import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import {
  MembershipTransferPaymentData,
  MembershipTransferPaymentSchema,
} from '@/schemas/membership';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, TextInput, View } from 'react-native';
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

export default function MembershipPaymentTransferScreen() {
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

  const [reference, setReference] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');
  const phoneInputRef = useRef<IPhoneInputRef | null>(null);

  const {
    getValues,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<MembershipTransferPaymentData>({
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

  const onConfirm = () => {
    const result = MembershipTransferPaymentSchema.safeParse(getValues());

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof MembershipTransferPaymentData;
        setError(field, {
          type: 'manual',
          message: issue.message,
        });
      });
      return;
    }

    // Si todo es válido, navegamos a la confirmación
    const data = result.data;

    router.push({
      pathname: '/membership-confirm',
      params: {
        id: data.id,
        title: data.title,
        price: data.price,
        branch: data.branch,
        method: 'transferencia',
      },
    } as never);
  };

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

        {/* Bloque instrucciones Transferencia */}
        <View className='mb-6 border border-orange-500/80 rounded-2xl px-4 py-3 bg-orange-500/10'>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='text-xs tracking-[0.2em] mb-1'
          >
            REALIZA TU TRANSFERENCIA BANCARIA
          </ThemedText>
          <ThemedText
            lightColor='#e5e7eb'
            darkColor='#e5e7eb'
            className='text-xs mb-1'
          >
            Realiza la transferencia a la siguiente cuenta de VitalFit Cabudare.
          </ThemedText>
          <ThemedText
            lightColor='#e5e7eb'
            darkColor='#e5e7eb'
            className='text-[11px]'
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
              >
                Titular
              </ThemedText>
              <View className='h-14 px-3 rounded-md bg-neutral-900 justify-center border border-neutral-700'>
                <ThemedText
                  lightColor='#e5e7eb'
                  darkColor='#e5e7eb'
                  className='text-base'
                >
                  VitalFit Cabudare C.A
                </ThemedText>
              </View>
            </View>
            <View className='flex-1 ml-2'>
              <ThemedText
                lightColor='#9ca3af'
                darkColor='#9ca3af'
                className='text-[11px] mb-1'
              >
                Banco asociado
              </ThemedText>
              <View className='h-14 px-3 rounded-md bg-neutral-900 justify-center border border-neutral-700'>
                <ThemedText
                  lightColor='#e5e7eb'
                  darkColor='#e5e7eb'
                  className='text-base'
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
              >
                Documento fiscal / cédula
              </ThemedText>
              <View className='h-10 px-3 rounded-md bg-neutral-900 justify-center border border-neutral-700'>
                <ThemedText
                  lightColor='#e5e7eb'
                  darkColor='#e5e7eb'
                  className='text-xs'
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
              >
                Número de cuenta
              </ThemedText>
              <View className='h-12 px-3 rounded-md bg-neutral-900 justify-center border border-neutral-700'>
                <ThemedText
                  lightColor='#e5e7eb'
                  darkColor='#e5e7eb'
                  className='text-sm'
                >
                  0108-0000-0000000000
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Monto a pagar */}
        <View className='mb-6 border border-orange-500/80 rounded-2xl px-4 py-3 bg-black/90 flex-row items-baseline justify-between'>
          <View>
            <ThemedText
              lightColor='#f97316'
              darkColor='#f97316'
              className='text-xs tracking-[0.2em] mb-1'
            >
              MONTO A PAGAR
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

        {/* Campos de referencia */}
        <View className='mb-8'>
          <ThemedText
            lightColor='#e5e7eb'
            darkColor='#e5e7eb'
            className='text-sm mb-2'
          >
            Referencia
          </ThemedText>
          {errors.reference?.message && (
            <ThemedText
              lightColor='#ef4444'
              darkColor='#ef4444'
              className='text-xs mb-1'
            >
              {errors.reference.message}
            </ThemedText>
          )}
          <View className='border border-neutral-700 rounded-md h-12 px-3 justify-center bg-neutral-900 mb-5'>
            <TextInput
              value={reference}
              onChangeText={(text) => {
                setReference(text);
                setValue('reference', text, { shouldValidate: true });
                clearErrors('reference');
              }}
              placeholder='Ingrese la referencia'
              placeholderTextColor='#6B7280'
              className='text-white text-base'
            />
          </View>

          <ThemedText
            lightColor='#e5e7eb'
            darkColor='#e5e7eb'
            className='text-sm mb-2'
          >
            Número de documento
          </ThemedText>
          {errors.documentNumber?.message && (
            <ThemedText
              lightColor='#ef4444'
              darkColor='#ef4444'
              className='text-xs mb-1'
            >
              {errors.documentNumber.message}
            </ThemedText>
          )}
          <View className='border border-neutral-700 rounded-md h-12 px-3 justify-center bg-neutral-900 mb-5'>
            <TextInput
              value={documentNumber}
              onChangeText={(text) => {
                setDocumentNumber(text);
                setValue('documentNumber', text, { shouldValidate: true });
                clearErrors('documentNumber');
              }}
              placeholder='Ingrese su número de documento'
              placeholderTextColor='#6B7280'
              className='text-white text-base'
            />
          </View>

          <ThemedText
            lightColor='#e5e7eb'
            darkColor='#e5e7eb'
            className='text-sm mb-2'
          >
            Teléfono
          </ThemedText>
          {errors.phone?.message && (
            <ThemedText
              lightColor='#ef4444'
              darkColor='#ef4444'
              className='text-xs mb-1'
            >
              {errors.phone.message}
            </ThemedText>
          )}
          <View className='border border-neutral-700 rounded-md bg-neutral-900 px-2 py-1 justify-center'>
            <PhoneInput
              ref={phoneInputRef}
              value={phone || ''}
              onChangePhoneNumber={(phoneNumber) => {
                setPhone(phoneNumber);
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
                  color: '#e5e7eb',
                  fontSize: 14,
                },
                input: {
                  color: '#ffffff',
                  fontSize: 14,
                },
                divider: {
                  backgroundColor: '#374151',
                },
              }}
            />
          </View>
        </View>

        {/* Bloque importante */}
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
              Importante
            </ThemedText>
            <ThemedText
              lightColor='#e5e7eb'
              darkColor='#e5e7eb'
              className='text-[11px]'
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
