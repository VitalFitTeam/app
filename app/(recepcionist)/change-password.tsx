import { PrimaryButton } from '@/components/PrimaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ToastNotification } from '@/components/ToastNotification';
import { ThemedView } from '@/components/themed-view';
import { useToast } from '@/hooks/useToast';
import vitalFitApi from '@/services';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon, ShieldCheckIcon } from 'react-native-heroicons/solid';
import { z } from 'zod';

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Ingresa tu contraseña actual.'),
    newPassword: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula.')
      .regex(/[a-z]/, 'Debe contener al menos una minúscula.')
      .regex(/[0-9]/, 'Debe contener al menos un número.')
      .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un caracter especial.'),
    confirmPassword: z.string(),
  })
 
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  })
  
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'La nueva contraseña no puede ser igual a la actual.',
    path: ['newPassword'],
  });

type FormData = z.infer<typeof ChangePasswordSchema>;

export default function RecepcionistChangePasswordScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toastState, showToast, hideToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setErrorMessage('No se encontró sesión activa');
        return;
      }

      await vitalFitApi.user.UpgradePassword(
        token,
        data.currentPassword,
        data.newPassword,
        data.confirmPassword
      );

      showToast('success', 'Contraseña actualizada', 'La contraseña se guardó correctamente');
      
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error: unknown) {
      console.log('Error al cambiar password:', error);

      let message = 'Ocurrió un error al cambiar la contraseña.';

      if (isAPIError(error)) {
        if (error.status === 401) {
          message = 'La contraseña actual es incorrecta.';
        } else if (error.messages && error.messages.length > 0) {
          message = error.messages.join(', ');
        } else if (error.message && error.message !== 'Ocurrió un error inesperado') {
          message = error.message;
        } else {
          message = 'Verifique su contraseña actual e intente nuevamente.';
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      setErrorMessage(message);
      showToast('error', 'Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView className='flex-1 bg-white pt-10'>
      <ToastNotification
        visible={toastState.visible}
        type={toastState.type}
        title={toastState.title}
        message={toastState.message}
        onClose={hideToast}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96 }}>
          <View
            className='w-full bg-[#F3F4F6] rounded-2xl py-2 mb-3 items-center justify-center'
            style={{ position: 'relative' }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              style={{ position: 'absolute', left: 12, top: 8, bottom: 8, justifyContent: 'center' }}>
              <ChevronLeftIcon width={20} height={20} color='#f97316' />
            </TouchableOpacity>

            <Text className='font-heading' style={{ color: '#111827', fontSize: 16, fontWeight: '600' }}>
              Cambiar contraseña
            </Text>
          </View>

          <View className='mb-4 flex-row items-center'>
            <View className='w-9 h-9 rounded-full bg-[#F3F4F6] items-center justify-center mr-3'>
              <ShieldCheckIcon width={20} height={20} color='#111827' />
            </View>
            <View className='flex-1'>
              <Text className='font-body text-[15px] font-semibold text-[#111827]'>Seguridad de la cuenta</Text>
              <Text className='font-body text-[12px] text-[#6b7280]'>Actualiza tu contraseña de acceso</Text>
            </View>
          </View>

          {errorMessage && (
            <View
              style={{
                backgroundColor: '#FEF2F2',
                borderRadius: 10,
                paddingVertical: 8,
                paddingHorizontal: 10,
                marginBottom: 12,
              }}>
              <Text className='font-body' style={{ color: '#B91C1C', fontSize: 12 }}>{errorMessage}</Text>
            </View>
          )}

          <View>
            <Controller
              control={control}
              name='currentPassword'
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledTextInput
                  label='Contraseña actual'
                  isPasswordInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder='Ingresa tu contraseña actual'
                  error={errors.currentPassword?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='newPassword'
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledTextInput
                  label='Nueva contraseña'
                  isPasswordInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder='Ingresa tu nueva contraseña'
                  error={errors.newPassword?.message}
                />
              )}
            />

            <Controller
              control={control}
              name='confirmPassword'
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledTextInput
                  label='Confirmar contraseña'
                  isPasswordInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder='Repite tu nueva contraseña'
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <PrimaryButton
              title={isLoading ? 'Guardando...' : 'Guardar cambios'}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              style={{ marginTop: 12 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
