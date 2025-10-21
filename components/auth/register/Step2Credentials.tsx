// components/auth/register/Step2Credentials.tsx
import { Colors } from '@/constants/theme';
import { RegisterData } from '@/schemas/register'; // Asegúrate de importar esto
import { SlidersVertical } from 'lucide-react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { PrimaryButton } from '../../PrimaryButton';
import { StyledTextInput } from '../../StyledTextInput';
import { SocialButton } from '../SocialButton';

interface Props {
	control: Control<RegisterData>;
	errors: FieldErrors<RegisterData>;
	onNextStep: () => void;
}

export function Step2Credentials({ control, errors, onNextStep }: Props) {
	return (
		<>
			<Controller
				control={control}
				name='email'
				render={({ field: { onChange, onBlur, value } }) => (
					<StyledTextInput
						label='Correo'
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						error={errors.email?.message}
					/>
				)}
			/>
			<Controller
				control={control}
				name='password'
				render={({ field: { onChange, onBlur, value } }) => (
					<StyledTextInput
						label='Contraseña'
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						error={errors.password?.message}
						isPasswordInput // Activa el ícono del ojo
						icon={<SlidersVertical size={16} color={Colors.light.icon} />}
					/>
				)}
			/>
			<Controller
				control={control}
				name='confirmPassword'
				render={({ field: { onChange, onBlur, value } }) => (
					<StyledTextInput
						label='Confirmar contraseña'
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						error={errors.confirmPassword?.message}
						isPasswordInput // Activa el ícono del ojo
						icon={<SlidersVertical size={16} color={Colors.light.icon} />}
					/>
				)}
			/>
			<PrimaryButton title='Continuar' onPress={onNextStep} />
			<SocialButton title='Sign in with Google' iconName='google' />
		</>
	);
}
