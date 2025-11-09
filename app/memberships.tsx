import MembershipPlanCard from '@/components/auth/dashboard/MembershipPlanCard';
import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const membershipPlans = [
	{
		title: 'Básico',
		price: '9.99',
		features: [
			'Acceso limitado al gimnasio',
			'Uso de equipo cardio',
			'Clases virtuales de introducción',
		],
	},
	{
		title: 'Fitness Total',
		price: '19.99',
		features: [
			'Acceso completo al gimnasio',
			'Clases grupales ilimitadas',
			'Acceso a la Zona de Pesas Libres',
		],
		isRecommended: true,
	},
	{
		title: 'Rendimiento Élite',
		price: '29.99',
		features: [
			'Acceso total y multi-sede',
			'Sesiones mensuales con entrenador personal',
			'Uso de áreas exclusivas',
		],
	},
];

export default function MembershipsScreen() {
	return (
		<SafeAreaView className='flex-1 bg-white dark:bg-neutral-950'>
			<ScrollView>
				<View className='p-6'>
					<Image
						source={{
							uri: 'https://blog.dema-argentina.com.ar/hs-fs/hubfs/Gimnasio.jpg?width=619&name=Gimnasio.jpg',
						}}
						className='w-full h-60 object-contain mb-6'
					/>
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
