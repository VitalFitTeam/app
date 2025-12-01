 
import MembershipPlanCard from '@/components/auth/dashboard/MembershipPlanCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PublicMembershipResponse {
	membership_type_id: string;
	name: string;
	description: string;
	duration_days: number;
	price: number;
	base_currency: string;
	ref_price: string;
	ref_currency: string;
	is_active: boolean;
}

export default function MembershipsScreen() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [plans, setPlans] = useState<PublicMembershipResponse[]>([]);
	const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

	const selectedPlan = plans.find((plan) => plan.membership_type_id === selectedPlanId);

	useEffect(() => {
		const fetchMemberships = async () => {
			try {
				const token = await AsyncStorage.getItem('token');
				const jwt = token || '';

				const response = await vitalFitApi.membership.publicGetMemberships(
					jwt,
					{ page: 1, limit: 100, sort: 'asc' as const },
					'USD',
				);

				// CORRECCIÓN: Eliminado @ts-ignore innecesario
				const fetchedPlans = response.data || [];

				setPlans(fetchedPlans);

				if (fetchedPlans.length > 0) {
					setSelectedPlanId(fetchedPlans[0].membership_type_id);
				}
			} catch (error) {
				console.error('Error al obtener membresías:', error);
				Alert.alert('Error', 'No se pudieron cargar los planes de membresía.');
			} finally {
				setLoading(false);
			}
		};

		fetchMemberships();
	}, []);

	return (
		<SafeAreaView className='flex-1 bg-white'>
			<ImageBackground source={require('@/assets/images/chicafit.png')} className='flex-1'>
				<View className='flex-1'>
					<ScrollView className='flex-1'>
						<View className='flex-1'>
							<View className='h-72 w-full justify-end'>
								<View className='px-6 pb-6'>
									<View className='items-center'>
										<ThemedText
											lightColor='#f97316'
											darkColor='#f97316'
											className='mb-1 text-center text-lg tracking-[0.25em]'
											style={{ fontFamily: 'BebasNeue-Regular' }}>
											NUESTRAS
										</ThemedText>
										<ThemedText
											lightColor='#f97316'
											darkColor='#f97316'
											className='mb-3 text-center text-6xl'
											style={{ fontFamily: 'BebasNeue-Regular' }}>
											MEMBRESÍAS
										</ThemedText>
										<ThemedText
											lightColor='#ffffff'
											darkColor='#e5e7eb'
											className='px-2 text-center text-sm'
											style={{ fontFamily: 'Montserrat_400Regular' }}>
											Elige el plan que mejor se adapte a tus necesidades y
											objetivos de fitness.
										</ThemedText>
									</View>
								</View>
							</View>

							<View className='px-6 pb-24 pt-6'>
								{loading ? (
									<View className='items-center justify-center py-10'>
										<ActivityIndicator size='large' color='#f97316' />
									</View>
								) : (
									<>
										{plans.map((plan) => (
											<MembershipPlanCard
												key={plan.membership_type_id}
												title={plan.name}
												price={plan.price.toString()}
												features={[plan.description]}
												period={`/${plan.duration_days} días`}
												isFree={plan.price === 0}
												badgeLabel={plan.price === 0 ? 'Gratis' : undefined}
												isSelected={
													selectedPlanId === plan.membership_type_id
												}
												onPress={() =>
													setSelectedPlanId(plan.membership_type_id)
												}
											/>
										))}

										<View className='mt-4'>
											<PrimaryButton
												title={
													selectedPlan
														? `Adquirir ${selectedPlan.name}`
														: 'Adquirir'
												}
												onPress={() => {
													if (!selectedPlan) return;
													const href =
														`/membership-checkout` +
														`?id=${selectedPlan.membership_type_id}` +
														`&title=${encodeURIComponent(selectedPlan.name)}` +
														`&price=${selectedPlan.price}` +
														`&period=${encodeURIComponent(`${selectedPlan.duration_days} días`)}`;

													router.push(href as never);
												}}
											/>
										</View>
									</>
								)}
							</View>
						</View>
					</ScrollView>
				</View>
			</ImageBackground>
		</SafeAreaView>
	);
}
