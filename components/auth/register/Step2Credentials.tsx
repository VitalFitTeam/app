// components/auth/register/Step2Credentials.tsx
import { RegisterData } from '@/schemas/register'; // Asegúrate de importar esto
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
  // ... el resto del componente se mantiene igual
  return (
    <>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledTextInput label="Correo" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.email?.message} />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledTextInput label="Contraseña" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.password?.message} secureTextEntry />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledTextInput label="Confirmar contraseña" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.confirmPassword?.message} secureTextEntry />
        )}
      />
      <PrimaryButton title="Continuar" onPress={onNextStep} />
      <SocialButton title="Sign in with Google" iconName="google" />
    </>
  );
}