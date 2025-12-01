import { PrimaryButton } from '@/components/PrimaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedText } from '@/components/themed-text';
import { MembershipCheckoutData, MembershipCheckoutSchema } from '@/schemas/membership';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
	const params = useLocalSearchParams<{
		id?: string;
		title?: string;
		price?: string;
		period?: string;
	}>();
	const router = useRouter();
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [loading, setLoading] = useState(false);

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

	const onContinue = async () => {
		// 1. Validaciones del formulario local
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
			Alert.alert('Error', 'Faltan datos del plan seleccionado.');
			return;
		}

		setLoading(true);
		try {
			const token = await AsyncStorage.getItem('token');
			if (!token) {
				Alert.alert('Error', 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
				return;
			}

			// 2. Obtener datos necesarios (Usuario y Sucursal)
			// Usamos getBranchMap (Público) para evitar errores de permisos
			const [userResponse, branchesResponse] = await Promise.all([
				vitalFitApi.user.WhoAmI(token),
				vitalFitApi.public.getBranchMap(token),
			]);

			// CORRECCIÓN 1: user_id (Según types/user.ts)
			const userId = userResponse.user?.user_id;

			// CORRECCIÓN 2: Manejo seguro del ID de sucursal
			const firstBranch = branchesResponse.data?.[0];

			// Usamos 'as any' para evitar el error de TypeScript si la definición local no está actualizada.
			// Buscamos 'branch_id' (estándar del SDK) o 'id' como respaldo.
			const branchObj = firstBranch as any;
			const branchId = branchObj?.branch_id || branchObj?.id || branchObj?.branch_map_id;

			if (!userId) {
				throw new Error('No se pudo identificar al usuario.');
			}
			if (!branchId) {
				throw new Error('No se encontró una sucursal disponible para asignar la factura.');
			}

			// 3. Crear la factura (Invoice)
			const invoiceResponse = await vitalFitApi.billing.createInvoice(
				{
					branch_id: branchId,
					user_id: userId,
					items: [
						{
							item_id: params.id,
							item_type: 'membership',
							quantity: 1,
						},
					],
				},
				token,
			);

			// Obtener el ID de la factura de la respuesta de forma segura
			const responseData = invoiceResponse as any;
			const invoiceId = responseData.invoice_id || responseData.id || responseData.data?.id;

			if (!invoiceId) {
				console.error('Respuesta Invoice:', invoiceResponse);
				throw new Error('El servidor no devolvió el ID de la factura.');
			}

			// 4. Navegar al siguiente paso
			router.push({
				pathname: '/membership-extra', // Ajusta si vas directo al pago
				params: {
					id: params.id,
					title: params.title,
					price: params.price,
					startDate: data.startDate,
					invoiceId: invoiceId, // ID crucial para el pago
					branchId: branchId,
				},
			} as never);
		} catch (error) {
			console.error('Error en checkout:', error);
			const msg = error instanceof Error ? error.message : 'Inténtalo de nuevo.';

			const apiError = error as any;
			const apiMsg = apiError?.messages ? apiError.messages.join('\n') : msg;

			if (msg.includes('forbidden') || msg.includes('403')) {
				Alert.alert('Permiso denegado', 'No tienes permisos para realizar esta compra.');
			} else {
				Alert.alert('No se pudo crear la orden', apiMsg);
			}
		} finally {
			setLoading(false);
		}
	};

	const benefits = useMemo(() => {
		if (!params.id) return [];
		return PLAN_BENEFITS[params.id] ?? [];
	}, [params.id]);

	const currentStep: number = 1;

	return (
		<SafeAreaView className='flex-1 bg-white'>
			<ScrollView className='flex-1 px-6 pb-32 pt-8'>
				<View className='mb-6'>
					<ThemedText
						lightColor='#f97316'
						darkColor='#f97316'
						className='mb-4 text-center text-4xl'
						style={{ fontFamily: 'BebasNeue-Regular' }}>
						COMPRAR MEMBRESÍA
					</ThemedText>
					<View className='mb-4 flex-row items-center justify-between'>
						<View className='flex-1 items-center'>
							<View
								className={`mb-1 h-8 w-8 items-center justify-center rounded-full border ${
									currentStep === 1
										? 'border-orange-500 bg-orange-500'
										: 'border-neutral-400 bg-white'
								}`}>
								<ThemedText
									lightColor={currentStep === 1 ? '#ffffff' : '#111827'}
									darkColor={currentStep === 1 ? '#ffffff' : '#111827'}
									className='text-[10px] font-semibold'
									style={{ fontFamily: 'Montserrat_500Medium' }}>
									1
								</ThemedText>
							</View>
							<ThemedText
								lightColor={currentStep === 1 ? '#f97316' : '#111827'}
								darkColor={currentStep === 1 ? '#f97316' : '#111827'}
								className='text-center text-[11px]'
								style={{ fontFamily: 'Montserrat_500Medium' }}>
								Opciones de producto
							</ThemedText>
						</View>
						<View className='flex-1 items-center'>
							<View
								className={`mb-1 h-8 w-8 items-center justify-center rounded-full border ${
									currentStep === 2
										? 'border-orange-500 bg-orange-500'
										: 'border-neutral-400 bg-white'
								}`}>
								<ThemedText
									lightColor={currentStep === 2 ? '#ffffff' : '#111827'}
									darkColor={currentStep === 2 ? '#ffffff' : '#111827'}
									className='text-[10px] font-semibold'
									style={{ fontFamily: 'Montserrat_500Medium' }}>
									2
								</ThemedText>
							</View>
							<ThemedText
								lightColor={currentStep === 2 ? '#f97316' : '#111827'}
								darkColor={currentStep === 2 ? '#f97316' : '#111827'}
								className='text-center text-[11px]'
								style={{ fontFamily: 'Montserrat_500Medium' }}>
								Métodos de pago
							</ThemedText>
						</View>
						<View className='flex-1 items-center'>
							<View
								className={`mb-1 h-8 w-8 items-center justify-center rounded-full border ${
									currentStep === 3
										? 'border-orange-500 bg-orange-500'
										: 'border-neutral-400 bg-white'
								}`}>
								<ThemedText
									lightColor={currentStep === 3 ? '#ffffff' : '#111827'}
									darkColor={currentStep === 3 ? '#ffffff' : '#111827'}
									className='text-[10px] font-semibold'
									style={{ fontFamily: 'Montserrat_500Medium' }}>
									3
								</ThemedText>
							</View>
							<ThemedText
								lightColor={currentStep === 3 ? '#f97316' : '#111827'}
								darkColor={currentStep === 3 ? '#f97316' : '#111827'}
								className='text-center text-[11px]'
								style={{ fontFamily: 'Montserrat_500Medium' }}>
								Confirmación de compra
							</ThemedText>
						</View>
					</View>
				</View>

				<View className='mb-6'>
					<View className='flex-row items-center justify-between'>
						<View className='mr-2 flex-1'>
							<ThemedText
								lightColor='#111827'
								darkColor='#ffffff'
								className='mb-1 text-xl'
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
							<View className='mr-3 items-end'>
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
									className='mt-[-4] text-xs'
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
						<View key={benefit} className='mb-3 flex-row items-center'>
							<CheckCircleIcon size={18} color='#F97316' />
							<ThemedText
								lightColor='#111827'
								darkColor='#e5e7eb'
								className='ml-2 text-sm'
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
						className='mb-2 text-sm'
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
								value={
									getValues('startDate')
										? format(new Date(getValues('startDate')), 'yyyy-MM-dd')
										: ''
								}
								editable={false}
								pointerEvents='none'
							/>
							<View style={{ position: 'absolute', right: 12, bottom: 12 }}>
								<Calendar size={20} color='#111827' />
							</View>
						</TouchableOpacity>
						{showDatePicker && (
							<DateTimePicker
								value={
									getValues('startDate')
										? new Date(getValues('startDate'))
										: new Date()
								}
								mode='date'
								display='default'
								minimumDate={new Date()}
								onChange={(_, selectedDate) => {
									setShowDatePicker(false);
									if (selectedDate) {
										setValue('startDate', selectedDate.toISOString(), {
											shouldValidate: true,
										});
										clearErrors('startDate');
									}
								}}
							/>
						)}
					</View>
				</View>

				<View className='mb-16'>
					{loading ? (
						<ActivityIndicator size='large' color='#f97316' />
					) : (
						<PrimaryButton title='Continuar' onPress={onContinue} />
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
