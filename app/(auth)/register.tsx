// app/(auth)/register.tsx

import { Logo } from '@/components/auth/Logo';
import { Step1Gender } from '@/components/auth/register/Step1Gender';
import { Step2Credentials } from '@/components/auth/register/Step2Credentials';
import { Step3PersonalDetails } from '@/components/auth/register/Step3PersonalDetails';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { RegisterData, RegisterSchema } from '@/schemas/register';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function RegisterScreen() {
	const router = useRouter();
	const [step, setStep] = useState(1);

	const { control, handleSubmit, trigger, formState: { errors } } = useForm<RegisterData>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: { acceptTerms: false },
	});

	const onSubmit = (data: RegisterData) => {
		console.log('Datos de registro completos:', data);
		Alert.alert('¡Registro Exitoso!', 'Tu cuenta ha sido creada.');
		router.push('/(tabs)');
	};

	const nextStep = async () => {
		const fieldsToValidate: (keyof RegisterData)[] = step === 1 ? ['gender'] : ['email', 'password', 'confirmPassword'];
		const isValid = await trigger(fieldsToValidate);
		if (isValid) setStep(step + 1);
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
                    {step === 1 && <Step1Gender control={control} errors={errors} onNextStep={nextStep} />}
                    {step === 2 && <Step2Credentials control={control} errors={errors} onNextStep={nextStep} />}
                    {step === 3 && <Step3PersonalDetails control={control} errors={errors} onSubmit={handleSubmit(onSubmit)} />}
                </View>

				<View style={styles.footer}>
					<Link href="/(auth)/login">
						<Text style={styles.footerText}>¿Ya tienes una cuenta?<Text style={styles.footerLink}> Iniciar sesión</Text></Text>
					</Link>
				</View>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', backgroundColor: 'white', paddingTop: 60 },
	formContainer: { width: '100%', maxWidth: 384, paddingHorizontal: 24, alignItems: 'center', flex: 1 },
	stepContainer: { width: '100%', alignItems: 'center', gap: 16 },
	mainTitle: { fontSize: 32, marginBottom: 8, textAlign: 'center' },
	subtitle: { fontSize: 16, color: '#5C5E60', marginBottom: 24, textAlign: 'center' },
	footer: { marginTop: 'auto', paddingBottom: 40 },
	footerText: { color: '#5C5E60' },
	footerLink: { color: Colors.light.tint, fontWeight: '600' },
});