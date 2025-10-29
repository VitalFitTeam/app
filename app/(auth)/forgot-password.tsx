import { Logo } from '@/components/auth/Logo';
import { CodeInput } from '@/components/CodeInput';
import { CustomAlert } from '@/components/CustomAlert';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { SecondaryButton } from '@/components/SecondaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ToastNotification } from '@/components/ToastNotification';
import { Colors } from '@/constants/theme';
import { ForgotPasswordSchema, type ForgotPasswordData } from '@/schemas/forgot-password';
import api from '@/services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SlidersVertical } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';

interface ApiErrorResponse {
	message?: string;
}

export default function ForgotPasswordScreen() {
	const [step, setStep] = useState<number>(1);
	const [email, setEmail] = useState<string>('');
	const [token, setToken] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState<'success' | 'error'>('success');
	const [toastTitle, setToastTitle] = useState('');
	const [toastMessage, setToastMessage] = useState('');
	const [customAlertVisible, setCustomAlertVisible] = useState(false);
	const [customAlertTitle, setCustomAlertTitle] = useState('');
	const [customAlertMessage, setCustomAlertMessage] = useState('');
	const router = useRouter();
	const params = useLocalSearchParams();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordData>({
		resolver: zodResolver(ForgotPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	const handleCancel = () => {
		if (params.from === 'settings') {
			router.back();
		} else {
			router.push('/(auth)/login');
		}
	};

	const titles = ['RECUPERA TU CONTRASEÑA', 'VERIFICAR CÓDIGO', 'NUEVA CONTRASEÑA'];
	const subtitles = [
		'Ingresa el correo electrónico asociado a la cuenta para recuperar tu contraseña',
		'Te hemos enviado un código a tu correo',
		'Ingresa tu nueva contraseña',
	];

	const handleSendEmail = async (): Promise<void> => {
		if (!email) {
			Alert.alert('Error', 'Por favor, ingresa tu correo.');
			return;
		}

		setIsLoading(true);
		try {
			await api.post('/auth/password/forgot', { email });
			setToastType('success');
			setToastTitle('Éxito');
			setToastMessage('Si el correo existe, se ha enviado un código de recuperación.');
			setToastVisible(true);
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

	const handleResetPassword = async (data: ForgotPasswordData): Promise<void> => {
		setIsLoading(true);
		try {
			await api.post('/auth/password/reset', {
				token,
				password: data.password,
				confirm_password: data.confirmPassword,
			});
			setCustomAlertTitle('¡Éxito!');
			setCustomAlertMessage('Tu contraseña ha sido restablecida correctamente.');
			setCustomAlertVisible(true);
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
			<KeyboardAvoidingView
				style={{ flex: 1, width: '100%', alignItems: 'center' }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
				<ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
					<View style={styles.formContainer}>
						<Logo />
						<ThemedText
							type='title'
							lightColor={Colors.light.tint}
							style={styles.title}>
							{titles[step - 1]}
						</ThemedText>
						<Text className='text-gray-500 text-center mb-8 text-lg'>
							{subtitles[step - 1]}
						</Text>

						<ProgressIndicator currentStep={step} />

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
								<SecondaryButton
									title='Cancelar'
									onPress={handleCancel}
									style={{ marginTop: 12 }}
								/>
							</>
						)}

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
									onPress={handleCancel}
									style={{ marginTop: 12 }}
								/>
							</>
						)}

						{step === 3 && (
							<>
								<Controller
									control={control}
									name='password'
									render={({ field: { onChange, onBlur, value } }) => (
										<StyledTextInput
											label='Nueva contraseña'
											isPasswordInput
											icon={
												<SlidersVertical
													size={16}
													color={Colors.light.icon}
												/>
											}
											value={value}
											onBlur={onBlur}
											onChangeText={onChange}
											error={errors.password?.message}
										/>
									)}
								/>
								<Controller
									control={control}
									name='confirmPassword'
									render={({ field: { onChange, onBlur, value } }) => (
										<StyledTextInput
											label='Confirmar contraseña'
											isPasswordInput
											icon={
												<SlidersVertical
													size={16}
													color={Colors.light.icon}
												/>
											}
											value={value}
											onBlur={onBlur}
											onChangeText={onChange}
											error={errors.confirmPassword?.message}
										/>
									)}
								/>
								<PrimaryButton
									title={isLoading ? 'Guardando...' : 'Guardar'}
									onPress={handleSubmit(handleResetPassword)}
									disabled={isLoading}
								/>
								<SecondaryButton
									title='Cancelar'
									onPress={handleCancel}
									style={{ marginTop: 12 }}
								/>
							</>
						)}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			<ToastNotification
				type={toastType}
				title={toastTitle}
				message={toastMessage}
				visible={toastVisible}
				onClose={() => setToastVisible(false)}
			/>
			<CustomAlert
				visible={customAlertVisible}
				title={customAlertTitle}
				message={customAlertMessage}
				onConfirm={() => {
					setCustomAlertVisible(false);
					router.push('/(auth)/login');
				}}
			/>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', paddingTop: 80, backgroundColor: 'white' },
	scrollView: {
		width: '100%',
	},
	scrollContent: {
		flexGrow: 1,
		alignItems: 'center',
		paddingTop: 0,
		paddingBottom: 40,
	},
	formContainer: {
		width: '100%',
		maxWidth: 384,
		paddingHorizontal: 24,
		alignItems: 'center',
		gap: 16,
	},
	title: { fontSize: 28, textAlign: 'center' },
});
