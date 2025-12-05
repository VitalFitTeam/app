import { Colors } from '@/constants/theme';
import { RegisterData } from '@/schemas/register';
import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { SlidersVertical } from 'lucide-react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../PrimaryButton';
import { StyledTextInput } from '../../StyledTextInput';
import { SocialButton } from '../SocialButton';

WebBrowser.maybeCompleteAuthSession();

interface Props {
    control: Control<RegisterData>;
    errors: FieldErrors<RegisterData>;
    onNextStep: () => void;
    isSignedIn?: boolean;
}

export function Step2Credentials({ control, errors, onNextStep, isSignedIn }: Props) {
    const { t } = useTranslation();
    const router = useRouter();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const handleGoogleSignUp = async () => {
        console.log('🔵 handleGoogleSignUp llamado');
        try {
            console.log('🔵 Iniciando OAuth flow...');
            const { createdSessionId, setActive } = await startOAuthFlow();
            console.log('🔵 OAuth flow completado:', { createdSessionId });

            if (createdSessionId && setActive) {
                console.log('🔵 Activando sesión...');
                await setActive({ session: createdSessionId });
                console.log('🔵 Sesión activada, redirigiendo...');
            }

            router.push('/(auth)/register?oauth=google');
            console.log('🔵 Redirección ejecutada');
        } catch (err) {
            console.error('❌ OAuth error:', err);
        }
    };

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
            <PrimaryButton
                title={t('step2Credentials.continueButton')}
                onPress={onNextStep}
            />
            <SocialButton
                title={t('step2Credentials.googleSignInButton')}
                iconName='google'
                onPress={() => {
                    console.log('🟢 SocialButton presionado');
                    console.log('🟢 isSignedIn:', isSignedIn);
                    if (!isSignedIn) {
                        handleGoogleSignUp();
                    }
                }}
            />
        </>
    );
}