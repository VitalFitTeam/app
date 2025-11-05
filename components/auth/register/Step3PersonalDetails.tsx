// components/auth/register/Step3PersonalDetails.tsx
import { Colors } from '@/constants/theme';
import { RegisterData } from '@/schemas/register';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import Checkbox from 'expo-checkbox';
import { Calendar } from 'lucide-react-native';
import { useState } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PhoneInput from 'react-native-international-phone-number';
import { PrimaryButton } from '../../PrimaryButton';
import { StyledTextInput } from '../../StyledTextInput';

interface Props {
	control: Control<RegisterData>;
	errors: FieldErrors<RegisterData>;
	onSubmit: () => void;
}

export function Step3PersonalDetails({ control, errors, onSubmit }: Props) {
	const [showPicker, setShowPicker] = useState(false);

	return (
		<ScrollView
			style={{ width: '100%' }}
			contentContainerStyle={{
				alignItems: 'center',
				paddingVertical: 16,
				gap: 16,
			}}>
			<Controller
				control={control}
				name='name'
				render={({ field: { onChange, onBlur, value } }) => (
					<StyledTextInput
						label='Nombre'
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						error={errors.name?.message}
					/>
				)}
			/>
			<Controller
				control={control}
				name='lastName'
				render={({ field: { onChange, onBlur, value } }) => (
					<StyledTextInput
						label='Apellido'
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						error={errors.lastName?.message}
					/>
				)}
			/>
			<Controller
				control={control}
				name='documentId'
				render={({ field: { onChange, onBlur, value } }) => (
					<StyledTextInput
						label='Documento de identidad'
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						error={errors.documentId?.message}
					/>
				)}
			/>

			<Controller
				control={control}
				name='birthDate'
				render={({ field: { onChange, value } }) => {
					const date = value ? new Date(value) : new Date();

					return (
						<View style={{ width: '100%' }}>
							<TouchableOpacity
								onPress={() => setShowPicker(true)}
								style={{ position: 'relative' }}>
								<StyledTextInput
									label='Fecha de nacimiento'
									value={value ? format(date, 'yyyy-MM-dd') : ''}
									editable={false}
									pointerEvents='none'
									error={errors.birthDate?.message}
								/>
								<View
									style={{
										position: 'absolute',
										right: 12,
										bottom: 12,
									}}>
									<Calendar size={20} color={Colors.light.icon} />
								</View>
							</TouchableOpacity>
							{showPicker && (
								<DateTimePicker
									value={date}
									mode='date'
									display='default'
									onChange={(event, selectedDate) => {
										setShowPicker(false);
										if (selectedDate) {
											onChange(selectedDate.toISOString());
										}
									}}
								/>
							)}
						</View>
					);
				}}
			/>

			<Controller
				control={control}
				name='phone'
				render={({ field: { onChange, value, ref } }) => (
					<View style={{ width: '100%' }}>
						<Text style={styles.label}>Teléfono</Text>
						<PhoneInput
							ref={ref}
							value={value || ''}
							onChangePhoneNumber={(phone) => onChange(phone)}
							defaultCountry='VE'
							placeholder='Número de teléfono'
							phoneInputStyles={{
								container: styles.phoneContainer,
								flagContainer: styles.flagContainer,
								flag: styles.flag,
								caret: styles.caret,
								divider: styles.divider,
								callingCode: styles.callingCode,
								input: styles.phoneInput,
							}}
						/>
						{errors.phone && (
							<Text style={styles.errorText}>{errors.phone.message}</Text>
						)}
					</View>
				)}
			/>

			<Controller
				control={control}
				name='acceptTerms'
				render={({ field: { onChange, value } }) => (
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							width: '100%',
							gap: 8,
						}}>
						<Checkbox
							value={value}
							onValueChange={onChange}
							color={value ? Colors.light.tint : undefined}
						/>
						<Text style={{ color: '#5C5E60' }}>
							Acepto los{' '}
							<Text style={{ color: Colors.light.tint }}>términos y condiciones</Text>
						</Text>
					</View>
				)}
			/>
			{errors.acceptTerms && (
				<Text style={{ color: 'red', alignSelf: 'flex-start' }}>
					{errors.acceptTerms.message}
				</Text>
			)}

			<PrimaryButton title='Crear cuenta' onPress={onSubmit} />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	label: {
		fontSize: 14,
		fontWeight: '500',
		color: '#5C5E60',
		marginBottom: 8,
	},
	phoneContainer: {
		backgroundColor: '#F5F5F5',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#E0E0E0',
		paddingHorizontal: 12,
		height: 48,
	},
	flagContainer: {
		backgroundColor: 'transparent',
		justifyContent: 'center',
	},
	flag: {},
	caret: {
		color: '#5C5E60',
		fontSize: 16,
	},
	divider: {
		backgroundColor: '#E0E0E0',
	},
	callingCode: {
		color: '#1F2937',
		fontSize: 16,
		fontWeight: '500',
	},
	phoneInput: {
		color: '#1F2937',
		fontSize: 16,
	},
	errorText: {
		color: 'red',
		fontSize: 12,
		marginTop: 4,
	},
});
