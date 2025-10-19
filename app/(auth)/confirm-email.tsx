import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { Fonts } from '@/constants/theme';
import api from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ConfirmEmailScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const [code, setCode] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleConfirmCode = async () => {
		if (!code.trim()) {
			alert('Por favor, ingresa el código de confirmación.');
			return;
		}

		setIsLoading(true);

		try {
			const verifyResponse = await api.put('/auth/activate', { code: code.trim() });

			if (verifyResponse.status !== 200 && verifyResponse.status !== 204) {
				console.warn('⚠️ Estado inesperado al activar:', verifyResponse.status);
				alert('Código inválido o expirado. Intenta nuevamente.');
				return;
			}

			alert('¡Tu cuenta ha sido activada con éxito!');

			alert('¡Tu cuenta ha sido activada con éxito!');

			const email = await AsyncStorage.getItem('temp_email');
			const password = await AsyncStorage.getItem('temp_password');

			if (!email || !password) {
				alert(
					'No se encontraron las credenciales del registro. Inicia sesión manualmente.',
				);
				router.replace('/(auth)/login');
				return;
			}

			const loginResponse = await api.post('/auth/login', { email, password });

			const token =
				loginResponse.data?.token ||
				loginResponse.data?.access_token ||
				loginResponse.data?.jwt ||
				null;

			if (!token) {
				console.error('❌ No se recibió token después del login automático');
				alert('No se pudo obtener el token. Inicia sesión manualmente.');
				router.replace('/(auth)/login');
				return;
			}

			await AsyncStorage.setItem('token', token);
			await AsyncStorage.multiRemove(['temp_email', 'temp_password']);

			router.replace('/(tabs)/dashboard');
		} catch (err) {
			const error = err as AxiosError<{ message?: string; error?: string }>;
			console.error('❌ Error al confirmar o iniciar sesión:', error);

			const backendMessage =
				error.response?.data?.message ||
				error.response?.data?.error ||
				(error.response?.status === 404
					? 'El endpoint /auth/activate no existe o fue movido.'
					: 'Hubo un error inesperado.');

			alert(backendMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendCode = () => {
		alert('Se ha reenviado el código de confirmación.');
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			style={{ flex: 1 }}>
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: 'center',
					alignItems: 'center',
					padding: 24,
					paddingBottom: insets.bottom + 32,
				}}
				keyboardShouldPersistTaps='handled'>
				{/* Logo */}
				<View className='items-center mb-8'>
					<Image
						source={require('../../assets/images/Component_7.png')}
						className='w-32 h-32'
						resizeMode='contain'
					/>
				</View>

				{/* Title */}
				<Text
					className='text-3xl font-bold text-center mb-4'
					style={{ fontFamily: Fonts.title }}>
					Confirma tu Correo Electrónico
				</Text>

				{/* Message */}
				<Text className='text-lg text-gray-600 text-center mb-8'>
					Te hemos enviado un código a tu correo electrónico.
				</Text>

				{/* Code Input */}
				<View className='w-full max-w-xs mb-8'>
					<Text className='text-sm text-gray-500 mb-1 font-semibold'>
						Código de confirmación
					</Text>
					<TextInput
						value={code}
						onChangeText={setCode}
						keyboardType='default'
						autoComplete='off'
						autoCapitalize='none'
						className='border border-gray-300 rounded-lg px-4 py-3 text-center text-lg'
						style={{ fontFamily: Fonts.medium }}
						placeholder='----'
					/>
				</View>

				{/* Resend Code Link */}
				<TouchableOpacity onPress={handleResendCode} className='mb-8'>
					<Text className='text-blue-500 font-semibold'>
						¿No recibiste el código? Reenviar
					</Text>
				</TouchableOpacity>

				{/* Buttons */}
				<View className='w-full gap-4'>
					<PrimaryButton
						title={isLoading ? 'Verificando...' : 'Continuar'}
						onPress={handleConfirmCode}
						disabled={isLoading}
					/>
					<SecondaryButton title='Cancelar' onPress={() => router.back()} />
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
