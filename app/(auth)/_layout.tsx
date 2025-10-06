// app/(auth)/_layout.tsx

import { Stack } from 'expo-router';

export default function AuthLayout() {
	return (
		<Stack>
			<Stack.Screen name='home' options={{ headerShown: false }} />
			<Stack.Screen name='login' options={{ headerShown: false }} />
			<Stack.Screen name='register' options={{ title: 'Crear Cuenta' }} />
			<Stack.Screen name='forgot-password' options={{ title: 'Recuperar Contraseña' }} />
			<Stack.Screen name='dashboard' options={{ title: 'sesion iniciada' }} />
			{/* Puedes agregar más pantallas aquí a medida que las crees */}
		</Stack>
	);
}
