import MembershipPlanCard from '@/components/auth/dashboard/MembershipPlanCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const membershipPlans = [
	{
		id: 'free-trial',
		title: 'FREE TRIAL',
		price: '0',
		features: ['7 días de acceso libres'],
		period: '',
		isFree: true,
		badgeLabel: 'Gratis',
	},
	{
		id: 'advanced',
		title: 'SUSCRIPCIÓN AVANZADA',
		price: '75',
		features: ['Más beneficios para tu vida fitness'],
		period: '/mes',
		isFree: false,
	},
	{
		id: 'athlete',
		title: 'PAQUETE ATLETA',
		price: '500',
		features: ['La mejor relación calidad-precio'],
		period: '/año',
		isFree: false,
	},
	{
		id: 'premium',
		title: 'SUSCRIPCIÓN AVANZADA',
		price: '105',
		features: ['Más beneficios para tu vida fitness'],
		period: '/3 meses',
		isFree: false,
	},
];

export default function MembershipsScreen() {
	const router = useRouter();
	const [selectedPlanId, setSelectedPlanId] = useState<string | null>(membershipPlans[0]?.id ?? null);
	const selectedPlan = membershipPlans.find(plan => plan.id === selectedPlanId);

	return (
		<SafeAreaView className='flex-1 bg-white'>
			<ImageBackground
				source={require('@/assets/images/chicafit.png')}
				className='flex-1'>
				<View className='flex-1'>
					<ScrollView className='flex-1'>
						<View className='flex-1'>
							<View className='w-full h-72 justify-end'>
								<View className='px-6 pb-6'>
									<View className='items-center'>
										<ThemedText
											lightColor='#f97316'
											darkColor='#f97316'
											className='text-lg tracking-[0.25em] mb-1 text-center'
											style={{ fontFamily: 'BebasNeue-Regular' }}>
											NUESTRAS
										</ThemedText>
										<ThemedText
											lightColor='#f97316'
											darkColor='#f97316'
											className='text-6xl mb-3 text-center'
											style={{ fontFamily: 'BebasNeue-Regular' }}>
											MEMBRESÍAS
										</ThemedText>
										<ThemedText
											lightColor='#ffffff'
											darkColor='#e5e7eb'
											className='text-sm px-2 text-center'
											style={{ fontFamily: 'Montserrat_400Regular' }}>
											Elige el plan que mejor se adapte a tus necesidades y objetivos de fitness.
										</ThemedText>
									</View>
								</View>
							</View>

							<View className='px-6 pt-6 pb-24'>
								{membershipPlans.map(plan => (
									<MembershipPlanCard
										key={plan.id}
										title={plan.title}
										price={plan.price}
										features={plan.features}
										period={plan.period}
										isFree={plan.isFree}
										badgeLabel={plan.badgeLabel}
										isSelected={selectedPlanId === plan.id}
										onPress={() => setSelectedPlanId(plan.id)}
									/>
								))}

								<View className='mt-4'>
									<PrimaryButton
										title={selectedPlan ? `Adquirir ${selectedPlan.title}` : 'Adquirir'}
										onPress={() => {
											if (!selectedPlan) return;
											const href =
												`/membership-checkout` +
												`?id=${selectedPlan.id}` +
												`&title=${encodeURIComponent(selectedPlan.title)}` +
												`&price=${selectedPlan.price}` +
												`&period=${encodeURIComponent(selectedPlan.period ?? '')}`;
											router.push(href as never);
										}}
									/>
								</View>
							</View>
						</View>
					</ScrollView>
				</View>
			</ImageBackground>
		</SafeAreaView>
	);
}
