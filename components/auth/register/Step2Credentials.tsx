import { Colors } from '@/constants/theme';
import { RegisterData } from '@/schemas/register';
import { SlidersVertical } from 'lucide-react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next'; // <---
import { PrimaryButton } from '../../PrimaryButton';
import { StyledTextInput } from '../../StyledTextInput';
import { SocialButton } from '../SocialButton';

interface Props {
    control: Control<RegisterData>;
    errors: FieldErrors<RegisterData>;
    onNextStep: () => void;
}

export function Step2Credentials({ control, errors, onNextStep }: Props) {
    const { t } = useTranslation();
    return (
        <>
            <Controller
                control={control}
                name='email'
                render={({ field: { onChange, onBlur, value } }) => (
                    <StyledTextInput
                        label={t('step2Credentials.emailLabel')}
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
                        label={t('step2Credentials.passwordLabel')}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.password?.message}
                        isPasswordInput
                        icon={<SlidersVertical size={16} color={Colors.light.icon} />}
                    />
                )}
            />
            <Controller
                control={control}
                name='confirmPassword'
                render={({ field: { onChange, onBlur, value } }) => (
                    <StyledTextInput
                        label={t('step2Credentials.confirmPasswordLabel')}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.confirmPassword?.message}
                        isPasswordInput
                        icon={<SlidersVertical size={16} color={Colors.light.icon} />}
                    />
                )}
            />
            <PrimaryButton title={t('step2Credentials.continueButton')} onPress={onNextStep} />
            <SocialButton title={t('step2Credentials.googleSignInButton')} iconName='google' />
        </>
    );
}