import { LogoSimple } from '@/components/auth/Logo';
import { SocialButton } from '@/components/auth/SocialButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ToastNotification } from '@/components/ToastNotification';
import { Colors, Fonts } from '@/constants/theme';
import { useToast } from '@/hooks/useToast';
import vitalFitApi from '@/services/vitalfitSdk';
import { useAuth, useClerk, useOAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import Checkbox from 'expo-checkbox';
import * as Linking from 'expo-linking';
import { Link, useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, SlidersVertical } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    BackHandler,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

export default function LoginScreen() {
    const { toastState, showToast, hideToast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const onBackPress = () => {
            router.replace('/');
            return true;
        };

        const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => subscription.remove();
    }, [router]);
    const { t } = useTranslation();
    const { signOut } = useClerk();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
    const { getToken } = useAuth();
    const [isChecked, setChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            showToast('error', t('login.toast.errorTitle'), t('login.toast.emptyFields'));
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('error', t('login.toast.errorTitle'), t('login.toast.invalidEmail'));
            return;
        }

        setIsLoading(true);

        try {
            const response = await vitalFitApi.auth.login({ email, password });
            console.log('Login exitoso:', response);

            const token = response.token;
            if (token) {
                await AsyncStorage.setItem('token', token);
                console.log('Token guardado en AsyncStorage');
                
                await new Promise(resolve => setTimeout(resolve, 300));
                console.log('Delay completado, token debe estar disponible');

                const whoamiResponse = await vitalFitApi.user.WhoAmI(token);
                const role = whoamiResponse.user?.role?.name?.toLowerCase();

                if (role === 'instructor') {
                    router.replace('/(instructor)/dashboard');
                } else if (role === 'recepcionist' || role === 'receptionist') {
                    router.replace('/(recepcionist)/dashboard');
                } else {
                    router.replace('/(tabs)/dashboard');
                }
            } else {
                console.warn('No se recibió token en la respuesta del SDK.');
            }
        } catch (error: unknown) {
            let errorMessage = t('login.toast.unexpectedError');
            if (isAPIError(error)) {
                errorMessage = error.messages.join(', ');
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error('Error en el login (detalle completo):', JSON.stringify(error, null, 2));
            showToast('error', t('login.toast.loginErrorTitle'), errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = useCallback(async () => {
        setIsGoogleLoading(true);
        try {
            try {
                await signOut();
                console.log('Sesión previa de Clerk cerrada');
            } catch {
                console.log('No había sesión previa para cerrar');
            }

            const { createdSessionId, setActive } = await startOAuthFlow({
                redirectUrl: Linking.createURL('/(tabs)/dashboard', { scheme: 'vitalfit' }),
            });

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });

                console.log('Sesión activada con ID:', createdSessionId);

                await new Promise(resolve => setTimeout(resolve, 1000));

                const clerkToken = await getToken({ template: 'vitalfit-backend' });

                if (clerkToken) {
                    console.log('Session Token de Clerk obtenido con template vitalfit-backend');
                    console.log('Token (primeros 100 chars):', clerkToken.substring(0, 100));

                    try {
                        const payload = JSON.parse(atob(clerkToken.split('.')[1]));
                        console.log('Email:', payload.email);
                        console.log('User ID:', payload.sub);
                        console.log('Payload completo:', JSON.stringify(payload, null, 2));
                    } catch (decodeError) {
                        console.error('Error al decodificar JWT:', decodeError);
                    }

                    try {
                        console.log('Enviando al backend...');

                        const response = await vitalFitApi.auth.oAuthLogin({
                            session_token: clerkToken
                        });

                        console.log('Respuesta exitosa del backend');

                        const backendToken = response.token;

                        if (backendToken) {
                            await AsyncStorage.setItem('token', backendToken);
                            console.log('Token de backend guardado');

                            await new Promise(resolve => setTimeout(resolve, 300));
                            console.log('Delay completado, token debe estar disponible');

                            const whoamiResponse = await vitalFitApi.user.WhoAmI(backendToken);
                            const role = whoamiResponse.user?.role?.name?.toLowerCase();

                            if (role === 'instructor') {
                                router.replace('/(instructor)/dashboard');
                            } else if (role === 'recepcionist' || role === 'receptionist') {
                                router.replace('/(recepcionist)/dashboard');
                            } else {
                                router.replace('/(tabs)/dashboard');
                            }

                            showToast('success', '¡Bienvenido!', 'Iniciaste sesión con Google exitosamente');
                        }
                    } catch (backendError: unknown) {
                        console.error('Error al autenticar con el backend:', backendError);

                        if (isAPIError(backendError)) {
                            const errorMessage = backendError.messages.join(', ');
                            showToast('error', 'Error de autenticación', errorMessage);
                        } else if (backendError instanceof Error && backendError.message?.includes('Usuario no encontrado')) {
                            showToast('error', 'Usuario no registrado', 'Esta cuenta de Google no está registrada en VitalFit');
                        } else {
                            showToast('error', 'Error de autenticación', 'No se pudo iniciar sesión con Google');
                        }
                    }
                } else {
                    console.warn('No se pudo obtener el token de sesión con el template');
                    showToast('error', 'Error', 'No se pudo obtener el token de Clerk');
                }
            }
        } catch (error: unknown) {
            console.error('Error en Google Sign-In:', error);

            if (error instanceof Error && error.message?.includes('already signed in')) {
                showToast('success', 'Ya has iniciado sesión', 'Redirigiendo al dashboard...');
                router.replace('/(tabs)/dashboard');
            } else {
                showToast('error', 'Error de autenticación', 'No se pudo iniciar sesión con Google');
            }
        } finally {
            setIsGoogleLoading(false);
        }
    }, [startOAuthFlow, getToken, signOut, router, showToast]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#FFFFFF' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ToastNotification
                visible={toastState.visible}
                type={toastState.type}
                title={toastState.title}
                message={toastState.message}
                onClose={hideToast}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        paddingHorizontal: 32,
                        paddingVertical: 16,
                    }}
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                    <TouchableOpacity
                        onPress={() => router.replace('/')}
                        className='absolute top-4 left-4 z-10 w-10 h-10 items-center justify-center'
                        style={{ backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 20 }}>
                        <ArrowLeft size={24} color='#000' />
                    </TouchableOpacity>
                    <View className='w-full max-w-sm self-center'>
                        <View className='items-center mb-2'>
                            <LogoSimple size={250} />
                        </View>

                        <Text
                            className='text-4xl text-black mb-2 uppercase text-center'
                            style={{ fontFamily: Fonts.title }}>
                            {t('login.title')}
                        </Text>

                        <Text className='text-gray-500 text-center mb-8 text-lg'>
                            {t('login.subtitle')}
                        </Text>

                        <View className='px-2 mt-6 gap-6'>
                            <View className='mb-4'>
                                <Text className='text-black font-bold text-sm mb-1 ml-1'>
                                    {t('login.emailLabel')}
                                </Text>
                                <TextInput
                                    placeholder={t('login.emailPlaceholder')}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    style={{ height: 48 }}
                                    className='border border-gray-300 rounded-md px-4'
                                />
                            </View>

                            <View className='mb-4'>
                                <View className='flex-row items-center mb-1 ml-1'>
                                    <SlidersVertical
                                        size={16}
                                        color={Colors.light.text}
                                        className='mr-2'
                                    />
                                    <Text className='text-black font-bold text-sm'>
                                        {t('login.passwordLabel')}
                                    </Text>
                                </View>
                                <View
                                    style={{ height: 48 }}
                                    className='flex-row items-center border border-gray-300 rounded-md px-4'>
                                    <TextInput
                                        placeholder={t('login.passwordPlaceholder')}
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={setPassword}
                                        className='flex-1'
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <EyeOff size={20} color={Colors.light.icon} />
                                        ) : (
                                            <Eye size={20} color={Colors.light.icon} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View className='w-full flex-row justify-between items-center my-4'>
                            <View className='flex-row items-center'>
                                <Checkbox
                                    value={isChecked}
                                    onValueChange={setChecked}
                                    color={isChecked ? Colors.light.tint : undefined}
                                    style={{
                                        transform: [{ scale: 0.7 }],
                                        borderRadius: 5,
                                    }}
                                />
                                <Text className='ml-2 text-gray-600 text-xs'>
                                    {t('login.rememberMe')}
                                </Text>
                            </View>
                            <Link href='/(auth)/forgot-password' asChild>
                                <TouchableOpacity>
                                    <View className='flex-row items-center'>
                                        <Text className='text-xs text-gray-600'>
                                            {t('login.forgotPassword')}
                                        </Text>
                                        <Text className='text-[#F27F2A] font-semibold text-xs'>
                                            {t('login.recover')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </Link>
                        </View>

                        <View className='gap-4 mb-4'>
                            <PrimaryButton
                                title={isLoading ? t('login.signingInButton') : t('login.signInButton')}
                                onPress={handleLogin}
                                disabled={isLoading}
                            />
                            <SocialButton
                                title={isGoogleLoading ? 'Iniciando...' : t('login.googleSignIn')}
                                iconName='google'
                                onPress={handleGoogleSignIn}
                                disabled={isGoogleLoading}
                            />
                        </View>

                        <View className='mt-1 flex-row justify-center items-center'>
                            <Text className='text-gray-600'>
                                {t('login.noAccount')}
                            </Text>
                            <Link href='/(auth)/register' asChild>
                                <TouchableOpacity>
                                    <Text className='font-semibold text-[#F27F2A]'>
                                        {t('login.signUpLink')}
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}