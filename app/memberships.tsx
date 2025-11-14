import MembershipPlanCard from '@/components/auth/dashboard/MembershipPlanCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import React, { useState } from 'react';
import { ImageBackground, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const membershipPlans = [
	{
		id: 'free-trial',
		title: 'Free Trial',
		price: '0',
		features: ['7 días de prueba gratuita'],
	},
	{
		id: 'advanced',
		title: 'Suscripción Avanzada',
		price: '75',
		features: ['Más beneficios para tu vida fitness'],
	},
	{
		id: 'athlete',
		title: 'Paquete Atleta',
		price: '500',
		features: ['La mejor relación calidad-precio'],
	},
	{
		id: 'premium',
		title: 'Suscripción Premium',
		price: '105',
		features: ['Máximos beneficios para tu vida fitness'],
	},
];

export default function MembershipsScreen() {
	const [selectedPlanId, setSelectedPlanId] = useState<string | null>(membershipPlans[0]?.id ?? null);
	const selectedPlan = membershipPlans.find(plan => plan.id === selectedPlanId);

	return (
		<SafeAreaView className='flex-1 bg-black'>
			<ImageBackground
				source={require('@/assets/images/chicafit.png')}
				className='flex-1'>
				<View className='flex-1'>
					<ScrollView className='flex-1'>
						<View className='flex-1'>
							<View className='w-full h-72 justify-end'>
								<View className='px-6 pb-6 pt-8 items-center'>
									<ThemedText className='text-xs tracking-[0.25em] text-orange-400 mb-1 text-center'>
										NUESTRAS
									</ThemedText>
									<ThemedText className='text-4xl font-extrabold text-orange-400 mb-2 text-center'>
										Membresías
									</ThemedText>
									<ThemedText className='text-sm text-neutral-200 px-2 text-center'>
										Elige el plan que mejor se adapte a tus necesidades y objetivos de fitness.
									</ThemedText>
								</View>
							</View>

							<View className='px-6 pt-6 pb-24'>
								{membershipPlans.map(plan => (
									<MembershipPlanCard
										key={plan.id}
										title={plan.title}
										price={plan.price}
										features={plan.features}
										isSelected={selectedPlanId === plan.id}
										onPress={() => setSelectedPlanId(plan.id)}
									/>
								))}

								<View className='mt-4'>
									<PrimaryButton
										title={selectedPlan ? `Adquirir ${selectedPlan.title}` : 'Adquirir'}
										onPress={() => {
											if (!selectedPlan) return;
											console.log('Plan seleccionado para adquirir:', selectedPlan);
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
