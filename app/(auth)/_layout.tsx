// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
	return (
		<>
			<StatusBar style="dark" backgroundColor="#FFFFFF" />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: '#FFFFFF' }, 
				}}
			>
				<Stack.Screen name="home" />
				<Stack.Screen name="login" />
				<Stack.Screen name="register" />
				<Stack.Screen name="forgot-password" />
			</Stack>
		</>
	);
}
