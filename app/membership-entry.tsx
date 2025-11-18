import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { CreditCardIcon, CubeIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MembershipEntryScreen() {
	const router = useRouter();

	return (
		<SafeAreaView className='flex-1 bg-black'>
			<ThemedView
				lightColor='#050816'
				darkColor='#050816'
				className='flex-1 px-6 pt-4 pb-4'>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View className='items-center mb-4'>
						<Image
							source={require('@/assets/images/Component_7.png')}
							style={{ width: 220, height: 120, marginBottom: 6 }}
							contentFit='contain'
						/>
						<ThemedText
							lightColor='#f97316'
							darkColor='#f97316'
							className='text-sm tracking-[0.18em] mt-1'>
							¿QUÉ DESEAS ADQUIRIR?
						</ThemedText>
					</View>

					<View className='gap-5'>
						<TouchableOpacity
								activeOpacity={0.9}
								className='rounded-3xl px-5 py-4'
								style={{ backgroundColor: '#f97316' }}
								onPress={() => {
									router.push('/memberships');
								}}>
							<View className='flex-row items-center mb-3'>
								<View
									className='w-8 h-8 rounded-full items-center justify-center mr-3'
									style={{ backgroundColor: 'rgba(0,0,0,0.12)' }}>
									<CreditCardIcon size={18} color='#ffffff' />
								</View>
								<View className='flex-1'>
									<ThemedText
										lightColor='#ffffff'
										darkColor='#ffffff'
										className='text-[13px] font-semibold'>
										COMPRAR UNA MEMBRESÍA
									</ThemedText>
									<ThemedText
										lightColor='#ffffff'
										darkColor='#ffffff'
										className='text-[10px] opacity-95'>
										Accede a todas las instalaciones y servicios del gimnasio.
									</ThemedText>
								</View>
							</View>
							<View className='ml-1'>
								<ThemedText
									lightColor='#ffffff'
									darkColor='#ffffff'
									className='text-[9px] mb-1'>
									• Acceso ilimitado
								</ThemedText>
								<ThemedText
									lightColor='#ffffff'
									darkColor='#ffffff'
									className='text-[9px] mb-1'>
									• Beneficios exclusivos
								</ThemedText>
								<ThemedText
									lightColor='#ffffff'
									darkColor='#ffffff'
									className='text-[9px]'>
									• Descuentos en servicios
								</ThemedText>
							</View>
						</TouchableOpacity>

						<TouchableOpacity
								activeOpacity={0.9}
								className='rounded-3xl px-5 py-4'
								style={{ backgroundColor: '#f97316' }}
								onPress={() => {
									router.push({
										pathname: '/membership-extra',
										params: {
											id: 'free-trial',
											title: 'Free Trial',
											price: '0',
										},
									} as never);
								}}>
							<View className='flex-row items-center mb-3'>
								<View
									className='w-8 h-8 rounded-full items-center justify-center mr-3'
									style={{ backgroundColor: 'rgba(0,0,0,0.12)' }}>
									<CubeIcon size={18} color='#ffffff' />
								</View>
								<View className='flex-1'>
									<ThemedText
										lightColor='#ffffff'
										darkColor='#ffffff'
										className='text-[13px] font-semibold'>
										COMPRAR UN SERVICIO/PAQUETE
									</ThemedText>
									<ThemedText
										lightColor='#ffffff'
										darkColor='#ffffff'
										className='text-[10px] opacity-95'>
										Adquiere paquetes de clases o servicios específicos.
									</ThemedText>
								</View>
							</View>
							<View className='ml-1'>
								<ThemedText
									lightColor='#ffffff'
									darkColor='#ffffff'
									className='text-[9px] mb-1'>
									• Paquetes de clases
								</ThemedText>
								<ThemedText
									lightColor='#ffffff'
									darkColor='#ffffff'
									className='text-[9px] mb-1'>
									• Entrenamiento personal
								</ThemedText>
								<ThemedText
									lightColor='#ffffff'
									darkColor='#ffffff'
									className='text-[9px]'>
									• Servicios individuales
								</ThemedText>
							</View>
						</TouchableOpacity>
					</View>

					<View className='mt-10'>
						<PrimaryButton
							title='Volver al inicio'
							onPress={() => router.back()}
						/>
					</View>
				</ScrollView>
			</ThemedView>
		</SafeAreaView>
	);
}
