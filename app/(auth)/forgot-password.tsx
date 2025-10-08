// app/(auth)/forgot-password.tsx

import { Logo } from '@/components/auth/Logo';
import { CodeInput } from '@/components/CodeInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { SecondaryButton } from '@/components/SecondaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

export default function ForgotPasswordScreen() {
	const [step, setStep] = useState(1);
	const router = useRouter();

	const titles = ['RECUPERA TU CONTRASEÑA', 'VERIFICAR CÓDIGO', 'NUEVA CONTRASEÑA'];
	const subtitles = [
		'Ingresa el correo electrónico asociado a la cuenta para recuperar tu contraseña',
		'Te hemos enviado un código a tu correo',
		'Ingresa tu nueva contraseña',
	];

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
						/>
						<PrimaryButton title='Ingresar' onPress={() => setStep(2)} />
					</>
				)}

				{/* ----- PASO 2: Verificar Código ----- */}
				{step === 2 && (
					<>
						<CodeInput
							onComplete={(code) => {
								console.log('Código ingresado:', code);
								setStep(3); // Avanza al siguiente paso al completar
							}}
						/>
						<PrimaryButton title='Ingresar' onPress={() => setStep(3)} />
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
						<StyledTextInput label='Contraseña' secureTextEntry />
						<StyledTextInput label='Confirmar contraseña' secureTextEntry />
						<PrimaryButton
							title='Ingresar'
							onPress={() => {
								Alert.alert('Éxito', 'Contraseña cambiada correctamente.');
								router.push('/(auth)/login');
							}}
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
