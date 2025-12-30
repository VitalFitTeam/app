import { PrimaryButton } from '@/components/PrimaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedText } from '@/components/themed-text';
import { ToastNotification } from '@/components/ToastNotification';
import { useToast } from '@/hooks/useToast';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { ExclamationTriangleIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MembershipPaymentTransferScreen() {
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
  const [senderName, setSenderName] = useState('');
  const { toastState, showToast, hideToast } = useToast();
  const currencySymbol = params.currency === 'EUR' ? '€' : params.currency === 'VES' ? 'Bs' : '$';
  const handleProcessPayment = async () => {

    if (!reference || !senderName) {
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
        currency_paid: params.currency || 'USD',
        transaction_id: reference,
        receipt_url: `${t('payment.transfer.holderPrefix')}${senderName}` 
      }, token);

      showToast('success', t('payment.toast.paymentReported'), t('payment.toast.sentToVerification'));

      setTimeout(() => {
        router.replace('/(tabs)/dashboard');
      }, 2500);

    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : t('common.error.unknown');
      showToast('error', t('common.error.title'), `${t('common.error.unableToRegister')}: ${msg}`);
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
            className='text-3xl mb-2 text-center uppercase'
            style={{ fontFamily: 'BebasNeue-Regular' }}
        >
            {params.methodName || t('payment.transfer.title')}
        </ThemedText>
        
        <ThemedText className="text-center text-gray-500 mb-6">
            {t('payment.transfer.subtitle')}
        </ThemedText>

        <View className='mb-6 border border-gray-200 rounded-2xl px-4 py-4 bg-gray-50'>
          <ThemedText className='text-xs font-bold tracking-widest mb-3 text-gray-500 uppercase'>
            {t('payment.transfer.destinationAccount')}
          </ThemedText>
          
          {params.methodName?.toLowerCase().includes('zelle') ? (
             <View className='space-y-2'>
                <View className='flex-row justify-between'>
                    <ThemedText className='text-gray-600'>{t('payment.transfer.labels.email')}</ThemedText>
                    <ThemedText className='font-bold text-gray-900'>pagos@vitalfit.com</ThemedText>
                </View>
                <View className='flex-row justify-between'>
                    <ThemedText className='text-gray-600'>{t('payment.transfer.labels.holder')}</ThemedText>
                    <ThemedText className='font-bold text-gray-900'>VitalFit LLC</ThemedText>
                </View>
             </View>
          ) : (
             <View className='space-y-2'>
                <View className='flex-row justify-between'>
                    <ThemedText className='text-gray-600'>{t('payment.transfer.labels.bank')}</ThemedText>
                    <ThemedText className='font-bold text-gray-900'>Banco Nacional</ThemedText>
                </View>
                <View className='flex-row justify-between'>
                    <ThemedText className='text-gray-600'>{t('payment.transfer.labels.account')}</ThemedText>
                    <ThemedText className='font-bold text-gray-900'>0134-XXXX-XXXX-XXXX</ThemedText>
                </View>
                <View className='flex-row justify-between'>
                    <ThemedText className='text-gray-600'>{t('payment.transfer.labels.rif')}</ThemedText>
                    <ThemedText className='font-bold text-gray-900'>J-12345678-9</ThemedText>
                </View>
             </View>
          )}
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
            <ThemedText className='text-xs text-white/80 tracking-widest mb-1'>
              {t('payment.transfer.total')}
            </ThemedText>
            <ThemedText className='text-white font-bold text-xs'>
               Orden #{params.invoiceId?.slice(0,8)}
            </ThemedText>
          </View>
          <View className='items-end'>
            <ThemedText className='text-3xl font-bold text-white' style={{ fontFamily: 'BebasNeue-Regular' }}>
              {currencySymbol}{parseFloat(params.totalAmount).toFixed(2)}
            </ThemedText>
            <ThemedText className='text-white/90 text-xs font-bold'>
              {params.currency || 'USD'}
            </ThemedText>
          </View>
        </LinearGradient>

        <View className='mb-8 space-y-4'>
          
          <StyledTextInput 
            label={t('payment.transfer.senderName')}
            placeholder={t('payment.transfer.senderNamePlaceholder')}
            value={senderName}
            onChangeText={setSenderName}
          />

          <StyledTextInput 
            label={t('payment.transfer.reference')}
            placeholder={t('payment.transfer.referencePlaceholder')}
            value={reference}
            onChangeText={setReference}
            keyboardType="numeric" 
          />

        </View>

        <View className='mb-8 border border-blue-100 rounded-xl px-4 py-3 bg-blue-50 flex-row items-center'>
          <ExclamationTriangleIcon size={24} color='#3b82f6' />
          <View className='ml-3 flex-1'>
            <ThemedText className='text-xs text-blue-800 font-bold mb-1'>
              {t('payment.warning.manualConfirmation')}
            </ThemedText>
            <ThemedText className='text-xs text-blue-600'>
              {t('payment.warning.manualMessage')}
            </ThemedText>
          </View>
        </View>

        <View className='mb-10'>
            {loading ? (
                <ActivityIndicator size="large" color="#f97316" />
            ) : (
                <PrimaryButton
                    title={t('payment.confirmPayment')}
                    onPress={handleProcessPayment}
                />
            )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}