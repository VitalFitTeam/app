// components/auth/register/Step3PersonalDetails.tsx
import { Colors } from '@/constants/theme';
import { RegisterData } from '@/schemas/register';
import Checkbox from 'expo-checkbox';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';
import { PrimaryButton } from '../../PrimaryButton';
import { StyledTextInput } from '../../StyledTextInput';

interface Props {
	control: Control<RegisterData>;
	errors: FieldErrors<RegisterData>;
	onSubmit: () => void;
}

export function Step3PersonalDetails({ control, errors, onSubmit }: Props) {
  return (
    <>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledTextInput
            label="Nombre"
            placeholder="Ej: Juan"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledTextInput
            label="Apellido"
            placeholder="Ej: Pérez"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.lastName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="documentId"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledTextInput
            label="Documento de identidad"
            placeholder="Ej: V-12345678"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.documentId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="birthDate"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledTextInput
            label="Fecha de nacimiento"
            placeholder="Ej: 20/04/1998"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.birthDate?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <StyledTextInput
            label="Teléfono"
            placeholder="Ej: +58 424-1234567"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.phone?.message}
            keyboardType="phone-pad"
          />
        )}
      />

      <Controller
        control={control}
        name="acceptTerms"
        render={({ field: { onChange, value } }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              gap: 8,
            }}
          >
            <Checkbox
              value={value}
              onValueChange={onChange}
              color={value ? Colors.light.tint : undefined}
            />
            <View style={{ width: '100%', alignItems: 'center', marginTop: 8 }}>
              <Text
                style={{
                  color: '#5C5E60',
                  textAlign: 'center',
                  lineHeight: 20,
                  fontSize:12,
                    paddingRight: 20,
                }}
              >
                Acepto los{' '}
                <Text style={{ color: Colors.light.tint, fontWeight: '600' }}>
                  términos y condiciones
                </Text>{' '}
                del servicio y las{' '}
                <Text style={{ color: Colors.light.tint, fontWeight: '600' }}>
                  políticas de seguridad
                </Text>
              </Text>
            </View>

          </View>
        )}
      />

      {errors.acceptTerms && (
        <Text style={{ color: 'red', alignSelf: 'flex-start' }}>
          {errors.acceptTerms.message}
        </Text>
      )}

      <PrimaryButton title="Crear cuenta" onPress={onSubmit} />
    </>
  );
}

