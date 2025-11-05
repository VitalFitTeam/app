import { Logo } from '@/components/auth/Logo';
import { CodeInput } from '@/components/CodeInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { ThemedText } from '@/components/themed-text';
import { ToastNotification } from '@/components/ToastNotification';
import { Colors, Fonts } from '@/constants/theme';
import { useToast } from '@/hooks/useToast';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ConfirmEmailScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const [code, setCode] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { toastState, showToast, hideToast } = useToast();

	const handleConfirmCode = async () => {
		if (!code.trim()) {
			showToast('error', 'Error', 'Por favor, ingresa el código de confirmación.');
			return;
		}

		setIsLoading(true);

		try {
			await vitalFitApi.auth.verifyEmail(code.trim());

			showToast('success', '¡Éxito!', '¡Te has registrado exitosamente!');

			const email = await AsyncStorage.getItem('temp_email');
			const password = await AsyncStorage.getItem('temp_password');

			if (!email || !password) {
				showToast(
					'error',
					'Error',
					'No se encontraron las credenciales. Inicia sesión manualmente.',
				);
				setTimeout(() => router.replace('/(auth)/login'), 2000);
				return;
			}

			try {
				const loginResponse = await vitalFitApi.auth.login({ email, password });
				const token = loginResponse.token || null;

				if (!token) {
					console.error('No se recibió token después del login automático');
					showToast(
						'error',
						'Error',
						'No se pudo obtener el token. Inicia sesión manualmente.',
					);
					setTimeout(() => router.replace('/(auth)/login'), 2000);
					return;
				}

				await AsyncStorage.setItem('token', token);
				await AsyncStorage.multiRemove(['temp_email', 'temp_password']);

				router.replace('/(tabs)/dashboard');
			} catch (loginErr: unknown) {
				let errorMessage =
					'Ocurrió un error inesperado en el login automático. Inténtalo de nuevo.';
				if (isAPIError(loginErr)) {
					errorMessage = loginErr.messages.join(', ');
				} else if (loginErr instanceof Error) {
					errorMessage = loginErr.message;
				}
				console.error('Error en login automático:', loginErr);
				showToast('error', 'Error', errorMessage);
				setTimeout(() => router.replace('/(auth)/login'), 2000);
			}
		} catch (error: unknown) {
			let errorMessage =
				'Ocurrió un error inesperado al confirmar el correo. Inténtalo de nuevo.';
			if (isAPIError(error)) {
				errorMessage = error.messages.join(', ');
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}
			console.error('Error al confirmar o iniciar sesión:', error);
			showToast('error', 'Error', errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendCode = () => {
		showToast(
			'success',
			'Código reenviado',
			'Se ha reenviado el código de confirmación a tu correo.',
		);
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
				<ToastNotification
					visible={toastState.visible}
					type={toastState.type}
					title={toastState.title}
					message={toastState.message}
					onClose={hideToast}
				/>

				<View className='items-center mb-8'>
					<Logo />
				</View>

				<View className='mb-16'>
					<ThemedText
						type='title'
						lightColor={Colors.light.tint}
						style={{
							fontFamily: Fonts.title,
							fontSize: 32,
							textAlign: 'center',
							lineHeight: 32,
						}}>
						CONFIRMA TU CORREO
					</ThemedText>
					<ThemedText
						type='title'
						lightColor={Colors.light.tint}
						style={{
							fontFamily: Fonts.title,
							fontSize: 32,
							textAlign: 'center',
							lineHeight: 32,
						}}>
						ELECTRÓNICO
					</ThemedText>
				</View>

				<Text className='text-gray-500 text-center mb-8 text-lg'>
					Te hemos enviado un código a tu correo electrónico.
				</Text>

				<View className='w-full max-w-xs mb-8'>
					<Text className='text-sm text-gray-500 mb-1 font-semibold'></Text>
					<CodeInput
						onComplete={(inputCode: string) => {
							setCode(inputCode);
						}}
					/>
				</View>

				<TouchableOpacity onPress={handleResendCode} className='mb-8'>
					<Text className='text-blue-500 font-semibold'>
						¿No recibiste el código? Reenviar
					</Text>
				</TouchableOpacity>

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
