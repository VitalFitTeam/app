import { PrimaryButton } from '@/components/PrimaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon, ShieldCheckIcon } from 'react-native-heroicons/solid';

import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';


export default function InstructorChangePasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleValidateCurrent = async () => {
    if (!currentPassword) {
      setErrorMessage('Ingresa tu contraseña actual.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage('Completa todos los campos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No se encontró sesión activa');

      await vitalFitApi.user.UpgradePassword(
        token,
        currentPassword,
        newPassword,
        confirmPassword
      );

      Alert.alert('Éxito', 'Contraseña actualizada correctamente', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: unknown) {
      let message = 'Ocurrió un error al cambiar la contraseña.';
      
      if (isAPIError(error)) {
        if (error.status === 401) {
          message = 'La contraseña actual es incorrecta.';
        } else if (error.messages && error.messages.length > 0) {
          message = error.messages.join(', ');
        } else if (error.message && error.message !== 'Ocurrió un error inesperado') {
          message = error.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView className='flex-1 bg-white pt-10'>
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
              onPress={() => {
                if (step === 2) setStep(1);
                else router.back();
              }}
              style={{ position: 'absolute', left: 12, top: 8, bottom: 8, justifyContent: 'center' }}>
              <ChevronLeftIcon width={20} height={20} color='#f97316' />
            </TouchableOpacity>

            <Text style={{ color: '#111827', fontSize: 16, fontWeight: '600' }}>
              {step === 1 ? 'Verificar identidad' : 'Cambiar contraseña'}
            </Text>
          </View>

          <View className='mb-4 flex-row items-center'>
            <View className='w-9 h-9 rounded-full bg-[#F3F4F6] items-center justify-center mr-3'>
              <ShieldCheckIcon width={20} height={20} color='#111827' />
            </View>
            <View className='flex-1'>
              <Text className='text-[15px] font-semibold text-[#111827]'>Seguridad de la cuenta</Text>
              <Text className='text-[12px] text-[#6b7280]'>Actualiza tu contraseña de acceso</Text>
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
              <Text style={{ color: '#B91C1C', fontSize: 12 }}>{errorMessage}</Text>
            </View>
          )}

          {step === 1 && (
            <View>
              <StyledTextInput
                label='Contraseña actual'
                isPasswordInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder='Ingresa tu contraseña actual'
              />
              <PrimaryButton
                title={isLoading ? 'Validando...' : 'Continuar'}
                onPress={handleValidateCurrent}
                disabled={isLoading}
                style={{ marginTop: 12 }}
              />
            </View>
          )}

          {step === 2 && (
            <View>
              <StyledTextInput
                label='Nueva contraseña'
                isPasswordInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder='Ingresa tu nueva contraseña'
              />
              <StyledTextInput
                label='Confirmar contraseña'
                isPasswordInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder='Repite tu nueva contraseña'
              />
              <PrimaryButton
                title={isLoading ? 'Guardando...' : 'Guardar cambios'}
                onPress={handleChangePassword}
                disabled={isLoading}
                style={{ marginTop: 12 }}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}