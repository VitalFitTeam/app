// app/_layout.tsx

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
	anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		// Carga ambas fuentes aquí
		'BebasNeue-Regular': require('../assets/fonts/BebasNeue-Regular.ttf'),
		'Montserrat-ExtraBold': require('../assets/fonts/Montserrat-ExtraBold.ttf'),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
				<Stack.Screen name='(auth)' options={{ headerShown: false }} /> 
				<Stack.Screen name='modal' options={{ presentation: 'modal', title: 'Modal' }} />
			</Stack>
			<StatusBar style='auto' />
		</ThemeProvider>
	);
}
