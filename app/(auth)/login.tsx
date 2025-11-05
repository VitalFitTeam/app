import { LogoSimple } from '@/components/auth/Logo';
import { SocialButton } from '@/components/auth/SocialButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ToastNotification } from '@/components/ToastNotification';
import { Colors, Fonts } from '@/constants/theme';
import { useToast } from '@/hooks/useToast';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import Checkbox from 'expo-checkbox';
import { Link, useRouter } from 'expo-router';
import { Eye, EyeOff, SlidersVertical } from 'lucide-react-native';
import { useState } from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
export default function LoginScreen() {
	const { toastState, showToast, hideToast } = useToast();
	const router = useRouter();
	const [isChecked, setChecked] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleLogin = async () => {
		if (!email || !password) {
			showToast('error', 'Error', 'Por favor, ingresa tu correo y contraseña.');
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			showToast('error', 'Error', 'Por favor, ingresa un correo electrónico válido.');
			return;
		}

		setIsLoading(true);

		try {
			const response = await vitalFitApi.auth.login({ email, password });
			console.log('Login exitoso:', response);

			// Guarda el token JWT de la respuesta
			const token = response.token;
			if (token) {
				await AsyncStorage.setItem('token', token);
				console.log('Token guardado en AsyncStorage');
			} else {
				console.warn('No se recibió token en la respuesta del SDK.');
			}

			const whoamiResponse = await vitalFitApi.user.WhoAmI(token);
			const role = whoamiResponse.user?.role?.name?.toLowerCase();

			if (role === 'instructor') {
				router.replace('/(instructor)/dashboard');
			} else if (role === 'recepcionist' || role === 'receptionist') {
				router.replace('/(recepcionist)/dashboard');
			} else {
				router.replace('/(tabs)/dashboard');
			}
		} catch (error: unknown) {
			let errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
			if (isAPIError(error)) {
				errorMessage = error.messages.join(', ');
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}
			console.error('Error en el login:', error);
			showToast('error', 'Error al iniciar sesión', errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						paddingHorizontal: 32,
						paddingVertical: 16,
					}}
					className='bg-white'>
					<ToastNotification
						visible={toastState.visible}
						type={toastState.type}
						title={toastState.title}
						message={toastState.message}
						onClose={hideToast}
					/>
					<View className='w-full max-w-sm self-center'>
						<View className='items-center mb-2'>
							<LogoSimple size={250} />
						</View>

						<Text
							className='text-4xl text-black mb-2 uppercase text-center'
							style={{ fontFamily: Fonts.title }}>
							Iniciar Sesión
						</Text>

						<Text className='text-gray-500 text-center mb-8 text-lg'>
							Ingresa tus credenciales para iniciar sesión
						</Text>

						<View className='px-2 mt-6 gap-6'>
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
									style={{ height: 48 }}
									className='border border-gray-300 rounded-md px-4'
								/>
							</View>

							<View className='mb-4'>
								<View className='flex-row items-center mb-1 ml-1'>
									<SlidersVertical
										size={16}
										color={Colors.light.text}
										className='mr-2'
									/>
									<Text className='text-black font-bold text-sm'>Contraseña</Text>
								</View>
								<View
									style={{ height: 48 }}
									className='flex-row items-center border border-gray-300 rounded-md px-4'>
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

						<View className='gap-4 mb-4'>
							<PrimaryButton
								title={isLoading ? 'Iniciando...' : 'Iniciar sesión'}
								onPress={handleLogin}
								disabled={isLoading}
							/>
							<SocialButton title='Sign in with Google' iconName='google' />
						</View>

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
