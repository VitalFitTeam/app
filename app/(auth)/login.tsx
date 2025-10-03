// app/(auth)/login.tsx

import { Logo } from '@/components/auth/Logo';
import { SocialButton } from '@/components/auth/SocialButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import Checkbox from 'expo-checkbox';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native'; // Asegúrate de importar Text

export default function LoginScreen() {
	const router = useRouter();
	const [isChecked, setChecked] = useState(false);

	const handleLogin = () => {
		router.replace('/(tabs)');
	};

	return (
		<ThemedView className="flex-1 items-center justify-center bg-white p-8">
			<View className="w-full max-w-sm items-center">
				<Logo />
				<ThemedText style={{ fontFamily: Fonts.title }} className="text-4xl text-black mb-2 uppercase">
					Iniciar Sesión
				</ThemedText>
				<ThemedText className="text-gray-500 mb-8">
					Ingresa tus credenciales para iniciar sesión
				</ThemedText>

				<StyledTextInput label="Correo electrónico" placeholder="Ingresa tu correo electrónico" />
				<View className="h-4" />
				<StyledTextInput label="Contraseña" placeholder="Ingresa tu contraseña" secureTextEntry />

				<View className="w-full flex-row justify-between items-center my-4">
					<View className="flex-row items-center">
						<Checkbox value={isChecked} onValueChange={setChecked} color={isChecked ? '#F27F2A' : undefined} />
						<ThemedText className="ml-2 text-gray-600">Mantenerme sesión</ThemedText>
					</View>
					<Link href="/(auth)/forgot-password">
						{/* 👇 CORRECCIÓN SUTIL AQUÍ 👇 */}
						<Text style={{ color: Colors.light.tint, fontWeight: '600' }}>Recuperar</Text>
					</Link>
				</View>

				<PrimaryButton title="Iniciar sesión" onPress={handleLogin} />
				<View className="h-4" />
				<SocialButton title="Sign in with Google" iconName="google" />

				<View className="mt-8">
					<Link href="/(auth)/register">
						{/* 👇 CORRECCIÓN IMPORTANTE AQUÍ 👇 */}
						<Text className="text-gray-600">
							¿No tienes cuenta aún?
							<Text style={{ color: Colors.light.tint, fontWeight: '600' }}> Regístrate</Text>
						</Text>
					</Link>
				</View>
			</View>
		</ThemedView>
	);
}