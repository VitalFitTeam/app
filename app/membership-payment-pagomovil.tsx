import { PrimaryButton } from '@/components/PrimaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedText } from '@/components/themed-text';
import { ToastNotification } from '@/components/ToastNotification';
import { useToast } from '@/hooks/useToast';
import vitalFitApi from '@/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { ExclamationTriangleIcon } from 'react-native-heroicons/outline';
import PhoneInput, { IPhoneInputRef } from 'react-native-international-phone-number';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MembershipPaymentPagoMovilScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const params = useLocalSearchParams<{
    invoiceId: string;
    totalAmount: string;
    methodId: string;
    methodName: string;
    currency: string;
  }>();

  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');
  const phoneInputRef = useRef<IPhoneInputRef | null>(null);

  const { toastState, showToast, hideToast } = useToast();

  const handleProcessPayment = async () => {
    if (!reference || !documentNumber || !phone) {
      showToast('warning', t('common.attention'), t('payment.toast.incompleteFields'));
      return;
    }

    if (reference.length < 4) {
      showToast('warning', t('common.attention'), t('payment.toast.invalidReference'));
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Sesión expirada');

      await vitalFitApi.billing.AddPaymentToInvoice({
        invoice_id: params.invoiceId,
        payment_method_id: params.methodId,
        amount_paid: Number(params.totalAmount),
        currency_paid: params.currency || 'VES', 
        transaction_id: reference,
        receipt_url: `CI: ${documentNumber} - Tlf: ${phone}` 
      }, token);

      showToast('success', t('payment.toast.paymentReported'), t('payment.toast.sentToVerification'));

      setTimeout(() => {
        router.replace('/(tabs)/dashboard');
      }, 2500);

    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : t('common.error.unknown');
      showToast('error', t('payment.toast.errorPayment'), `${t('common.error.unableToRegister')}: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ToastNotification
        visible={toastState.visible}
        type={toastState.type}
        title={toastState.title}
        message={toastState.message}
        onClose={hideToast}
      />

      <ScrollView className='flex-1 px-6 pt-6 pb-32'>
        
        <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='font-heading text-3xl mb-6 text-center'
            style={{ fontFamily: 'BebasNeue-Regular' }}
        >
            {t('payment.mobile.title')}
        </ThemedText>

        <View className='mb-6 border border-orange-500/80 rounded-2xl px-4 py-4 bg-orange-50'>
          <ThemedText className='font-body text-xs font-bold tracking-widest mb-3 text-orange-800 uppercase'>
            {t('payment.mobile.bankDetailsTitle')}
          </ThemedText>

          <View className='space-y-3'>
            <View className='flex-row justify-between border-b border-orange-200 pb-2'>
                <ThemedText className='font-body text-gray-600 text-sm'>{t('payment.mobile.bankLabels.bank')}</ThemedText>
                <ThemedText className='font-body font-bold text-gray-900'>Banco de Venezuela</ThemedText>
            </View>
            <View className='flex-row justify-between border-b border-orange-200 pb-2'>
                <ThemedText className='font-body text-gray-600 text-sm'>{t('payment.mobile.bankLabels.phone')}</ThemedText>
                <ThemedText className='font-body font-bold text-gray-900'>0414-1234567</ThemedText>
            </View>
            <View className='flex-row justify-between border-b border-orange-200 pb-2'>
                <ThemedText className='font-body text-gray-600 text-sm'>{t('payment.mobile.bankLabels.rif')}</ThemedText>
                <ThemedText className='font-body font-bold text-gray-900'>J-12345678-9</ThemedText>
            </View>
            <View className='flex-row justify-between pt-1'>
                <ThemedText className='font-body text-gray-600 text-sm'>{t('payment.mobile.bankLabels.holder')}</ThemedText>
                <ThemedText className='font-body font-bold text-gray-900'>VitalFit Cabudare</ThemedText>
            </View>
          </View>
        </View>

        <LinearGradient
          colors={['#4F3521', '#F27F2A']}
          locations={[0.2, 0.9]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            borderRadius: 16,
            paddingHorizontal: 20,
            paddingVertical: 16,
            marginBottom: 24,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <ThemedText
              lightColor='#ffffff'
              darkColor='#ffffff'
              className='font-body text-xs tracking-widest mb-1'
              style={{ opacity: 0.8 }}>
              {t('payment.totalToPay')}
            </ThemedText>
            <ThemedText
              lightColor='#ffffff'
              darkColor='#ffffff'
              className='font-body font-bold text-xs'>
               {t('payment.transfer.order')} #{params.invoiceId?.slice(0,8)}
            </ThemedText>
          </View>
          <View className='items-end'>
            <ThemedText
              lightColor='#ffffff'
              darkColor='#ffffff'
              className='font-heading text-3xl font-bold'
              style={{ fontFamily: 'BebasNeue-Regular' }}>
              ${parseFloat(params.totalAmount).toFixed(2)}
            </ThemedText>
            <ThemedText
              lightColor='#ffffff'
              darkColor='#ffffff'
              className='font-body text-xs font-bold'
              style={{ opacity: 0.9 }}>
              {params.currency}
            </ThemedText>
          </View>
        </LinearGradient>

        <View className='mb-8 space-y-4'>

          <View>
            <ThemedText className='font-body text-sm mb-2 text-gray-600 font-medium'>{t('payment.form.originPhone')}</ThemedText>
            <View className='border border-gray-300 rounded-xl bg-white overflow-hidden'>
                <PhoneInput
                ref={phoneInputRef}
                value={phone}
                onChangePhoneNumber={(ph) => setPhone(ph)}
                defaultCountry='VE'
                placeholder='0414 1234567'
                phoneInputStyles={{
                    container: { backgroundColor: 'transparent', borderWidth: 0, height: 50 },
                    flagContainer: { backgroundColor: 'transparent' },
                    callingCode: { color: '#4b5563' },
                    input: { color: '#111827' },
                }}
                />
            </View>
          </View>

          <StyledTextInput 
            label={t('payment.form.document')}
            placeholder="V-12345678"
            value={documentNumber}
            onChangeText={setDocumentNumber}
          />

          <StyledTextInput 
            label={t('payment.form.reference')}
            placeholder="Ej: 5678"
            value={reference}
            onChangeText={setReference}
            keyboardType="numeric"
          />

        </View>

        <View className='mb-8 border border-blue-100 rounded-xl px-4 py-3 bg-blue-50 flex-row items-center'>
          <ExclamationTriangleIcon size={24} color='#3b82f6' />
          <View className='ml-3 flex-1'>
            <ThemedText className='font-body text-xs text-blue-800 font-bold mb-1'>
              {t('payment.warning.verificationTitle')}
            </ThemedText>
            <ThemedText className='font-body text-xs text-blue-600'>
              {t('payment.warning.verificationMessage')}
            </ThemedText>
          </View>
        </View>

        <View className='mb-10'>
            {loading ? (
                <ActivityIndicator size="large" color="#f97316" />
            ) : (
                <PrimaryButton
                    title={t('payment.reportPayment')}
                    onPress={handleProcessPayment}
                />
            )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}