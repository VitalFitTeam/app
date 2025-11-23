import { PrimaryButton } from '@/components/PrimaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedText } from '@/components/themed-text';
import { MembershipCheckoutData, MembershipCheckoutSchema } from '@/schemas/membership';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CheckCircleIcon, TrashIcon } from 'react-native-heroicons/solid';
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
	const params = useLocalSearchParams<{ id?: string; title?: string; price?: string; period?: string }>();
	const router = useRouter();
	const [showDatePicker, setShowDatePicker] = useState(false);

	const {
		getValues,
		setError,
		setValue,
		clearErrors,
		formState: { errors },
	} = useForm<MembershipCheckoutData>({
		defaultValues: {
			startDate: '',
		},
	});

	const onContinue = () => {
		const result = MembershipCheckoutSchema.safeParse(getValues());

		if (!result.success) {
			result.error.issues.forEach((issue) => {
				const field = issue.path[0] as keyof MembershipCheckoutData;
				setError(field, {
					type: 'manual',
					message: issue.message,
				});
			});
			return;
		}

		const data = result.data;

		if (!params.id || !params.title || !params.price) {
			return;
		}

		router.push({
			pathname: '/membership-extra',
			params: {
				id: params.id,
				title: params.title,
				price: params.price,
				startDate: data.startDate,
			},
		} as never);
	};

	const benefits = useMemo(() => {
		if (!params.id) return [];
		return PLAN_BENEFITS[params.id] ?? [];
	}, [params.id]);

	const currentStep: number = 1;

	return (
		<SafeAreaView className='flex-1 bg-white'>
			<ScrollView className='flex-1 px-6 pt-8 pb-32'>
				<View className='mb-6'>
					<ThemedText
						lightColor='#f97316'
						darkColor='#f97316'
						className='text-4xl mb-4 text-center'
						style={{ fontFamily: 'BebasNeue-Regular' }}>
						COMPRAR MEMBRESÍA
					</ThemedText>
					<View className='flex-row justify-between items-center mb-4'>
						<View className='items-center flex-1'>
							<View
								className={`w-8 h-8 rounded-full items-center justify-center mb-1 border ${
									currentStep === 1 ? 'bg-orange-500 border-orange-500' : 'bg-white border-neutral-400'
								}`}> 
								<ThemedText
									lightColor={currentStep === 1 ? '#ffffff' : '#111827'}
									darkColor={currentStep === 1 ? '#ffffff' : '#111827'}
									className='text-[10px] font-semibold'
									style={{ fontFamily: 'Montserrat_500Medium' }}
								>
									1
								</ThemedText>
							</View>
							<ThemedText
								lightColor={currentStep === 1 ? '#f97316' : '#111827'}
								darkColor={currentStep === 1 ? '#f97316' : '#111827'}
								className='text-[11px] text-center'
								style={{ fontFamily: 'Montserrat_500Medium' }}
							>
								Opciones de producto
							</ThemedText>
						</View>
						<View className='items-center flex-1'>
							<View
								className={`w-8 h-8 rounded-full items-center justify-center mb-1 border ${
									currentStep === 2 ? 'bg-orange-500 border-orange-500' : 'bg-white border-neutral-400'
								}`}> 
								<ThemedText
									lightColor={currentStep === 2 ? '#ffffff' : '#111827'}
									darkColor={currentStep === 2 ? '#ffffff' : '#111827'}
									className='text-[10px] font-semibold'
									style={{ fontFamily: 'Montserrat_500Medium' }}
								>
									2
								</ThemedText>
							</View>
							<ThemedText
								lightColor={currentStep === 2 ? '#f97316' : '#111827'}
								darkColor={currentStep === 2 ? '#f97316' : '#111827'}
								className='text-[11px] text-center'
								style={{ fontFamily: 'Montserrat_500Medium' }}
							>
								Métodos de pago
							</ThemedText>
						</View>
						<View className='items-center flex-1'>
							<View
								className={`w-8 h-8 rounded-full items-center justify-center mb-1 border ${
									currentStep === 3 ? 'bg-orange-500 border-orange-500' : 'bg-white border-neutral-400'
								}`}> 
								<ThemedText
									lightColor={currentStep === 3 ? '#ffffff' : '#111827'}
									darkColor={currentStep === 3 ? '#ffffff' : '#111827'}
									className='text-[10px] font-semibold'
									style={{ fontFamily: 'Montserrat_500Medium' }}
								>
									3
								</ThemedText>
							</View>
							<ThemedText
								lightColor={currentStep === 3 ? '#f97316' : '#111827'}
								darkColor={currentStep === 3 ? '#f97316' : '#111827'}
								className='text-[11px] text-center'
								style={{ fontFamily: 'Montserrat_500Medium' }}
							>
								Confirmación de compra
							</ThemedText>
						</View>
					</View>
				</View>

				<View className='mb-6'>
					<View className='flex-row items-center justify-between'>
						<View className='flex-1 mr-2'>
							<ThemedText
								lightColor='#111827'
								darkColor='#ffffff'
								className='text-xl mb-1'
								style={{ fontFamily: 'Montserrat_400Regular' }}>
									{params.title ?? 'Plan seleccionado'}
								</ThemedText>
							<ThemedText
								lightColor='#4b5563'
								darkColor='#d1d5db'
								className='text-xs'
								style={{ fontFamily: 'Montserrat_400Regular' }}>
									Más beneficios para tu vida fitness
								</ThemedText>
						</View>
						<View className='flex-row items-center'>
							<View className='items-end mr-3'>
								<ThemedText
									lightColor='#111827'
									darkColor='#ffffff'
									className='text-2xl'
									style={{ fontFamily: 'Montserrat_700Bold' }}>
									${params.price ?? '--'}
								</ThemedText>
								<ThemedText
									lightColor='#4b5563'
									darkColor='#d1d5db'
									className='text-xs mt-[-4]'
									style={{ fontFamily: 'Montserrat_500Medium' }}>
									{params.period ?? ''}
								</ThemedText>
							</View>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => router.back()}
								className='p-1'>
								<TrashIcon size={18} color='#111827' />
							</TouchableOpacity>
						</View>
					</View>
				</View>

				<View className='mb-6'>
					{benefits.map((benefit) => (
						<View key={benefit} className='flex-row items-center mb-3'>
							<CheckCircleIcon size={18} color='#F97316' />
							<ThemedText
								lightColor='#111827'
								darkColor='#e5e7eb'
								className='text-sm ml-2'
								style={{ fontFamily: 'Montserrat_400Regular' }}>
									{benefit}
							</ThemedText>
						</View>
					))}
				</View>
				
				<View className='mb-8'>
					<ThemedText
						lightColor='#111827'
						darkColor='#e5e7eb'
						className='text-sm mb-2'
						style={{ fontFamily: 'Montserrat_500Medium' }}>
						Fecha de inicio
					</ThemedText>
					{errors.startDate?.message && (
						<Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
							{errors.startDate.message}
						</Text>
					)}
					<View>
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={() => setShowDatePicker(true)}
							style={{ position: 'relative' }}>
							<StyledTextInput
								label={undefined}
								value={getValues('startDate') ? format(new Date(getValues('startDate')), 'yyyy-MM-dd') : ''}
								editable={false}
								pointerEvents='none'
							/>
							<View style={{ position: 'absolute', right: 12, bottom: 12 }}>
								<Calendar size={20} color='#111827' />
							</View>
						</TouchableOpacity>
						{showDatePicker && (
							<DateTimePicker
								value={getValues('startDate') ? new Date(getValues('startDate')) : new Date()}
								mode='date'
								display='default'
								minimumDate={new Date()}
								onChange={(_, selectedDate) => {
									setShowDatePicker(false);
									if (selectedDate) {
										setValue('startDate', selectedDate.toISOString(), { shouldValidate: true });
										clearErrors('startDate');
									}
								}}
							/>
						)}
					</View>
				</View>

				<View className='mb-16'>
					<PrimaryButton
						title='Continuar'
						onPress={onContinue}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
