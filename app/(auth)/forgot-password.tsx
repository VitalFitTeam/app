import { Logo } from '@/components/auth/Logo';
import { CodeInput } from '@/components/CodeInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { SecondaryButton } from '@/components/SecondaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ToastNotification } from '@/components/ToastNotification';
import { Colors } from '@/constants/theme';
import { useToast } from '@/hooks/useToast';
import { ForgotPasswordSchema, type ForgotPasswordData } from '@/schemas/forgot-password';
import vitalFitApi from '@/services/vitalfitSdk';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAPIError } from '@vitalfit/sdk';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SlidersVertical } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toastState, showToast, hideToast } = useToast();
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleCancel = () => {
    if (params.from === 'settings') {
      router.back();
    } else {
      router.push('/(auth)/login');
    }
  };

  const titles = ['RECUPERA TU CONTRASEÑA', 'VERIFICAR CÓDIGO', 'NUEVA CONTRASEÑA'];
  const subtitles = [
    'Ingresa el correo electrónico asociado a la cuenta para recuperar tu contraseña',
    'Te hemos enviado un código a tu correo',
    'Ingresa tu nueva contraseña',
  ];

  const handleSendEmail = async (): Promise<void> => {
    if (!email) {
      showToast('error', 'Error', 'Por favor, ingresa tu correo.');
      return;
    }

    setIsLoading(true);
    try {
      await vitalFitApi.auth.forgotPassword(email);
    } catch (error: unknown) {
      // ⚠️ NO debemos revelar si el correo existe o no
      if (isAPIError(error)) {
        const msg = error.messages.join(', ').toLowerCase();

        // ❗ Errores que NO deben bloquear el flujo
        if (
          msg.includes('not found') ||
          msg.includes('no existe') ||
          msg.includes('email') ||
          msg.includes('usuario') ||
          msg.includes('does not exist')
        ) {
          // Ignorar estos errores
        } else {
          // ❌ Este sí podría ser un error verdadero (500, red, etc.)
          console.error('Error real al enviar correo:', error);
          showToast('error', 'Error', 'Ocurrió un error inesperado. Inténtalo de nuevo.');
          setIsLoading(false);
          return;
        }
      } else if (error instanceof Error) {
        // Errores no API (red caída, timeout...)
        console.error('Error inesperado al enviar correo:', error);
        showToast('error', 'Error', 'Ocurrió un error inesperado. Inténtalo de nuevo.');
        setIsLoading(false);
        return;
      }
    }

    // Pase lo que pase, continúa
    showToast(
      'success',
      'Éxito',
      'Si el correo existe, se ha enviado un código de recuperación.'
    );
    setStep(2);

    setIsLoading(false);
  };


  const handleValidateToken = async (code: string): Promise<void> => {
    setIsLoading(true);
    try {
      await vitalFitApi.auth.validateResetToken(code);
      setToken(code);
      setStep(3);
    } catch (error: unknown) {
      let errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
      if (isAPIError(error)) {
        errorMessage = error.messages.join(', ');
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Error al validar el código:', error);
      showToast('error', 'Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: ForgotPasswordData): Promise<void> => {
    setIsLoading(true);
    try {
      if (!token) {
        showToast('error', 'Error', 'Token de verificación no encontrado.');
        setIsLoading(false);
        return;
      }

      await vitalFitApi.client.post({
        url: '/auth/password/reset',
        data: {
          token: token,
          password: data.password,
          confirm_password: data.confirmPassword,
        },
      });

      showToast('success', '¡Éxito!', 'Tu contraseña ha sido restablecida correctamente.');
      setTimeout(() => {
        router.push('/(auth)/login');
      }, 2000);
    } catch (error: unknown) {
      let errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
      if (isAPIError(error)) {
        errorMessage = error.messages.join(', ');
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Error al restablecer contraseña:', error);
      showToast('error', 'Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%', alignItems: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
          <View style={styles.formContainer}>
            <Logo />
            <ThemedText type="title" lightColor={Colors.light.tint} style={styles.title}>
              {titles[step - 1]}
            </ThemedText>
            <Text className="text-gray-500 text-center mb-8 text-lg">{subtitles[step - 1]}</Text>

            <ProgressIndicator currentStep={step} />

            {step === 1 && (
              <>
                <StyledTextInput
                  label="Correo electrónico"
                  placeholder="tucorreo@email.com"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
                <PrimaryButton
                  title={isLoading ? 'Enviando...' : 'Enviar código'}
                  onPress={handleSendEmail}
                  disabled={isLoading}
                />
                <SecondaryButton
                  title="Cancelar"
                  onPress={handleCancel}
                  style={{ marginTop: 12 }}
                />
              </>
            )}

            {step === 2 && (
              <>
                <CodeInput onComplete={handleValidateToken} />
                <SecondaryButton
                  title="Cancelar"
                  onPress={handleCancel}
                  style={{ marginTop: 12 }}
                />
              </>
            )}

            {step === 3 && (
              <>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <StyledTextInput
                      label="Nueva contraseña"
                      isPasswordInput
                      icon={<SlidersVertical size={16} color={Colors.light.icon} />}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={errors.password?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <StyledTextInput
                      label="Confirmar contraseña"
                      isPasswordInput
                      icon={<SlidersVertical size={16} color={Colors.light.icon} />}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      error={errors.confirmPassword?.message}
                    />
                  )}
                />
                <PrimaryButton
                  title={isLoading ? 'Guardando...' : 'Guardar'}
                  onPress={handleSubmit(handleResetPassword)}
                  disabled={isLoading}
                />
                <SecondaryButton
                  title="Cancelar"
                  onPress={handleCancel}
                  style={{ marginTop: 12 }}
                />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <ToastNotification
        visible={toastState.visible}
        type={toastState.type}
        title={toastState.title}
        message={toastState.message}
        onClose={hideToast}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 80, backgroundColor: 'white' },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 384,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 16,
  },
  title: { fontSize: 28, textAlign: 'center' },
});
