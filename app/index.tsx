import { Montserrat_500Medium, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackgroundCarousel, SignInButton, SignUpButton } from '../components/auth/home';

import { Global } from 'iconsax-react-native';
export default function HomeScreen() {
	const [index, setIndex] = useState(0);
	const [fontsLoaded] = useFonts({
		Montserrat_500Medium,
		Montserrat_700Bold,
	});
	const insets = useSafeAreaInsets();
	const router = useRouter();

	if (!fontsLoaded) return null;

	return (
		<View className='flex-1 bg-black'>
			<StatusBar barStyle='light-content' backgroundColor='#000' />

			<BackgroundCarousel
				images={[
					require('../assets/images/slide1.jpg'),
					require('../assets/images/slide2.jpg'),
					require('../assets/images/slide3.jpg'),
				]}
				onIndexChange={setIndex}
			/>

			<View
				className='absolute inset-0 items-center justify-center'
				style={{ top: '-10%' }}
				pointerEvents='none'>
				<Image
					source={require('../assets/images/Component_7.png')}
					className='w-100 h-100'
					resizeMode='contain'
				/>
			</View>

			<LinearGradient
				colors={['transparent', 'rgba(0,0,0,0.7)', 'black']}
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					paddingBottom: insets.bottom + 32,
					paddingHorizontal: 24,
					paddingTop: 48,
				}}>
				<Text className='text-white text-[30px] font-montserrat-bold text-center leading-[36px] mb-6'>
					{
						[
							'Desafía tus límites,\nconquista tus metas',
							'La disciplina es el\ncamino al éxito',
							'Sé constante,\nsé imparable',
						][index]
					}
				</Text>

				<View className='flex-row justify-center mb-6'>
					{[0, 1, 2].map((i) => (
						<View
							key={i}
							className={`h-1.5 mx-2 rounded-full ${
								i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
							}`}
						/>
					))}
				</View>
				<TouchableOpacity
					className='flex-row items-center justify-center py-2 mb-4'
					onPress={() => router.push('/language')}>
					<Global color='white' size={16} variant='Outline' />
					<Text className='text-white ml-2 text-sm font-montserrat-medium'>Idioma</Text>
				</TouchableOpacity>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
						paddingHorizontal: 10,
						marginTop: 16,
					}}>
					<View style={{ flex: 1, marginRight: 8 }}>
						<SignInButton
							label='Acceder'
							onPress={() => router.push('/(auth)/login')}
						/>
					</View>

					<View style={{ flex: 1, marginLeft: 8 }}>
						<SignUpButton
							label='Registrarse'
							onPress={() => router.push('/(auth)/register')}
						/>
					</View>
				</View>
			</LinearGradient>
		</View>
	);
}
