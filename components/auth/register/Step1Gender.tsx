import { RegisterData } from '@/schemas/register';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { PrimaryButton } from '../../PrimaryButton';
import { GenderSelector } from '../GenderSelector';

interface Props {
    control: Control<RegisterData>;
    errors: FieldErrors<RegisterData>;
    onNextStep: () => void;
}

export function Step1Gender({ control, errors, onNextStep }: Props) {
    const { t } = useTranslation();
    return (
        <>
            <Controller
                control={control}
                name='gender'
                render={({ field: { onChange } }) => <GenderSelector onSelect={onChange} />}
            />
            {errors.gender && <Text style={{ color: 'red' }}>{errors.gender.message}</Text>}
            <PrimaryButton title={t('register.continueButton')} onPress={onNextStep} />
        </>
    );
}