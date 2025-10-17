import { Logo } from '@/components/auth/Logo';
import { CodeInput } from '@/components/CodeInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { SecondaryButton } from '@/components/SecondaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import api from '@/services/api';
import { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

// Tipado para errores del backend
interface ApiErrorResponse {
	message?: string;
}

export default function ForgotPasswordScreen() {
	const [step, setStep] = useState<number>(1);
	const [email, setEmail] = useState<string>('');
	const [token, setToken] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	const titles = ['RECUPERA TU CONTRASEÑA', 'VERIFICAR CÓDIGO', 'NUEVA CONTRASEÑA'];
	const subtitles = [
		'Ingresa el correo electrónico asociado a la cuenta para recuperar tu contraseña',
		'Te hemos enviado un código a tu correo',
		'Ingresa tu nueva contraseña',
	];

	// Paso 1: Solicitar envío de correo
	const handleSendEmail = async (): Promise<void> => {
		if (!email) {
			Alert.alert('Error', 'Por favor, ingresa tu correo.');
			return;
		}

		setIsLoading(true);
		try {
			await api.post('/auth/password/forgot', { email });
			Alert.alert('Éxito', 'Si el correo existe, se ha enviado un código de recuperación.');
			setStep(2);
		} catch (error) {
			const err = error as AxiosError<ApiErrorResponse>;
			console.error('Error al enviar correo:', err.message);
			const msg =
				err.response?.data?.message ||
				'Error al solicitar la recuperación. Intenta nuevamente.';
			Alert.alert('Error', msg);
		} finally {
			setIsLoading(false);
		}
	};

	// Paso 3: Enviar nueva contraseña al backend
	const handleResetPassword = async (): Promise<void> => {
		if (!password || !confirmPassword) {
			Alert.alert('Error', 'Completa todos los campos.');
			return;
		}
		if (password !== confirmPassword) {
			Alert.alert('Error', 'Las contraseñas no coinciden.');
			return;
		}

		setIsLoading(true);
		try {
			await api.post('/auth/password/reset', {
				token,
				password,
				confirm_password: confirmPassword,
			});
			Alert.alert('Éxito', 'Tu contraseña ha sido restablecida correctamente.');
			router.push('/(auth)/login');
		} catch (error) {
			const err = error as AxiosError<ApiErrorResponse>;
			console.error('Error al restablecer contraseña:', err.message);
			const msg =
				err.response?.data?.message ||
				'Error al restablecer la contraseña. Intenta nuevamente.';
			Alert.alert('Error', msg);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ThemedView style={styles.container}>
			<View style={styles.formContainer}>
				<Logo />
				<ThemedText type='title' style={styles.title}>
					{titles[step - 1]}
				</ThemedText>
				<ThemedText style={styles.subtitle}>{subtitles[step - 1]}</ThemedText>

				<ProgressIndicator currentStep={step} />

				{/* ----- PASO 1: Ingresar Correo ----- */}
				{step === 1 && (
					<>
						<StyledTextInput
							label='Correo electrónico'
							placeholder='tucorreo@email.com'
							keyboardType='email-address'
							value={email}
							onChangeText={setEmail}
						/>
						<PrimaryButton
							title={isLoading ? 'Enviando...' : 'Enviar código'}
							onPress={handleSendEmail}
							disabled={isLoading}
						/>
					</>
				)}

				{/* ----- PASO 2: Verificar Código ----- */}
				{step === 2 && (
					<>
						<CodeInput
							onComplete={(code: string) => {
								console.log('Código ingresado:', code);
								setToken(code);
								setStep(3);
							}}
						/>
						<PrimaryButton title='Verificar' onPress={() => setStep(3)} />
						<SecondaryButton
							title='Cancelar'
							onPress={() => setStep(1)}
							style={{ marginTop: 12 }}
						/>
					</>
				)}

				{/* ----- PASO 3: Nueva Contraseña ----- */}
				{step === 3 && (
					<>
						<StyledTextInput
							label='Nueva contraseña'
							secureTextEntry
							value={password}
							onChangeText={setPassword}
						/>
						<StyledTextInput
							label='Confirmar contraseña'
							secureTextEntry
							value={confirmPassword}
							onChangeText={setConfirmPassword}
						/>
						<PrimaryButton
							title={isLoading ? 'Guardando...' : 'Guardar'}
							onPress={handleResetPassword}
							disabled={isLoading}
						/>
						<SecondaryButton
							title='Cancelar'
							onPress={() => setStep(1)}
							style={{ marginTop: 12 }}
						/>
					</>
				)}
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', paddingTop: 80, backgroundColor: 'white' },
	formContainer: {
		width: '100%',
		maxWidth: 384,
		paddingHorizontal: 24,
		alignItems: 'center',
		gap: 16,
	},
	title: { fontSize: 28, textAlign: 'center' },
	subtitle: { color: '#5C5E60', textAlign: 'center' },
});
