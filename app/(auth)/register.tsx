import { Logo } from '@/components/auth/Logo';
import { Step1Gender } from '@/components/auth/register/Step1Gender';
import { Step2Credentials } from '@/components/auth/register/Step2Credentials';
import { Step3PersonalDetails } from '@/components/auth/register/Step3PersonalDetails';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { RegisterData, RegisterSchema, Step1Schema, Step2Schema } from '@/schemas/register';
import api from '@/services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
	const router = useRouter();
	const [step, setStep] = useState(1);

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

	const onSubmit = async (data: RegisterData) => {
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

			Alert.alert(
				'¡Registro exitoso!',
				'Verifica tu correo electrónico para continuar con la activación.',
			);
			router.replace('/(auth)/confirm-email');
		} catch (err) {
			const error = err as AxiosError<{ message?: string; error?: string }>;
			console.error('❌ Error al registrar:', error);

			if (error.response?.status === 409) {
				Alert.alert(
					'Error de registro',
					'Este correo electrónico ya está registrado. Por favor, inicia sesión o utiliza un correo diferente.',
				);
			} else {
				const message =
					error.response?.data?.message ||
					error.response?.data?.error ||
					'Hubo un error al registrar. Intenta nuevamente.';
				Alert.alert('Error de registro', message);
			}
		}
	};

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
		<ThemedView style={styles.container}>
			<View style={styles.formContainer}>
				<Logo />
				<ThemedText style={{ fontFamily: Fonts.title, ...styles.mainTitle }}>
					{step === 1 ? '¿CUÁL ES TU GÉNERO?' : 'CREA TU CUENTA'}
				</ThemedText>
				{step > 1 && (
					<ThemedText style={styles.subtitle}>
						{step === 2 ? 'Ingresa tus credenciales' : 'Ingresa tus datos personales'}
					</ThemedText>
				)}

				<View style={styles.stepContainer}>
					{step === 1 && (
						<Step1Gender control={control} errors={errors} onNextStep={nextStep} />
					)}
					{step === 2 && (
						<Step2Credentials control={control} errors={errors} onNextStep={nextStep} />
					)}
					{step === 3 && (
						<Step3PersonalDetails
							control={control}
							errors={errors}
							onSubmit={handleSubmit(onSubmit)}
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
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', backgroundColor: 'white', paddingTop: 60 },
	formContainer: {
		width: '100%',
		maxWidth: 384,
		paddingHorizontal: 24,
		alignItems: 'center',
		flex: 1,
	},
	stepContainer: { width: '100%', alignItems: 'center', gap: 16 },
	mainTitle: { fontSize: 32, marginBottom: 8, textAlign: 'center' },
	subtitle: { fontSize: 16, color: '#5C5E60', marginBottom: 24, textAlign: 'center' },
	footer: { marginTop: 'auto', paddingBottom: 40 },
	footerText: { color: '#5C5E60' },
	footerLink: { color: Colors.light.tint, fontWeight: '600' },
});
