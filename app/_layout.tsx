import { ReservationsProvider } from '@/contexts/reservations';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
			<ThemeProvider value={DarkTheme}>
				<Stack>
					<Stack.Screen name='index' options={{ headerShown: false }} />
					<Stack.Screen name='(auth)' options={{ headerShown: false }} />
					<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
					<Stack.Screen name='(instructor)' options={{ headerShown: false }} />
					<Stack.Screen name='(recepcionist)' options={{ headerShown: false }} />
					<Stack.Screen name='language' />
					<Stack.Screen
						name='cancel-membership'
						options={{
							title: 'Membresía',
							headerShown: true,
							headerBackTitle: 'Volver',
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
							headerBackTitle: '',
							headerStyle: { backgroundColor: '#000000' },
							headerTintColor: '#ffffff',
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
							title: 'Detalles de la Clase',
							headerShown: false,
							headerBackTitle: 'Volver',
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
				</Stack>
				<StatusBar style='auto' />
			</ThemeProvider>
		</ReservationsProvider>
	);
}
