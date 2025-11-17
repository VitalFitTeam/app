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

export default function DashboardScreen() {
	const router = useRouter();
	const [firstName, setFirstName] = useState<string | null>(null);
	const [lastName, setLastName] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [qrModalVisible, setQrModalVisible] = useState(false);
	const [userToken, setUserToken] = useState<string>('');
	// TODO: reemplazar cuando exista endpoint real de membresía
	const hasMembership = true;

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = await AsyncStorage.getItem('token');
				if (!token) {
					console.error('No se encontró token en AsyncStorage');
					return;
				}

				setUserToken(token);

				const userData = await vitalFitApi.user.WhoAmI(token);
				setFirstName(userData?.user?.first_name || 'Usuario');
				setLastName(userData?.user?.last_name || null);
			} catch (error: unknown) {
				let errorMessage = 'Ocurrió un error inesperado al obtener los datos del usuario.';
				if (isAPIError(error)) {
					errorMessage = error.messages.join(', ');
				} else if (error instanceof Error) {
					errorMessage = error.message;
				}
				console.error('Error en la solicitud whoami:', errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
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
					paddingTop: 40,
					paddingBottom: 120,
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
					onGetMembershipPress={() => router.push('/memberships')}
				/>

				{hasMembership && <UpcomingClassesCarousel classes={mockClasses} />}

				<UpcomingRoutinesSection
					mode={hasMembership ? 'member' : 'guest'}
					routines={mockRoutines}
					onPrimaryActionPress={(id) =>
						hasMembership
							? router.push(`/routine/details?id=${id}`)
							: router.push('/memberships')
					}
				/>

				{/* Banners adicionales */}
				{hasMembership ? (
					<View className='gap-3'>
						<BirthdayOfferBanner onPress={() => console.log('Abrir vista de ofertas')} />

						<WeeklyChallengeBanner
							onPress={() => console.log('Abrir challenge:', 'plank-challenge')}
						/>

						<BirthdayOfferBanner onPress={() => console.log('Abrir vista de ofertas')} />

						<CrossFitBanner
							imageSource={require('@/assets/images/crossfit.png')}
							title='CrossFit'
							onPress={() => console.log('Abrir challenge:', 'crossfit')}
						/>
					</View>
				) : (
					<>
						{/* Servicios ya viene de UpcomingRoutinesSection en modo guest */}
						<BirthdayOfferBanner onPress={() => console.log('Abrir vista de ofertas')} />
						<RNText style={{ color: '#111827', fontWeight: '700', fontSize: 18, marginTop: 16, marginBottom: 8 }}>
							Paquetes
						</RNText>
						<View className='gap-3 mb-4'>
							<CrossFitBanner
								imageSource={require('@/assets/images/rutina.png')}
								title='CrossFit - 4 sesiones'
								onPress={() => router.push('/memberships')}
							/>
							<CrossFitBanner
								imageSource={require('@/assets/images/rutin.png')}
								title='CrossFit - 4 sesiones'
								onPress={() => router.push('/memberships')}
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
