// RegisterScreen.tsx

import { Logo } from '@/components/auth/Logo';
import { Step1Gender } from '@/components/auth/register/Step1Gender';
import { Step2Credentials } from '@/components/auth/register/Step2Credentials';
import { Step3PersonalDetails } from '@/components/auth/register/Step3PersonalDetails';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ToastNotification } from '@/components/ToastNotification';
import { Colors, Fonts } from '@/constants/theme';
import { RegisterData, RegisterSchema, Step1Schema, Step2Schema } from '@/schemas/register';
import api from '@/services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [toast, setToast] = useState<{
		visible: boolean;
		type: 'success' | 'error';
		title: string;
		message: string;
	}>({
		visible: false,
		type: 'success',
		title: '',
		message: '',
	});

	const {
		control,
		handleSubmit,
		trigger,
		formState: { errors },
		getValues,
		setError,
	} = useForm<RegisterData>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: { acceptTerms: false },
	});

	const handleRegistration = async (data: RegisterData) => {
		console.log('📤 Enviando datos:', data);

		const allowedKeys = [
			'gender',
			'email',
			'password',
			'confirmPassword',
			'name',
			'lastName',
			'documentId',
			'birthDate',
			'phone',
			'acceptTerms',
		] as const;

		const cleanedData: Pick<RegisterData, (typeof allowedKeys)[number]> = Object.fromEntries(
			allowedKeys.map((key) => [key, data[key]]),
		) as Pick<RegisterData, (typeof allowedKeys)[number]>;

		try {
			const payload = {
				email: cleanedData.email,
				password: cleanedData.password,
				gender: cleanedData.gender,
				first_name: cleanedData.name,
				last_name: cleanedData.lastName,
				identity_document: cleanedData.documentId,
				birth_date: `${cleanedData.birthDate}`,
				phone: cleanedData.phone,
				profile_picture_url: '',
			};

			// 🔹 Registro del usuario
			await api.post('/auth/register', payload);

			// 🔹 Guardamos las credenciales temporalmente para el login post-activación
			await AsyncStorage.setItem('temp_email', cleanedData.email);
			await AsyncStorage.setItem('temp_password', cleanedData.password);

			console.log('✅ Registro exitoso, credenciales temporales guardadas.');

			// Mostrar toast de éxito
			setToast({
				visible: true,
				type: 'success',
				title: 'Revisa tu correo',
				message: 'Codigo enviado correctamente',
			});

			// Redirigir después de 2 segundos
			setTimeout(() => {
				router.replace('/(auth)/confirm-email');
			}, 2000);
		} catch (err) {
			const error = err as AxiosError<{ message?: string; error?: string }>;
			console.error('❌ Error al registrar:', error);

			if (error.response?.status === 409) {
				setToast({
					visible: true,
					type: 'error',
					title: 'Error al enviar el correo',
					message: 'Revisa el correo ingresado',
				});
			} else {
				const message =
					error.response?.data?.message ||
					error.response?.data?.error ||
					'Revisa el correo ingresado';
				setToast({
					visible: true,
					type: 'error',
					title: 'Error al enviar el correo',
					message: message,
				});
			}
		}
	};

	const onSubmitPress = handleSubmit(handleRegistration);

	const nextStep = async () => {
		const fieldsToValidate: (keyof RegisterData)[] =
			step === 1 ? ['gender'] : ['email', 'password', 'confirmPassword'];

		await trigger(fieldsToValidate);

		const currentSchema = step === 1 ? Step1Schema : Step2Schema;
		const values = getValues();

		const result = currentSchema.safeParse(values);

		if (result.success) {
			setStep(step + 1);
		} else {
			result.error.issues.forEach((issue) => {
				setError(issue.path[0] as keyof RegisterData, {
					type: 'manual',
					message: issue.message,
				});
			});
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.keyboardView}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps='handled'
				showsVerticalScrollIndicator={false}>
				<ThemedView style={styles.container}>
					<ToastNotification
						type={toast.type}
						title={toast.title}
						message={toast.message}
						visible={toast.visible}
						onClose={() => setToast({ ...toast, visible: false })}
					/>
					<View style={styles.formContainer}>
						<Logo />
						{step === 1 && (
							<ThemedText style={[styles.mainTitle, { fontFamily: Fonts.title }]}>
								¿CUÁL ES TU GÉNERO?
							</ThemedText>
						)}
						{step === 2 && (
							<>
								<ThemedText style={[styles.mainTitle, { fontFamily: Fonts.title }]}>
									CREA TU CUENTA
								</ThemedText>
								<Text className='text-gray-500 text-center mb-8 text-lg'>
									Ingresa tus credenciales para registrarte
								</Text>
							</>
						)}
						{step === 3 && (
							<Text className='text-gray-500 text-center mb-8 text-lg'>
								Completa tus datos para crear tu cuenta
							</Text>
						)}

						<View style={styles.stepContainer}>
							{step === 1 && (
								<Step1Gender
									control={control}
									errors={errors}
									onNextStep={nextStep}
								/>
							)}
							{step === 2 && (
								<Step2Credentials
									control={control}
									errors={errors}
									onNextStep={nextStep}
								/>
							)}
							{step === 3 && (
								<Step3PersonalDetails
									control={control}
									errors={errors}
									onSubmit={onSubmitPress}
								/>
							)}
						</View>

						<View style={styles.footer}>
							<Link href='/(auth)/login'>
								<Text style={styles.footerText}>
									¿Ya tienes una cuenta?
									<Text style={styles.footerLink}> Iniciar sesión</Text>
								</Text>
							</Link>
						</View>
					</View>
				</ThemedView>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	keyboardView: {
		flex: 1,
		backgroundColor: 'white',
	},
	scrollContent: {
		flexGrow: 1,
	},
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: 'white',
		paddingTop: 60,
	},
	formContainer: {
		width: '100%',
		maxWidth: 384,
		paddingHorizontal: 24,
		alignItems: 'center',
		flex: 1,
	},
	stepContainer: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		gap: 16,
	},
	mainTitle: {
		fontSize: 32,
		marginBottom: 8,
		textAlign: 'center',
		color: '#F27F2A',
		lineHeight: 38,
	},
	footer: {
		marginTop: 'auto',
		paddingBottom: 40,
	},
	footerText: {
		color: '#5C5E60',
	},
	footerLink: {
		color: Colors.light.tint,
		fontWeight: '600',
	},
});
