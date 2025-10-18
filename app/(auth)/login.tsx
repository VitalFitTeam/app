// app/(auth)/login.tsx
import Checkbox from 'expo-checkbox';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	Alert,
	Keyboard,
	KeyboardAvoidingView,
	KeyboardEvent,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

// Componentes personalizados
import { LogoSimple } from '@/components/auth/Logo';
import { SocialButton } from '@/components/auth/SocialButton';
import { PrimaryButton } from '@/components/PrimaryButton';

// Temas y API
import { Colors, Fonts } from '@/constants/theme';
import api from '@/services/api';

export default function LoginScreen() {
	const router = useRouter();
	const [isChecked, setChecked] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// --- 🔐 Manejo de login con backend ---
	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			Alert.alert('Error', 'Por favor, ingresa un correo electrónico válido.');
			return;
		}

		setIsLoading(true);

		try {
			const response = await api.post('/auth/login', { email, password });
			console.log('Login exitoso:', response.data);
			// const { token } = response.data; // Guardar token si es necesario
			router.replace('/(tabs)/dashboard');
		} catch (error: unknown) {
			let errorMessage = 'No se pudo conectar al servidor. Inténtalo de nuevo.';
			if (typeof error === 'object' && error !== null && 'message' in error) {
				const err = error as {
					response?: { data?: { message?: string } };
					message: string;
				};
				errorMessage = err.response?.data?.message || err.message;
			}
			console.error('Error en el login:', errorMessage);
			Alert.alert('Error al iniciar sesión', errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	// --- ⌨️ Altura del teclado ---
	useEffect(() => {
		const showListener = Keyboard.addListener('keyboardDidShow', (e: KeyboardEvent) =>
			setKeyboardHeight(e.endCoordinates.height),
		);
		const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));

		return () => {
			showListener.remove();
			hideListener.remove();
		};
	}, []);

	// --- 🎨 UI principal (basada en el diseño estético del primero) ---
	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
						paddingBottom: keyboardHeight,
					}}
					keyboardShouldPersistTaps='handled'>
					<View className='flex-1 bg-white px-8 pt-16'>
						<View className='w-full max-w-sm self-center'>
							{/* Logo */}
							<View className='items-center mb-6'>
								<LogoSimple />
							</View>

							{/* Línea separadora */}
							<View className='h-[1px] w-full bg-gray-300 mb-6 bottom-20' />

							{/* Título */}
							<Text
								className='text-4xl text-black mb-2 uppercase text-center bottom-20'
								style={{ fontFamily: Fonts.title }}>
								Iniciar Sesión
							</Text>

							{/* Subtítulo */}
							<Text className='text-gray-500 text-center mb-8 text-lg bottom-20'>
								Ingresa tus credenciales para iniciar sesión
							</Text>

							{/* Inputs */}
							<View className='px-2 mt-6 gap-6 bottom-20'>
								{/* Correo */}
								<View className='mb-4'>
									<Text className='text-black font-bold text-sm mb-1 ml-1'>
										Correo electrónico
									</Text>
									<TextInput
										placeholder='Ingresa tu correo electrónico'
										value={email}
										onChangeText={setEmail}
										keyboardType='email-address'
										autoCapitalize='none'
										className='border border-gray-300 rounded-md px-4 py-3'
									/>
								</View>

								{/* Contraseña */}
								<View className='mb-4'>
									<Text className='text-black font-bold text-sm mb-1 ml-1'>
										Contraseña
									</Text>
									<TextInput
										placeholder='Ingresa tu contraseña'
										secureTextEntry
										value={password}
										onChangeText={setPassword}
										className='border border-gray-300 rounded-md px-4 py-3'
									/>
								</View>
							</View>

							{/* Checkbox y link */}
							<View className='w-full flex-row gap-4 items-center my-4 bottom-20'>
								<View className='flex-row items-center'>
									<Checkbox
										value={isChecked}
										onValueChange={setChecked}
										color={isChecked ? Colors.light.tint : undefined}
										style={{
											transform: [{ scale: 0.7 }],
											borderRadius: 5,
										}}
									/>
									<Text className='ml-2 text-gray-600 text-xs'>
										Mantener sesión
									</Text>
								</View>
								<Link href='/(auth)/forgot-password'>
									<View className='flex-row items-center gap-1'>
										<Text className='text-blue-500 font-semibold text-xs'>
											¿Olvidaste tu contraseña?
										</Text>
										<Text className='text-orange-500 text-xs'>Recuperar</Text>
									</View>
								</Link>
							</View>

							{/* Botones */}
							<View className='gap-4 mb-4 bottom-20'>
								<PrimaryButton
									title={isLoading ? 'Iniciando...' : 'Iniciar sesión'}
									onPress={handleLogin}
									disabled={isLoading}
								/>
								<SocialButton title='Sign in with Google' iconName='google' />
							</View>

							{/* Registro */}
							<View className='mt-8 flex-row justify-center bottom-20'>
								<Text className='text-gray-600'>
									¿No tienes cuenta aún?{' '}
									<Link href='/(auth)/register'>
										<Text className='text-blue-500 font-semibold'>
											Regístrate
										</Text>
									</Link>
								</Text>
							</View>
						</View>
					</View>
				</ScrollView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}


