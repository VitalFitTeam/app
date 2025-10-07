// app/(auth)/login.tsx
import { Logo } from '@/components/auth/Logo';
import { SocialButton } from '@/components/auth/SocialButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import api from '@/services/api';
import Checkbox from 'expo-checkbox';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

export default function LoginScreen() {
	const router = useRouter();
	const [isChecked, setChecked] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			Alert.alert('Error', 'Por favor, ingresa un correo electrónico válido.');
			return;
		}

		setIsLoading(true);

		try {
			const response = await api.post('/auth/login', {
				email,
				password,
			});

			console.log('Login exitoso:', response.data);
			// const { token } = response.data; // TODO: Guardar y utilizar el token

			// Aquí deberías guardar el token de forma segura
			router.replace('/');
		} catch (error: unknown) {
			let errorMessage = 'No se pudo conectar al servidor. Inténtalo de nuevo.';
			// Comprobación segura para errores de Axios
			if (typeof error === 'object' && error !== null && 'message' in error) {
				const err = error as {
					response?: { data?: { message?: string } };
					message: string;
				};
				errorMessage = err.response?.data?.message || err.message;
			}
			console.error('Error en el login:', errorMessage);
			Alert.alert('Error al iniciar sesión', errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ThemedView className='flex-1 bg-white px-8 pt-16'>
			<View className='w-full max-w-sm self-center'>
				<View className='items-center mb-6'>
					<Logo />
				</View>

				<ThemedText
					style={{ fontFamily: Fonts.title }}
					className='text-3xl text-black mb-2 uppercase text-center'>
					Iniciar Sesión
				</ThemedText>

				<ThemedText className='text-gray-500 mb-8 text-center'>
					Ingresa tus credenciales para iniciar sesión
				</ThemedText>

				<StyledTextInput
					label='Correo electrónico'
					placeholder='Ingresa tu correo electrónico'
					value={email}
					onChangeText={setEmail}
					keyboardType='email-address'
					autoCapitalize='none'
				/>
				<View className='h-4' />
				<StyledTextInput
					label='Contraseña'
					placeholder='Ingresa tu contraseña'
					secureTextEntry
					value={password}
					onChangeText={setPassword}
				/>

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

				<PrimaryButton
					title={isLoading ? 'Iniciando...' : 'Iniciar sesión'}
					onPress={handleLogin}
					disabled={isLoading}
				/>
				<View className='h-4' />

				<SocialButton title='Sign in with Google' iconName='google' />

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
