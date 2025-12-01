import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import {
	MembershipPagoMovilPaymentData,
	MembershipPagoMovilPaymentSchema,
} from '@/schemas/membership';
import vitalFitApi from '@/services/vitalfitSdk'; // <--- Import del SDK
import AsyncStorage from '@react-native-async-storage/async-storage'; // <--- Import de Storage
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, View } from 'react-native'; // <--- Imports UI
import { ExclamationTriangleIcon } from 'react-native-heroicons/outline';
import PhoneInput, { IPhoneInputRef } from 'react-native-international-phone-number';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PaymentParams {
	id?: string;
	title?: string;
	price?: string;
	addonsJson?: string;
	branch?: string;
	invoiceId?: string; // <--- Agregamos invoiceId
}

interface SelectedAddon {
	id: string;
	title: string;
	price: number;
	sessionsIncluded?: number;
}

export default function MembershipPaymentPagoMovilScreen() {
	const router = useRouter();
	const rawParams = useLocalSearchParams();
	const params = rawParams as PaymentParams;
	const [loading, setLoading] = useState(false); // <--- Estado de carga

	const selectedAddons: SelectedAddon[] = useMemo(() => {
		if (!params.addonsJson) return [];
		try {
			const parsed = JSON.parse(params.addonsJson as string);
			if (Array.isArray(parsed)) return parsed as SelectedAddon[];
			return [];
		} catch {
			return [];
		}
	}, [params.addonsJson]);

	const basePrice = Number(params.price ?? '0') || 0;
	const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
	const totalPrice = basePrice + addonsTotal;

	const {
		getValues,
		setError,
		setValue,
		clearErrors,
		formState: { errors },
	} = useForm<MembershipPagoMovilPaymentData>({
		defaultValues: {
			id: params.id ?? '',
			title: params.title ?? '',
			price: params.price ?? '',
			branch: params.branch ?? '',
			addonsJson: params.addonsJson ?? '',
			reference: '',
			documentNumber: '',
			phone: '',
		},
	});

	const currentStep: number = 2; // Corregido a paso 2 según tu diseño visual

	const onConfirm = async () => {
		// <--- Convertimos a async
		const result = MembershipPagoMovilPaymentSchema.safeParse(getValues());

		if (!result.success) {
			result.error.issues.forEach((issue) => {
				const field = issue.path[0] as keyof MembershipPagoMovilPaymentData;
				setError(field, {
					type: 'manual',
					message: issue.message,
				});
			});
			return;
		}

		const data = result.data;

		// Validación de factura previa
		if (!params.invoiceId) {
			Alert.alert(
				'Error',
				'No se encontró la orden de compra. Por favor inicia el proceso nuevamente.',
			);
			return;
		}

		setLoading(true);
		try {
			const token = await AsyncStorage.getItem('token');
			if (!token) {
				Alert.alert('Error', 'Sesión expirada.');
				return;
			}

			// Llamada al endpoint para registrar el pago
			await vitalFitApi.billing.AddPaymentToInvoice(
				{
					invoice_id: params.invoiceId,
					payment_method_id: 'pago_movil', // ID o UUID del método de pago
					amount_paid: totalPrice, // Antes: amount
					transaction_id: data.reference, // Antes: reference
					currency_paid: 'USD', // Requerido: Moneda del pago
					receipt_url: '', // Requerido: URL del comprobante (vacío si no hay subida)
				},
				token,
			);

			// Éxito -> Navegar a confirmación
			router.push({
				pathname: '/membership-confirm',
				params: {
					id: data.id,
					title: data.title,
					price: data.price,
					branch: data.branch,
					method: 'pagomovil',
					addonsJson: data.addonsJson ?? '',
					invoiceId: params.invoiceId, // Pasamos el ID por si se necesita
				},
			} as never);
		} catch (error) {
			console.error('Error registrando pago:', error);
			Alert.alert(
				'Error',
				'No se pudo registrar el pago. Verifica los datos e inténtalo de nuevo.',
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView className='flex-1 bg-white'>
			<ScrollView className='flex-1 px-6 pb-32 pt-8'>
				{/* Header y pasos */}
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

				{/* Bloque instrucciones Pago Móvil */}
				<View className='mb-6 rounded-2xl border border-orange-500/80 bg-white px-4 py-3'>
					<ThemedText
						lightColor='#f97316'
						darkColor='#f97316'
						className='mb-1 text-xs tracking-[0.2em]'>
						REALIZA TU PAGO MÓVIL
					</ThemedText>
					<ThemedText
						lightColor='#4b5563'
						darkColor='#e5e7eb'
						className='mb-1 text-xs'
						style={{ fontFamily: 'Montserrat_400Regular' }}>
						Realiza el pago en la siguiente cuenta de VitalFit Cabudare.
					</ThemedText>
					<ThemedText
						lightColor='#4b5563'
						darkColor='#e5e7eb'
						className='text-[11px]'
						style={{ fontFamily: 'Montserrat_400Regular' }}>
						Debes hacer el pago del monto exacto, de lo contrario no se creará la orden.
					</ThemedText>
				</View>

				{/* Datos fijos de cuenta */}
				<View className='mb-6'>
					<View className='mb-4 flex-row'>
						<View className='mr-2 flex-1'>
							<ThemedText
								lightColor='#9ca3af'
								darkColor='#9ca3af'
								className='mb-1 text-[11px]'
								style={{ fontFamily: 'Montserrat_400Regular' }}>
								Titular
							</ThemedText>
							<View className='h-12 justify-center rounded-md border border-orange-500 bg-white px-3'>
								<ThemedText
									lightColor='#111827'
									darkColor='#e5e7eb'
									className='text-base'
									style={{ fontFamily: 'Montserrat_400Regular' }}>
									VitalFit Cabudare C.A
								</ThemedText>
							</View>
						</View>
						<View className='ml-2 flex-1'>
							<ThemedText
								lightColor='#9ca3af'
								darkColor='#9ca3af'
								className='mb-1 text-[11px]'
								style={{ fontFamily: 'Montserrat_400Regular' }}>
								Banco asociado
							</ThemedText>
							<View className='h-12 justify-center rounded-md border border-orange-500 bg-white px-3'>
								<ThemedText
									lightColor='#111827'
									darkColor='#e5e7eb'
									className='text-base'
									style={{ fontFamily: 'Montserrat_400Regular' }}>
									Banco de Venezuela
								</ThemedText>
							</View>
						</View>
					</View>

					<View className='mb-4 flex-row'>
						<View className='mr-2 flex-1'>
							<ThemedText
								lightColor='#9ca3af'
								darkColor='#9ca3af'
								className='mb-1 text-[11px]'
								style={{ fontFamily: 'Montserrat_400Regular' }}>
								RIF/DNI
							</ThemedText>
							<View className='h-12 justify-center rounded-md border border-orange-500 bg-white px-3'>
								<ThemedText
									lightColor='#111827'
									darkColor='#e5e7eb'
									className='text-sm'
									style={{ fontFamily: 'Montserrat_400Regular' }}>
									J-123456789
								</ThemedText>
							</View>
						</View>
						<View className='ml-2 flex-1'>
							<ThemedText
								lightColor='#9ca3af'
								darkColor='#9ca3af'
								className='mb-1 text-[11px]'
								style={{ fontFamily: 'Montserrat_400Regular' }}>
								Teléfono móvil
							</ThemedText>
							<View className='h-12 justify-center rounded-md border border-orange-500 bg-white px-3'>
								<ThemedText
									lightColor='#111827'
									darkColor='#e5e7eb'
									className='text-sm'
									style={{ fontFamily: 'Montserrat_400Regular' }}>
									0414-1234567
								</ThemedText>
							</View>
						</View>
					</View>
				</View>

				{/* Monto a pagar */}
				<LinearGradient
					colors={['#4F3521', '#F27F2A']}
					locations={[0.2, 0.9]}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 1 }}
					style={{
						borderRadius: 16,
						paddingHorizontal: 16,
						paddingVertical: 12,
						marginBottom: 24,
						flexDirection: 'row',
						alignItems: 'flex-end',
						justifyContent: 'space-between',
					}}>
					<View>
						<ThemedText
							lightColor='#ffffff'
							darkColor='#ffffff'
							className='mb-1 text-xs tracking-[0.2em]'>
							MONTO A PAGAR
						</ThemedText>
					</View>
					<View className='items-end'>
						<ThemedText
							lightColor='#ffffff'
							darkColor='#ffffff'
							className='text-2xl'
							style={{ fontFamily: 'Montserrat_700Bold' }}>
							${totalPrice.toFixed(2)}
						</ThemedText>
						<ThemedText
							lightColor='#e5e7eb'
							darkColor='#e5e7eb'
							className='mt-[-4] text-xs'
							style={{ fontFamily: 'Montserrat_500Medium' }}>
							/mes
						</ThemedText>
					</View>
				</LinearGradient>

				{/* Campos de referencia */}
				<View className='mb-8'>
					<ThemedText
						lightColor='#4b5563'
						darkColor='#e5e7eb'
						className='mb-2 text-sm'
						style={{ fontFamily: 'Montserrat_500Medium' }}>
						Referencia
					</ThemedText>
					{errors.reference?.message && (
						<Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
							{errors.reference.message}
						</Text>
					)}
					<View className='mb-5 h-12 justify-center rounded-md border border-orange-500 bg-white px-3'>
						<TextInput
							value={getValues('reference')}
							onChangeText={(text) => {
								setValue('reference', text, { shouldValidate: true });
								clearErrors('reference');
							}}
							placeholder='Ingrese la referencia'
							placeholderTextColor='#9CA3AF'
							className='text-base text-black'
						/>
					</View>

					<ThemedText
						lightColor='#4b5563'
						darkColor='#e5e7eb'
						className='mb-2 text-sm'
						style={{ fontFamily: 'Montserrat_500Medium' }}>
						Número de documento
					</ThemedText>
					{errors.documentNumber?.message && (
						<Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
							{errors.documentNumber.message}
						</Text>
					)}
					<View className='mb-5 h-12 justify-center rounded-md border border-orange-500 bg-white px-3'>
						<TextInput
							value={getValues('documentNumber')}
							onChangeText={(text) => {
								setValue('documentNumber', text, { shouldValidate: true });
								clearErrors('documentNumber');
							}}
							placeholder='Ingrese su número de documento'
							placeholderTextColor='#9CA3AF'
							className='text-base text-black'
						/>
					</View>

					<ThemedText
						lightColor='#4b5563'
						darkColor='#e5e7eb'
						className='mb-2 text-sm'
						style={{ fontFamily: 'Montserrat_500Medium' }}>
						Teléfono
					</ThemedText>
					{errors.phone?.message && (
						<Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
							{errors.phone.message}
						</Text>
					)}
					<View className='justify-center rounded-md border border-orange-500 bg-white px-2 py-1'>
						<PhoneInput
							ref={useRef<IPhoneInputRef | null>(null)}
							value={getValues('phone') || ''}
							onChangePhoneNumber={(phoneNumber) => {
								setValue('phone', phoneNumber, { shouldValidate: true });
								clearErrors('phone');
							}}
							defaultCountry='VE'
							placeholder='Número de teléfono'
							phoneInputStyles={{
								container: {
									backgroundColor: 'transparent',
									borderWidth: 0,
									height: 40,
								},
								flagContainer: {
									backgroundColor: 'transparent',
								},
								callingCode: {
									color: '#6b7280',
									fontSize: 14,
								},
								input: {
									color: '#111827',
									fontSize: 14,
								},
								divider: {
									backgroundColor: '#e5e7eb',
								},
							}}
						/>
					</View>
				</View>

				{/* Bloque importante */}
				<View className='mb-6 flex-row rounded-2xl border border-orange-500/80 bg-white px-4 py-3'>
					<View className='mr-3 mt-1'>
						<ExclamationTriangleIcon size={20} color='#f97316' />
					</View>
					<View className='flex-1'>
						<ThemedText
							lightColor='#f97316'
							darkColor='#f97316'
							className='mb-1 text-xs font-semibold'
							style={{ fontFamily: 'Montserrat_600SemiBold' }}>
							Importante
						</ThemedText>
						<ThemedText
							lightColor='#4b5563'
							darkColor='#e5e7eb'
							className='text-[11px]'
							style={{ fontFamily: 'Montserrat_400Regular' }}>
							Asegúrate de incluir el monto exacto. Guarda el comprobante de la
							transacción.
						</ThemedText>
					</View>
				</View>

				<View className='mb-16'>
					{loading ? (
						<ActivityIndicator size='large' color='#f97316' />
					) : (
						<PrimaryButton title='Confirmar pago' onPress={onConfirm} />
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
