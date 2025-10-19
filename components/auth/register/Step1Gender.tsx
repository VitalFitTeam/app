// components/auth/register/Step1Gender.tsx
import { RegisterData } from '@/schemas/register';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Text } from 'react-native';
import { PrimaryButton } from '../../PrimaryButton';
import { GenderSelector } from '../GenderSelector';

interface Props {
	control: Control<RegisterData>;
	errors: FieldErrors<RegisterData>;
	onNextStep: () => void;
}

export function Step1Gender({ control, errors, onNextStep }: Props) {
	return (
		<>
			<Controller
				control={control}
				name='gender'
				render={({ field: { onChange, value } }) => (
					<GenderSelector onSelect={onChange} selected={value} />
				)}
			/>

			{errors.gender && <Text style={{ color: 'red' }}>{errors.gender.message}</Text>}
			<PrimaryButton title='Continuar' onPress={onNextStep} />
		</>
	);
}
