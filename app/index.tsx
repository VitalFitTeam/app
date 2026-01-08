// app/index.tsx
import { Montserrat_500Medium, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { Global } from 'iconsax-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackgroundCarousel, SignInButton, SignUpButton } from '../components/auth/home';

export default function HomeScreen() {
	const [index, setIndex] = useState(0);
	const [fontsLoaded] = useFonts({
		Montserrat_500Medium,
		Montserrat_700Bold,
	});
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const { t } = useTranslation(); 


	const slideTexts = [t('slide1'), t('slide2'), t('slide3')];

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

				<Text className='mb-6 text-center font-heading text-[30px] leading-[36px] text-white'>
					{slideTexts[index]}
				</Text>

				<View className='mb-6 flex-row justify-center'>
					{[0, 1, 2].map((i) => (
						<View
							key={i}
							className={`mx-2 h-1.5 rounded-full ${
								i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
							}`}
						/>
					))}
				</View>

				<Link href='/language' asChild>
					<TouchableOpacity className='mb-4 flex-row items-center justify-center py-2'>
						<Global color='white' size={16} variant='Outline' />
						<Text className='ml-2 font-body text-sm text-white'>
							{t('languageLabel')}
						</Text>
					</TouchableOpacity>
				</Link>

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
							label={t('signIn')}
							onPress={() => router.replace('/(auth)/login')}
						/>
					</View>

					<View style={{ flex: 1, marginLeft: 8 }}>
						<SignUpButton
							label={t('signUp')}
							onPress={() => router.replace('/(auth)/register')}
						/>
					</View>
				</View>
			</LinearGradient>
		</View>
	);
}
