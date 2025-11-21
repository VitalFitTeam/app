import { Logo } from '@/components/auth/Logo';
import { Step1Gender } from '@/components/auth/register/Step1Gender';
import { Step2Credentials } from '@/components/auth/register/Step2Credentials';
import { Step3PersonalDetails } from '@/components/auth/register/Step3PersonalDetails';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ToastNotification } from '@/components/ToastNotification';
import { Colors, Fonts } from '@/constants/theme';
import { useToast } from '@/hooks/useToast';
import { RegisterData, RegisterSchema, Step1Schema, Step2Schema } from '@/schemas/register';
import vitalFitApi from '@/services/vitalfitSdk';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError, SignUpRequest, UserGender } from '@vitalfit/sdk';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next'; // 1. Importar hook
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
    const { t } = useTranslation(); // 2. Inicializar
    const router = useRouter();
    const [step, setStep] = useState(1);
    const { toastState, showToast, hideToast } = useToast();

    const {
        control,
        handleSubmit,
        trigger,
        formState: { errors },
        getValues,
        setError,
    } = useForm<RegisterData>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: { acceptTerms: false },
    });

    const handleRegistration = async (data: RegisterData) => {
        // ... Lógica de envío (se mantiene igual, solo limpiamos para el ejemplo) ...
        const cleanedData = { ...data }; // Simplificado para el ejemplo

        try {
            const payload: SignUpRequest = {
                email: cleanedData.email,
                password: cleanedData.password,
                gender: cleanedData.gender === 'prefer-not-to-say' ? null : (cleanedData.gender as UserGender),
                first_name: cleanedData.name,
                last_name: cleanedData.lastName,
                identity_document: cleanedData.documentId,
                birth_date: new Date(cleanedData.birthDate).toISOString().split('T')[0],
                phone: cleanedData.phone,
                profile_picture_url: '',
                role_name: 'client',
            };

            await vitalFitApi.auth.signUp(payload);
            await AsyncStorage.setItem('temp_email', cleanedData.email);
            await AsyncStorage.setItem('temp_password', cleanedData.password);

            // TRADUCCIÓN DE TOAST DE ÉXITO
            showToast(
                'success',
                t('register.toast.successTitle'),
                t('register.toast.successMessage')
            );

            setTimeout(() => {
                router.replace('/(auth)/confirm-email');
            }, 2000);
        } catch (error: unknown) {
            // TRADUCCIÓN DE ERRORES
            let errorMessage = t('register.toast.unexpectedError');
            if (isAPIError(error)) {
                errorMessage = error.messages.join(', ');
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            showToast('error', t('register.toast.errorTitle'), errorMessage);
        }
    };

    const onSubmitPress = handleSubmit(handleRegistration);

    const nextStep = async () => {
        const fieldsToValidate: (keyof RegisterData)[] =
            step === 1 ? ['gender'] : ['email', 'password', 'confirmPassword'];

        await trigger(fieldsToValidate);
        const currentSchema = step === 1 ? Step1Schema : Step2Schema;
        const result = currentSchema.safeParse(getValues());

        if (result.success) {
            setStep(step + 1);
        } else {
            result.error.issues.forEach((issue) => {
                setError(issue.path[0] as keyof RegisterData, {
                    type: 'manual',
                    message: issue.message,
                });
            });
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
            <ToastNotification
                visible={toastState.visible}
                type={toastState.type}
                title={toastState.title}
                message={toastState.message}
                onClose={hideToast}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps='handled'
                showsVerticalScrollIndicator={false}>
                <ThemedView style={styles.container}>
                    <View style={styles.formContainer}>
                        <Logo />
                        
                        {/* TÍTULOS TRADUCIDOS */}
                        {step === 1 && (
                            <ThemedText style={[styles.mainTitle, { fontFamily: Fonts.title }]}>
                                {t('register.step1Title')}
                            </ThemedText>
                        )}
                        {step === 2 && (
                            <>
                                <ThemedText style={[styles.mainTitle, { fontFamily: Fonts.title }]}>
                                    {t('register.step2Title')}
                                </ThemedText>
                                <Text className='text-gray-500 text-center mb-8 text-lg'>
                                    {t('register.step2Subtitle')}
                                </Text>
                            </>
                        )}
                        {step === 3 && (
                            <Text className='text-gray-500 text-center mb-8 text-lg'>
                                {t('register.step3Subtitle')}
                            </Text>
                        )}

                        <View style={styles.stepContainer}>
                            {step === 1 && (
                                <Step1Gender
                                    control={control}
                                    errors={errors}
                                    onNextStep={nextStep}
                                />
                            )}
                            {step === 2 && (
                                <Step2Credentials
                                    control={control}
                                    errors={errors}
                                    onNextStep={nextStep}
                                />
                            )}
                            {step === 3 && (
                                <Step3PersonalDetails
                                    control={control}
                                    errors={errors}
                                    onSubmit={onSubmitPress}
                                />
                            )}
                        </View>

                        <View style={styles.footer}>
                            <Link href='/(auth)/login'>
                                <Text style={styles.footerText}>
                                    {t('register.alreadyHaveAccount')}
                                    <Text style={styles.footerLink}>
                                        {t('register.signInLink')}
                                    </Text>
                                </Text>
                            </Link>
                        </View>
                    </View>
                </ThemedView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardView: { flex: 1, backgroundColor: 'white' },
    scrollContent: { flexGrow: 1 },
    container: { flex: 1, alignItems: 'center', backgroundColor: 'white', paddingTop: 60 },
    formContainer: { width: '100%', maxWidth: 384, paddingHorizontal: 24, alignItems: 'center', flex: 1 },
    stepContainer: { flex: 1, width: '100%', alignItems: 'center', gap: 16 },
    mainTitle: { fontSize: 32, marginBottom: 8, textAlign: 'center', color: '#F27F2A', lineHeight: 38 },
    footer: { marginTop: 'auto', paddingBottom: 40 },
    footerText: { color: '#5C5E60' },
    footerLink: { color: Colors.light.tint, fontWeight: '600' },
});