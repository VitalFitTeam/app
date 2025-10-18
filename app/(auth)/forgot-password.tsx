import { LogoVitalFit } from '@/components/auth/Logo';
import { CodeInput } from '@/components/CodeInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { SecondaryButton } from '@/components/SecondaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import api from '@/services/api';
import { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

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
		'Ingresa el correo electrónico asociado a la cuenta para recuperar tu contraseña.',
		'Te hemos enviado un código a tu correo.',
		'Ingresa tu nueva contraseña.',
	];

	const handleSendEmail = async (): Promise<void> => {
		if (!email) {
			Alert.alert('Error', 'Por favor, ingresa tu correo.');
			return;
		}

		setIsLoading(true);
		try {
			setTimeout(() => {
				Alert.alert('Éxito', 'Código de recuperación enviado (modo demo).');
				setStep(2);
				setIsLoading(false);
			}, 1000);

			// Para hacerlo real:
			// await api.post('/auth/password/forgot', { email });
			// setStep(2);
		} catch (error) {
			const err = error as AxiosError<ApiErrorResponse>;
			const msg =
				err.response?.data?.message ||
				'Error al solicitar la recuperación. Intenta nuevamente.';
			Alert.alert('Error', msg);
			setIsLoading(false);
		}
	};

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
			<KeyboardAvoidingView
				style={styles.keyboardAvoidingView}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps='handled'>
					<LogoVitalFit />

					<ThemedText type='title' style={styles.title}>
						{titles[step - 1]}
					</ThemedText>
					<ThemedText style={styles.subtitle}>{subtitles[step - 1]}</ThemedText>

					<ProgressIndicator currentStep={step} />

					{/* PASO 1 */}
					{step === 1 && (
						<>
							<StyledTextInput
								label='Correo electrónico'
								placeholder='tucorreo@email.com'
								keyboardType='email-address'
								value={email}
								onChangeText={setEmail}
								returnKeyType='next'
							/>
							<PrimaryButton
								title={isLoading ? 'ENVIANDO...' : 'ENVIAR CÓDIGO'}
								onPress={handleSendEmail}
								disabled={isLoading}
								style={{ marginTop: 12 }}
							/>
						</>
					)}

					{/* PASO 2 */}
					{step === 2 && (
						<>
							<CodeInput
								onComplete={(code: string) => {
									setToken(code);
									setStep(3);
								}}
							/>
							<PrimaryButton
								title='VERIFICAR'
								onPress={() => setStep(3)}
								style={{ marginTop: 12 }}
							/>
							<SecondaryButton
								title='CANCELAR'
								onPress={() => setStep(1)}
								containerStyle={{
									marginTop: 12,
									backgroundColor: '#E0E0E0',
								}}
								textStyle={{
									color: '#333333',
									fontFamily: Fonts.title,
								}}
							/>
						</>
					)}

					{/* PASO 3 */}
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
								style={{ marginTop: 12 }}
							/>
							<PrimaryButton
								title={isLoading ? 'GUARDANDO...' : 'GUARDAR'}
								onPress={handleResetPassword}
								disabled={isLoading}
								style={{ marginTop: 12 }}
							/>
							<SecondaryButton
								title='CANCELAR'
								onPress={() => setStep(1)}
								containerStyle={{
									marginTop: 12,
									backgroundColor: '#E0E0E0',
								}}
								textStyle={{
									color: '#333333',
									fontFamily: Fonts.title,
								}}
							/>
						</>
					)}
				</ScrollView>
			</KeyboardAvoidingView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	keyboardAvoidingView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingTop: 40,
		paddingBottom: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 28,
		textAlign: 'center',
		color: Colors.light.tint,
		fontWeight: 'bold',
		textTransform: 'uppercase',
		marginBottom: 4,
		fontFamily: Fonts.title,
	},
	subtitle: {
		color: Colors.light.icon,
		textAlign: 'center',
		fontSize: 14,
		marginBottom: 12,
	},
});
