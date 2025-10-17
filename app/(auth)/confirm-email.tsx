import { PrimaryButton } from '@/components/PrimaryButton';
import { SecondaryButton } from '@/components/SecondaryButton';
import { Fonts } from '@/constants/theme'; // Asumiendo que estos existen
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

// Placeholder for the logo component if needed, or use an Image directly
// import { LogoSimple } from '@/components/auth/Logo';

export default function ConfirmEmailScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const [code, setCode] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Placeholder for the code input fields if we want to replicate the image's input style
	// For now, a single TextInput will suffice for simplicity.
	// In a real app, you'd likely have multiple inputs for each digit.

	const handleConfirmCode = async () => {
		if (!code) {
			// Basic validation
			alert('Por favor, ingresa el código de confirmación.');
			return;
		}

		setIsLoading(true);
		// TODO: Implement actual API call to verify the code
		console.log('Código ingresado:', code);

		try {
			// Example: await api.post('/auth/verify-email', { email: userEmail, code });
			// For now, we'll just navigate to the next step (e.g., login or dashboard)
			alert('¡Correo electrónico confirmado!');
			router.replace('/(tabs)/dashboard'); // Redirigir al dashboard
		} catch (error) {
			console.error('Error al confirmar el código:', error);
			alert('Hubo un error al confirmar el código. Inténtalo de nuevo.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendCode = () => {
		// TODO: Implement logic to resend the confirmation code
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
						source={require('../../assets/images/Component_7.png')} // Adjust path if necessary
						className='w-32 h-32' // Adjust size as needed
						resizeMode='contain'
					/>
				</View>

				{/* Title */}
				<Text
					className='text-3xl font-bold text-center mb-4'
					style={{ fontFamily: Fonts.title }} // Assuming Fonts.title is defined
				>
					Confirma tu Correo Electrónico
				</Text>

				{/* Message */}
				<Text className='text-lg text-gray-600 text-center mb-8'>
					Te hemos enviado un código a tu correo electrónico.
				</Text>

				{/* Code Input - Simplified for now */}
				<View className='w-full max-w-xs mb-8'>
					<Text className='text-sm text-gray-500 mb-1 font-semibold'>
						Código de confirmación
					</Text>
					<TextInput
						value={code}
						onChangeText={setCode}
						keyboardType='default' // Allow alphanumeric input
						autoComplete='off'
						autoCapitalize='none'
						className='border border-gray-300 rounded-lg px-4 py-3 text-center text-lg'
						style={{ fontFamily: Fonts.medium }} // Assuming Fonts.medium exists
						placeholder='----'
					/>
					{/* You might want to add more sophisticated input fields here for each digit */}
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
					<SecondaryButton
						title='Cancelar'
						onPress={() => router.back()} // Or navigate to a different screen
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
