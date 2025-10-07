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
import { Text, View } from 'react-native';

export default function LoginScreen() {
	const router = useRouter();
	const [isChecked, setChecked] = useState(false);

	const handleLogin = () => {
		router.replace('/(tabs)/dashboard');
	};

	return (
		<ThemedView className='flex-1 bg-white px-8 pt-16'>
			<View className='w-full max-w-sm self-center'>
				{/* Logo centrado arriba */}
				<View className='items-center mb-6'>
					<Logo />
				</View>

				{/* Título */}
				<ThemedText
					style={{ fontFamily: Fonts.title }}
					className='text-3xl text-black mb-2 uppercase text-center'>
					Iniciar Sesión
				</ThemedText>

				{/* Subtítulo */}
				<ThemedText className='text-gray-500 mb-8 text-center'>
					Ingresa tus credenciales para iniciar sesión
				</ThemedText>

				{/* Inputs */}
				<StyledTextInput
					label='Correo electrónico'
					placeholder='Ingresa tu correo electrónico'
				/>
				<View className='h-4' />
				<StyledTextInput
					label='Contraseña'
					placeholder='Ingresa tu contraseña'
					secureTextEntry
				/>

				{/* Checkbox + Recuperar */}
				<View className='w-full flex-row justify-between items-center my-4'>
					<View className='flex-row items-center'>
						<Checkbox
							value={isChecked}
							onValueChange={setChecked}
							color={isChecked ? '#F27F2A' : undefined}
						/>
						<ThemedText className='ml-2 text-gray-600'>Mantener sesión</ThemedText>
					</View>
					<Link href='/(auth)/forgot-password'>
						<Text style={{ color: Colors.light.tint, fontWeight: '600' }}>
							¿Olvidaste tu contraseña?
						</Text>
					</Link>
				</View>

				{/* Botón principal */}
				<PrimaryButton title='Iniciar sesión' onPress={handleLogin} />
				<View className='h-4' />

				{/* Google */}
				<SocialButton title='Sign in with Google' iconName='google' />

				{/* Register */}
				<View className='mt-8 flex-row justify-center'>
					<Text className='text-gray-600'>
						¿No tienes cuenta aún?{' '}
						<Link href='/(auth)/register'>
							<Text style={{ color: Colors.light.tint, fontWeight: '600' }}>
								Regístrate
							</Text>
						</Link>
					</Text>
				</View>
			</View>
		</ThemedView>
	);
}
