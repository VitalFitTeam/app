// components/auth/register/Step3PersonalDetails.tsx
import { Colors } from '@/constants/theme';
import { RegisterData } from '@/schemas/register';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
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
		<>
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

			{/*Campo con DateTimePicker para fecha de nacimiento */}
			<Controller
				control={control}
				name='birthDate'
				render={({ field: { onChange, value } }) => {
					const date = value ? new Date(value) : new Date();

					return (
						<View style={{ width: '100%' }}>
							<TouchableOpacity onPress={() => setShowPicker(true)}>
								<StyledTextInput
									label='Fecha de nacimiento'
									value={value ? format(date, 'yyyy-MM-dd') : ''}
									editable={false}
									pointerEvents='none'
									error={errors.birthDate?.message}
								/>
							</TouchableOpacity>
							{showPicker && (
								<DateTimePicker
									value={date}
									mode='date'
									display='default'
									onChange={(event, selectedDate) => {
										setShowPicker(false);
										if (selectedDate) {
											// Guardamos en formato ISO con zona horaria
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
				render={({ field: { onChange, onBlur, value } }) => (
					<StyledTextInput
						label='Teléfono'
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						error={errors.phone?.message}
						keyboardType='phone-pad'
					/>
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
		</>
	);
}
