import { MonthCalendar } from '@/components/auth/dashboard/monthcalendar';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';

const PLAN_BENEFITS: Record<string, string[]> = {
	'free-trial': ['Acceso limitado al gimnasio', '7 días de acceso libre'],
	advanced: [
		'Acceso ilimitado al gimnasio',
		'7 sesiones con consultor fitness',
		'Seguimiento nutricional',
		'5 suplementos gratis',
		'Credencial de gimnasio',
		'Entrenador personal',
	],
	athlete: [
		'Acceso total al gimnasio',
		'Plan de entrenamiento personalizado',
		'Seguimiento de progreso mensual',
	],
	premium: [
		'Todos los beneficios del plan Avanzado',
		'Sesiones ilimitadas con consultor fitness',
		'Plan nutricional avanzado',
	],
};

export default function MembershipCheckoutScreen() {
	const params = useLocalSearchParams<{ id?: string; title?: string; price?: string }>();
	const router = useRouter();
	const [startDate, setStartDate] = useState('');

	const benefits = useMemo(() => {
		if (!params.id) return [];
		return PLAN_BENEFITS[params.id] ?? [];
	}, [params.id]);

	const currentStep: number = 1;

	return (
		<SafeAreaView className='flex-1 bg-black'>
			<ScrollView className='flex-1 px-6 pt-8 pb-32'>
				<View className='mb-6'>
					<ThemedText
						lightColor='#f97316'
						darkColor='#f97316'
						className='text-2xl font-extrabold mb-4 text-center'>
						COMPRAR MEMBRESÍA
					</ThemedText>
					<View className='flex-row justify-between items-center mb-4'>
						<View className='items-center flex-1'>
							<View
								className={`w-8 h-8 rounded-full items-center justify-center mb-1 ${
									currentStep === 1 ? 'bg-orange-500' : 'bg-white'
								}`}> 
								<ThemedText
									lightColor={currentStep === 1 ? '#ffffff' : '#000000'}
									darkColor={currentStep === 1 ? '#ffffff' : '#000000'}
									className='text-xs font-semibold'
								>
									1
								</ThemedText>
							</View>
							<ThemedText
								lightColor={currentStep === 1 ? '#f97316' : '#ffffff'}
								darkColor={currentStep === 1 ? '#f97316' : '#ffffff'}
								className='text-xs text-center'
							>
								Opciones de producto
							</ThemedText>
						</View>
						<View className='items-center flex-1'>
							<View
								className={`w-8 h-8 rounded-full items-center justify-center mb-1 ${
									currentStep === 2 ? 'bg-orange-500' : 'bg-white'
								}`}> 
								<ThemedText
									lightColor={currentStep === 2 ? '#ffffff' : '#000000'}
									darkColor={currentStep === 2 ? '#ffffff' : '#000000'}
									className='text-xs font-semibold'
								>
									2
								</ThemedText>
							</View>
							<ThemedText
								lightColor={currentStep === 2 ? '#f97316' : '#ffffff'}
								darkColor={currentStep === 2 ? '#f97316' : '#ffffff'}
								className='text-xs text-center'
							>
								Métodos de pago
							</ThemedText>
						</View>
						<View className='items-center flex-1'>
							<View
								className={`w-8 h-8 rounded-full items-center justify-center mb-1 ${
									currentStep === 3 ? 'bg-orange-500' : 'bg-white'
								}`}> 
								<ThemedText
									lightColor={currentStep === 3 ? '#ffffff' : '#000000'}
									darkColor={currentStep === 3 ? '#ffffff' : '#000000'}
									className='text-xs font-semibold'
								>
									3
								</ThemedText>
							</View>
							<ThemedText
								lightColor={currentStep === 3 ? '#f97316' : '#ffffff'}
								darkColor={currentStep === 3 ? '#f97316' : '#ffffff'}
								className='text-xs text-center'
							>
								Confirmación de compra
							</ThemedText>
						</View>
					</View>
				</View>

				<View className='mb-6'>
					<ThemedText
						lightColor='#f97316'
						darkColor='#f97316'
						className='text-xs tracking-[0.2em] mb-1'>
						SUSCRIPCIÓN
					</ThemedText>
					<View className='flex-row items-baseline justify-between'>
						<View className='flex-1 mr-2'>
							<ThemedText
								lightColor='#ffffff'
								darkColor='#ffffff'
								className='text-xl font-extrabold mb-1'>
								{params.title ?? 'Plan seleccionado'}
							</ThemedText>
							<ThemedText
								lightColor='#d1d5db'
								darkColor='#d1d5db'
								className='text-xs'>
								Más beneficios para tu vida fitness
							</ThemedText>
						</View>
						<View className='items-end'>
							<ThemedText
								lightColor='#ffffff'
								darkColor='#ffffff'
								className='text-2xl font-extrabold'>
								${params.price ?? '--'}
							</ThemedText>
							<ThemedText
								lightColor='#d1d5db'
								darkColor='#d1d5db'
								className='text-xs mt-[-4]'>
								/mes
							</ThemedText>
						</View>
					</View>
				</View>
				
				<View className='mb-6'>
					{benefits.map(benefit => (
						<View key={benefit} className='flex-row items-center mb-3'>
							<CheckCircleIcon size={18} color='#F97316' />
							<ThemedText
								lightColor='#e5e7eb'
								darkColor='#e5e7eb'
								className='text-sm ml-2'>
								{benefit}
							</ThemedText>
						</View>
					))}
				</View>
				
				<View className='mb-8'>
					<ThemedText
						lightColor='#e5e7eb'
						darkColor='#e5e7eb'
						className='text-sm mb-2'>
						Fecha de inicio
					</ThemedText>
					<View>
						<MonthCalendar
							initialDate={startDate || undefined}
							onDateSelect={(day) => {
								setStartDate(day.dateString);
							}}
						/>
					</View>
				</View>

				<View className='mb-16'>
					<PrimaryButton
						title='Continuar'
						onPress={() => {
							router.push({
								pathname: '/membership-extra',
								params: {
									id: params.id ?? '',
									title: params.title ?? '',
									price: params.price ?? '',
								},
							} as never);
						}}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
