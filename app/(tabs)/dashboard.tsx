import BirthdayOfferBanner from '@/components/auth/dashboard/BirthdayOfferBanner';
import ChallengesSection from '@/components/auth/dashboard/challengessection';
import CrossFitBanner from '@/components/auth/dashboard/CrossFitBanner';
import { MembershipCard } from '@/components/auth/dashboard/membershipcard';
import { QRModal } from '@/components/auth/dashboard/QRModal';
import { UpcomingClassesCarousel } from '@/components/auth/dashboard/upcomingclasses';
import { UpcomingRoutinesSection } from '@/components/auth/dashboard/upcomingroutines';
import { UserHeader } from '@/components/auth/dashboard/userheader';
import WeeklyChallengeBanner from '@/components/auth/dashboard/WeeklyChallengeBanner';
import { ThemedView } from '@/components/themed-view';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Text as RNText, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const [firstName, setFirstName] = useState<string | null>(null);
	const [lastName, setLastName] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [qrModalVisible, setQrModalVisible] = useState(false);
	const [userToken, setUserToken] = useState<string>('');
	const hasMembership = true;


	useEffect(() => {
		 
		const fetchUser = async () => {
			try {
				await new Promise(resolve => setTimeout(resolve, 3000));
				// Intentar obtener el token con retry logic
				let token = await AsyncStorage.getItem('token');

				// Si no hay token, esperar y reintentar
				if (!token) {
					console.log('Token no encontrado en primer intento, esperando...');
					await new Promise(resolve => setTimeout(resolve, 500));
					token = await AsyncStorage.getItem('token');
				}

				// Si aún no hay token, intentar una vez más
				if (!token) {
					console.log('Token no encontrado en segundo intento, esperando...');
					await new Promise(resolve => setTimeout(resolve, 500));
					token = await AsyncStorage.getItem('token');
				}

				if (!token) {
					console.error('No se encontró token en AsyncStorage después de reintentar');
					router.replace('/(auth)/login');
					return;
				}

				console.log('Token encontrado en AsyncStorage');
				setUserToken(token);

				const userData = await vitalFitApi.user.WhoAmI(token);
				setFirstName(userData?.user?.first_name || 'Usuario');
				setLastName(userData?.user?.last_name || null);
				console.log('Datos del usuario obtenidos correctamente');
			} catch (error: unknown) {
				let errorMessage = 'Ocurrió un error inesperado al obtener los datos del usuario.';
				if (isAPIError(error)) {
					errorMessage = error.messages.join(', ');
				} else if (error instanceof Error) {
					errorMessage = error.message;
				}
				console.error('Error en la solicitud whoami:', errorMessage);
				router.replace('/(auth)/login');
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			const onBackPress = () => {
				BackHandler.exitApp();
				return true;
			};

			const subscription = BackHandler.addEventListener(
				'hardwareBackPress',
				onBackPress
			);

			return () => subscription.remove();
		}, [])
	);

	// Datos mock - reemplazar con llamadas a la API cuando estén disponibles
	const mockChallenges = [
		{ id: '1', title: 'Retos completados', current: 2, total: 5, iconType: 'trophy' as const },
		{
			id: '2',
			title: 'Entrenamiento semanal',
			current: 8,
			total: 10,
			iconType: 'dumbbell' as const,
		},
		{ id: '3', title: 'Progreso', current: 4, total: 5, iconType: 'target' as const },
	];

	const mockClasses = [
		{
			id: '1',
			title: 'Hora',
			time: '07:00 - 08:00 AM',
			calories: '95 kcal',
			image: require('@/assets/images/rutina.png'),
		},
		{
			id: '2',
			title: 'Burn',
			time: '09:00 - 10:00 AM',
			calories: '120 kcal',
			image: require('@/assets/images/rutina.png'),
		},
		{
			id: '3',
			title: 'Hora',
			time: '11:00 - 12:00 PM',
			calories: '85 kcal',
			image: require('@/assets/images/rutina.png'),
		},
	];

	const mockRoutines = [
		{
			id: '1',
			title: 'DÍA 01',
			subtitle: 'Comienza a trotar',
			duration: '10 km, 4 semanas',
			image: require('@/assets/images/rutina.png'),
		},
	];

	if (loading) {
		return (
			<ThemedView className='flex-1 justify-center items-center bg-white dark:bg-neutral-950'>
				<ActivityIndicator size='large' color='#F27F2A' />
			</ThemedView>
		);
	}

	const displayName = lastName
		? `${firstName ?? 'Usuario'} ${lastName}`
		: firstName ?? 'Usuario';

	return (
		<ThemedView className='flex-1 bg-white dark:bg-neutral-950'>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingHorizontal: 16,
					paddingTop: Math.max(insets.top, 40),
					paddingBottom: Math.max(insets.bottom + 80, 120),
				}}>
				<UserHeader
					name={displayName}
					avatarUrl='https://randomuser.me/api/portraits/men/32.jpg'
					onBadgesPress={() => console.log('Abrir vista de medallas/insignias')}
				/>

				<ChallengesSection challenges={mockChallenges} />

				<MembershipCard
					hasMembership={hasMembership}
					daysRemaining={15}
					onQRPress={() => setQrModalVisible(true)}
					onGetMembershipPress={() => router.replace('/membership-entry')}
				/>

				{hasMembership && <UpcomingClassesCarousel classes={mockClasses} />}

				<UpcomingRoutinesSection
					mode={hasMembership ? 'member' : 'guest'}
					routines={mockRoutines}
					onPrimaryActionPress={(id) =>
						hasMembership
							? router.replace(`/routine/details?id=${id}`)
							: router.replace('/membership-entry')
					}
				/>

				{/* Banners adicionales */}
				{hasMembership ? (
					<View className='gap-3'>
						<BirthdayOfferBanner onPress={() => router.replace('/membership-entry')} />

						<WeeklyChallengeBanner
							onPress={() => console.log('Abrir challenge:', 'plank-challenge')}
						/>

						<BirthdayOfferBanner onPress={() => router.replace('/membership-entry')} />

						<CrossFitBanner
							imageSource={require('@/assets/images/crossfit.png')}
							title='CrossFit'
							onPress={() => console.log('Abrir challenge:', 'crossfit')}
						/>
					</View>
				) : (
					<>
						{/* Servicios ya viene de UpcomingRoutinesSection en modo guest */}
						<BirthdayOfferBanner onPress={() => router.replace('/membership-entry')} />

						<RNText style={{ color: '#111827', fontWeight: '700', fontSize: 18, marginTop: 16, marginBottom: 8 }}>
							Paquetes
						</RNText>
						<View className='gap-3 mb-4'>
							<CrossFitBanner
								imageSource={require('@/assets/images/rutina.png')}
								title='CrossFit - 4 sesiones'
								onPress={() => router.replace('/membership-entry')}
							/>
							<CrossFitBanner
								imageSource={require('@/assets/images/rutin.png')}
								title='CrossFit - 4 sesiones'
								onPress={() => router.replace('/membership-entry')}
							/>
						</View>
						<View className='gap-3'>
							<WeeklyChallengeBanner
								onPress={() => console.log('Abrir challenge:', 'plank-challenge')}
							/>
						</View>
					</>
				)}
			</ScrollView>

			<QRModal
				visible={qrModalVisible}
				onClose={() => setQrModalVisible(false)}
				token={userToken}
				userName={displayName}
			/>
		</ThemedView>
	);
}
