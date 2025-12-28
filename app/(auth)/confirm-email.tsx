import { Logo } from '@/components/auth/Logo';
import { CodeInput } from '@/components/CodeInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { ThemedText } from '@/components/themed-text';
import { ToastNotification } from '@/components/ToastNotification';
import { Colors, Fonts } from '@/constants/theme';
import { useToast } from '@/hooks/useToast';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // 1. Importar hook
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ConfirmEmailScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation(); // 2. Inicializar hook
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toastState, showToast, hideToast } = useToast();

    const handleConfirmCode = async () => {
        if (!code.trim()) {
            // "Por favor, ingresa el código..."
            showToast('error', t('confirmEmail.toast.errorTitle'), t('confirmEmail.toast.enterCode'));
            return;
        }

        setIsLoading(true);

        try {
            const storedPassword = await AsyncStorage.getItem('temp_password');

            if (!storedPassword) {
                showToast(
                    'error',
                    t('confirmEmail.toast.errorTitle'),
                    t('confirmEmail.toast.tempPasswordNotFound')
                );
                setTimeout(() => router.replace('/(auth)/login'), 2000);
                return;
            }

            await vitalFitApi.client.put({
                url: `/auth/activate/${code.trim()}`,
                data: {
                    password: storedPassword,
                    confirm_password: storedPassword,
                },
            });

            // ¡Éxito! Cuenta verificada
            showToast(
                'success',
                t('confirmEmail.toast.successTitle'),
                t('confirmEmail.toast.successMessage')
            );

            // Login automático después de verificar
            const email = await AsyncStorage.getItem('temp_email');
            const password = await AsyncStorage.getItem('temp_password');

            if (!email || !password) {
                // Si faltan credenciales, redirigir al login
                setTimeout(() => router.replace('/(auth)/login'), 2000);
                return;
            }

            try {
                const loginResponse = await vitalFitApi.auth.login({ email, password });
                const token = loginResponse.token || null;

                if (!token) {
                    console.error('No se recibió token después del login automático');
                    setTimeout(() => router.replace('/(auth)/login'), 2000);
                    return;
                }

                await AsyncStorage.setItem('token', token);
                await AsyncStorage.multiRemove(['temp_email', 'temp_password']);

                router.replace('/(tabs)/dashboard');
            } catch (loginErr: unknown) {
                console.error('Error en login automático:', loginErr);
                // Si falla el login automático, mandamos al usuario al login manual
                setTimeout(() => router.replace('/(auth)/login'), 2000);
            }
        } catch (error: unknown) {
            let errorMessage = t('confirmEmail.toast.errorMessage');
            if (isAPIError(error)) {
                errorMessage = error.messages.join(', ');
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error('Error al confirmar o iniciar sesión:', error);
            showToast('error', t('confirmEmail.toast.errorTitle'), errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = () => {
        // Aquí deberías llamar a la API de reenvío si la tienes
        showToast(
            'success',
            t('confirmEmail.toast.resendTitle'),
            t('confirmEmail.toast.resendMessage')
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 24,
                    paddingBottom: insets.bottom + 32,
                }}
                keyboardShouldPersistTaps='handled'>
                <ToastNotification
                    visible={toastState.visible}
                    type={toastState.type}
                    title={toastState.title}
                    message={toastState.message}
                    onClose={hideToast}
                />

                <View className='items-center mb-8'>
                    <Logo />
                </View>

                <View className='mb-16'>
                    {/* Título dividido en dos líneas para mantener tu estilo */}
                    <ThemedText
                        type='title'
                        lightColor={Colors.light.tint}
                        style={{
                            fontFamily: Fonts.title,
                            fontSize: 32,
                            textAlign: 'center',
                            lineHeight: 32,
                        }}>
                        {t('confirmEmail.title')}
                    </ThemedText>
                </View>

                <Text className='text-gray-500 text-center mb-8 text-lg'>
                    {t('confirmEmail.subtitle')}
                </Text>

                <View className='w-full max-w-xs mb-8'>
                    <Text className='text-sm text-gray-500 mb-1 font-semibold'></Text>
                    <CodeInput
                        onComplete={(inputCode: string) => {
                            setCode(inputCode);
                        }}
                    />
                </View>

                <TouchableOpacity onPress={handleResendCode} className='mb-8'>
                    <Text className='text-blue-500 font-semibold'>
                        {t('confirmEmail.resendText')} 
                        {t('confirmEmail.resendLink')}
                    </Text>
                </TouchableOpacity>

                <View className='w-full gap-4'>
                    <PrimaryButton
                        title={isLoading ? t('confirmEmail.verifyingButton') : t('confirmEmail.verifyButton')}
                        onPress={handleConfirmCode}
                        disabled={isLoading}
                    />
                    <SecondaryButton 
                        title={t('forgotPassword.step1.cancelButton')} // Reutilizamos "Cancelar"
                        onPress={() => router.back()} 
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}