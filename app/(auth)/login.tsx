// app/(auth)/login.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import { Link, useRouter } from 'expo-router';
import { Eye, EyeOff, SlidersVertical } from 'lucide-react-native';
import { useState } from 'react';
import {
	Alert,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native'; // <ScrollView> removed

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
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	//  Manejo de login con backend ---
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

			// Guarda el token JWT de la respuesta
			const token = response.data?.access_token || response.data?.token;
			if (token) {
				await AsyncStorage.setItem('token', token);
				console.log('Token guardado en AsyncStorage');
			} else {
				console.warn('No se recibió token en la respuesta del backend.');
			}

			// Redirigir al dashboard
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

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View // Reemplazado ScrollView por View
					style={{
						flex: 1, // Añadir flex: 1 para ocupar todo el espacio
						justifyContent: 'center',
						paddingHorizontal: 32,
						paddingVertical: 16,
					}}
					className='bg-white'>
					<View className='w-full max-w-sm self-center'>
						{/* Logo */}
						<View className='items-center mb-2'>
							<LogoSimple size={250} />
						</View>

						{/* Título */}
						<Text
							className='text-4xl text-black mb-2 uppercase text-center'
							style={{ fontFamily: Fonts.title }}>
							Iniciar Sesión
						</Text>

						{/* Subtítulo */}
						<Text className='text-gray-500 text-center mb-8 text-lg'>
							Ingresa tus credenciales para iniciar sesión
						</Text>

						{/* Inputs */}
						<View className='px-2 mt-6 gap-6'>
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
								<View className='flex-row items-center mb-1 ml-1'>
									<SlidersVertical
										size={16}
										color={Colors.light.text}
										className='mr-2'
									/>
									<Text className='text-black font-bold text-sm'>Contraseña</Text>
								</View>
								<View className='flex-row items-center border border-gray-300 rounded-md px-4 py-3'>
									<TextInput
										placeholder='Ingresa tu contraseña'
										secureTextEntry={!showPassword}
										value={password}
										onChangeText={setPassword}
										className='flex-1'
									/>
									<TouchableOpacity
										onPress={() => setShowPassword(!showPassword)}>
										{showPassword ? (
											<EyeOff size={20} color={Colors.light.icon} />
										) : (
											<Eye size={20} color={Colors.light.icon} />
										)}
									</TouchableOpacity>
								</View>
							</View>
						</View>

						{/* Checkbox y link */}
						<View className='w-full flex-row justify-between items-center my-4'>
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
								<Text className='ml-2 text-gray-600 text-xs'>Mantener sesión</Text>
							</View>
							<Link href='/(auth)/forgot-password' asChild>
								<TouchableOpacity>
									<View className='flex-row items-center'>
										<Text className='text-xs text-gray-600'>
											¿Olvidaste tu contraseña?{' '}
										</Text>
										<Text className='text-[#F27F2A] font-semibold text-xs'>
											Recuperar
										</Text>
									</View>
								</TouchableOpacity>
							</Link>
						</View>

						{/* Botones */}
						<View className='gap-4 mb-4'>
							<PrimaryButton
								title={isLoading ? 'Iniciando...' : 'Iniciar sesión'}
								onPress={handleLogin}
								disabled={isLoading}
							/>
							<SocialButton title='Sign in with Google' iconName='google' />
						</View>

						{/* Registro (Margin ajustado) */}
						<View className='mt-1 flex-row justify-center items-center'>
							<Text className='text-gray-600'>¿No tienes cuenta aún? </Text>
							<Link href='/(auth)/register' asChild>
								<TouchableOpacity>
									<Text className='font-semibold text-[#F27F2A]'>Regístrate</Text>
								</TouchableOpacity>
							</Link>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}
