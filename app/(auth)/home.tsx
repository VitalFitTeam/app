import { Montserrat_500Medium, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackgroundCarousel, SignInButton, SignUpButton } from '../../components/auth/home';

const SLIDES = [
	{
		image: require('../../assets/images/slide1.jpg'),
		text: 'Desafía tus límites,\nconquista tus metas',
	},
	{
		image: require('../../assets/images/slide2.jpg'),
		text: 'La disciplina es el\ncamino al éxito',
	},
	{
		image: require('../../assets/images/slide3.jpg'),
		text: 'Sé constante,\nsé imparable',
	},
];

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

			{/* Carrusel a pantalla completa */}
			<BackgroundCarousel images={SLIDES.map((s) => s.image)} onIndexChange={setIndex} />

			{/* Logo centrado */}
			<View
				className='absolute inset-0 items-center justify-center'
				style={{ top: '-10%' }}
				pointerEvents='none'>
				<Image
					source={require('../../assets/images/Component_7.png')}
					className='w-100 h-100'
					resizeMode='contain'
				/>
			</View>

			{/* Degradado inferior + contenido */}
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
				{/* Texto dinámico */}
				<Text className='text-white text-[30px] font-montserrat-bold text-center leading-[36px] mb-6'>
					{SLIDES[index].text}
				</Text>

				{/* Dots */}
				<View className='flex-row justify-center mb-6'>
					{SLIDES.map((_, i) => (
						<View
							key={i}
							className={`h-1.5 mx-2 rounded-full ${
								i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
							}`}
						/>
					))}
				</View>

				{/* Botones alineados y con separación uniforme */}
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
						paddingHorizontal: 10, // separación respecto a los bordes
						marginTop: 16,
					}}>
					<View style={{ flex: 1, marginRight: 8 }}>
						<SignInButton label='Acceder' onPress={() => router.push('/login')} />
					</View>

					<View style={{ flex: 1, marginLeft: 8 }}>
						<SignUpButton
							label='Registrarse'
							onPress={() => router.push('/register')}
						/>
					</View>
				</View>
			</LinearGradient>
		</View>
	);
}
