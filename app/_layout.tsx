import { ReservationsProvider } from '@/contexts/reservations';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Importante: Hook
import 'react-native-reanimated';
import '../global.css';
import '../services/i18n'; // Importante: Configuración de i18n

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    // 1. Obtenemos la función de traducción
    const { t } = useTranslation();

    const [loaded] = useFonts({
        'BebasNeue-Regular': require('../assets/fonts/BebasNeue-Regular.ttf'),
        'Montserrat-ExtraBold': require('../assets/fonts/Montserrat-ExtraBold.ttf'),
    });

    useEffect(() => {
        if (loaded) SplashScreen.hideAsync();
    }, [loaded]);

    if (!loaded) return null;

    return (
        <ReservationsProvider>
            <ThemeProvider value={DefaultTheme}>
                <Stack>
                    <Stack.Screen name='index' options={{ headerShown: false }} />
                    <Stack.Screen name='(auth)' options={{ headerShown: false }} />
                    <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                    <Stack.Screen name='(instructor)' options={{ headerShown: false }} />
                    <Stack.Screen name='(recepcionist)' options={{ headerShown: false }} />
                    
                    {/* Pantalla de idioma */}
                    <Stack.Screen name='language' />

                    <Stack.Screen
                        name='cancel-membership'
                        options={{
                            // 2. Usamos las claves de traducción aquí
                            title: t('nav.membership'), 
                            headerShown: true,
                            headerBackTitle: t('nav.back'),
                        }}
                    />
                    <Stack.Screen
                        name='membership-confirm'
                        options={{
                            title: '',
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name='membership-payment-transfer'
                        options={{
                            title: '',
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name='membership-payment-pagomovil'
                        options={{
                            title: '',
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name='membership-methods'
                        options={{
                            title: '',
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name='membership-payment'
                        options={{
                            title: '',
                            headerShown: true,
                            headerBackTitle: '', // Si quisieras traducir esto sería t('nav.back')
                            headerStyle: { backgroundColor: '#000000' },
                            headerTintColor: '#ffffff',
                        }}
                    />
                    <Stack.Screen
                        name='membership-entry'
                        options={{
                            title: '',
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name='memberships'
                        options={{
                            title: '',
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name='membership-checkout'
                        options={{
                            title: '',
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name='membership-extra'
                        options={{
                            title: '',
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name='class-details'
                        options={{
                            // 3. Usamos las claves de traducción aquí también
                            title: t('nav.classDetails'),
                            headerShown: false, // Nota: En tu código original estaba false
                            headerBackTitle: t('nav.back'),
                        }}
                    />
                    <Stack.Screen
                        name='routine/details'
                        options={{
                            headerShown: false,
                            title: '',
                        }}
                    />
                    <Stack.Screen
                        name='routine/history'
                        options={{
                            headerShown: false,
                            title: '',
                        }}
                    />
                    <Stack.Screen
                        name='instructor-assign-routine'
                        options={{
                            headerShown: false,
                            title: '',
                        }}
                    />
                    <Stack.Screen
                        name='instructor-client-progress'
                        options={{
                            headerShown: false,
                            title: '',
                        }}
                    />
                </Stack>
                <StatusBar style='auto' />
            </ThemeProvider>
        </ReservationsProvider>
    );
}