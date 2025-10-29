import MembershipPlanCard from '@/components/auth/dashboard/MembershipPlanCard';
import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Datos de ejemplo para las membresías
const membershipPlans = [
	{
		title: 'Básico',
		price: '9.99',
		features: ['Acceso a contenido limitado', 'Descargas básicas', 'Calidad estándar'],
	},
	{
		title: 'Premium',
		price: '19.99',
		features: ['Acceso a contenido completo', 'Descargas ilimitadas', 'Calidad HD'],
		isRecommended: true,
	},
	{
		title: 'Ultimate',
		price: '29.99',
		features: ['Acceso a contenido exclusivo', 'Descargas premium', 'Calidad 4K'],
	},
];

export default function MembershipsScreen() {
	return (
		<SafeAreaView className='flex-1 bg-white dark:bg-neutral-950'>
			<ScrollView>
				<View className='p-6'>
					<ThemedText className='text-3xl font-bold mb-8'>Membresía</ThemedText>
					{membershipPlans.map((plan, index) => (
						<MembershipPlanCard
							key={index}
							title={plan.title}
							price={plan.price}
							features={plan.features}
							isRecommended={plan.isRecommended}
						/>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
