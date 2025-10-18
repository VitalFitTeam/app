// app/(auth)/_layout.tsx

import { Stack } from 'expo-router';

export default function AuthLayout() {
	return (
		<Stack>
			<Stack.Screen name='login' options={{ headerShown: false }} />
			<Stack.Screen name='register' options={{ headerShown: false }} />
			<Stack.Screen name='forgot-password' options={{ headerShown: false }} />

			{/* Puedes agregar más pantallas aquí a medida que las crees */}
		</Stack>
	);
}
