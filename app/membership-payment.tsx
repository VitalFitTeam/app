import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { ToastNotification } from '@/components/ToastNotification';
import { useToast } from '@/hooks/useToast';
import vitalFitApi from '@/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { BanknotesIcon, BuildingLibraryIcon, CreditCardIcon, DevicePhoneMobileIcon } from 'react-native-heroicons/outline';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BranchPaymentMethod {
  method_id: string;
  branch_id: string;
  name: string;
  type: string;
  is_active: boolean;
  description?: string;
}

export default function MembershipPaymentScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  
  const params = useLocalSearchParams<{
    invoiceId: string;
    totalAmount: string;
    currency: string;
    title?: string;
    branchId: string; 
  }>();

  const [loadingMethods, setLoadingMethods] = useState(true);
  const [loading, setLoading] = useState(false);
  const [methods, setMethods] = useState<BranchPaymentMethod[]>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const { toastState, showToast, hideToast } = useToast();

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        if (!params.branchId) {
            Alert.alert("Error", "No se identificó la sucursal.");
            return;
        }

        const response = await vitalFitApi.paymentMethod.getBranchPaymentMethods(params.branchId, token);
        const responseData = response.data || response || [];
        const activeMethods = (responseData as BranchPaymentMethod[]).filter(m => m.is_active === true);
        setMethods(activeMethods);

      } catch (error) {
        console.error('Error cargando métodos:', error);
        Alert.alert('Aviso', 'No se pudieron cargar los métodos de pago.');
      } finally {
        setLoadingMethods(false);
      }
    };

    loadPaymentMethods();
  }, [params.branchId]);

  const handlePay = async () => {
    if (!selectedMethodId) {
      showToast('warning', t('common.attention'), t('payment.toast.selectMethod'));
      return;
    }

    const selectedMethod = methods.find(m => m.method_id === selectedMethodId);
    const methodName = selectedMethod?.name || '';
    const nameLower = methodName.toLowerCase();

    const nextParams = {
        invoiceId: params.invoiceId,
        totalAmount: params.totalAmount,
        currency: params.currency || 'USD',
        methodId: selectedMethodId,
        methodName: methodName,
    };

    if (nameLower.includes('pago movil') || nameLower.includes('pago móvil')) {
        router.push({ pathname: '/membership-payment-pagomovil', params: nextParams } as never);
    } 
    else if (nameLower.includes('zelle') || nameLower.includes('transfer') || selectedMethod?.type === 'Transfer') {
        router.push({ pathname: '/membership-payment-transfer', params: nextParams } as never);
    } 
    else {
        processDirectPayment(selectedMethodId);
    }
  };

  const processDirectPayment = async (methodId: string) => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        
        await vitalFitApi.billing.AddPaymentToInvoice({
            invoice_id: params.invoiceId,
            payment_method_id: methodId,
            amount_paid: Number(params.totalAmount),
            currency_paid: params.currency || 'USD',
            transaction_id: `SITIO-${Date.now()}`,
            receipt_url: 'Pago reportado en sitio' 
        }, token || '');

        showToast('success', t('payment.toast.orderCreated'), t('payment.toast.goToReception'));

        setTimeout(() => {
            router.replace('/(tabs)/dashboard');
        }, 2500);

      } catch (error) {
          console.error('Error procesando pago directo:', error);
          showToast('error', t('common.error.title'), t('payment.toast.errorRegistering'));
      } finally {
          setLoading(false);
      }
  }

  const renderMethodIcon = (methodName: string) => {
    const name = (methodName || '').toLowerCase();
    if (name.includes('pago movil')) return <DevicePhoneMobileIcon size={24} color="#f97316" />;
    if (name.includes('zelle')) return <View className="w-6 h-6 border border-orange-500 rounded-full items-center justify-center"><ThemedText className="font-body text-[10px] text-orange-500 font-bold">$</ThemedText></View>;
    if (name.includes('transfer')) return <BuildingLibraryIcon size={24} color="#f97316" />;
    if (name.includes('efectivo') || name.includes('cash')) return <BanknotesIcon size={24} color="#f97316" />;
    return <CreditCardIcon size={24} color="#f97316" />;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ToastNotification
        visible={toastState.visible}
        type={toastState.type}
        title={toastState.title}
        message={toastState.message}
        onClose={hideToast}
      />

      <ScrollView className="flex-1 px-6 pt-8 pb-10">
        <View className="items-center mb-8">
            <ThemedText className="font-heading text-3xl font-bold text-center mb-2" style={{ fontFamily: 'BebasNeue-Regular' }}>
                {t('payment.method.title')}
            </ThemedText>
            <ThemedText className="font-body text-gray-500 text-center" style={{ fontFamily: 'Montserrat_400Regular' }}>
                {t('payment.method.subtitle')}
            </ThemedText>
        </View>

        <View className="bg-white p-6 rounded-3xl border border-orange-100 mb-8">
            <ThemedText className="font-body text-xs text-orange-500 font-bold tracking-widest uppercase mb-3" style={{ fontFamily: 'Montserrat_700Bold' }}>
                {t('payment.totalToPay')}
            </ThemedText>
            <View className="flex-row items-end mb-4">
                <ThemedText className="font-heading text-5xl font-bold text-neutral-900 mr-2" style={{ fontFamily: 'BebasNeue-Regular' }}>
                    ${parseFloat(params.totalAmount || '0').toFixed(2)}
                </ThemedText>
                <ThemedText className="font-body text-lg text-orange-500 font-bold mb-2" style={{ fontFamily: 'Montserrat_700Bold' }}>
                    {params.currency || 'USD'}
                </ThemedText>
            </View>
            <View className="h-[1px] bg-gray-100 w-full mb-4" />
            <View className="flex-row justify-between items-center">
                <ThemedText className="font-body text-neutral-500" style={{ fontFamily: 'Montserrat_400Regular' }}>{t('payment.concept')}</ThemedText>
                <ThemedText className="font-body text-neutral-900 font-bold max-w-[60%] text-right text-base" numberOfLines={1} style={{ fontFamily: 'Montserrat_700Bold' }}>
                    {params.title || 'Membresía VitalFit'}
                </ThemedText>
            </View>
        </View>

        <ThemedText className="font-heading text-2xl mb-4 text-neutral-800 tracking-wide" style={{ fontFamily: 'BebasNeue-Regular' }}>{t('payment.options.title')}</ThemedText>

        {loadingMethods ? (
            <ActivityIndicator size="large" color="#f97316" className="py-10" />
        ) : (
            <View className="mb-8">
                {methods.map((method) => {
                    const isSelected = selectedMethodId === method.method_id;
                    return (
                        <TouchableOpacity
                            key={method.method_id}
                            activeOpacity={0.9}
                            onPress={() => setSelectedMethodId(method.method_id)}
                            className={`flex-row items-center p-4 mb-3 rounded-xl border ${
                                isSelected 
                                    ? 'border-orange-500 bg-orange-50' 
                                    : 'border-neutral-200 bg-white'
                            }`}
                        >
                            <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${isSelected ? 'bg-orange-200' : 'bg-orange-50'}`}>
                                {renderMethodIcon(method.name)}
                            </View>
                            <View className="flex-1">
                                <ThemedText className={`font-body font-bold text-base ${isSelected ? 'text-orange-900' : 'text-neutral-900'}`} style={{ fontFamily: 'Montserrat_700Bold' }}>
                                    {method.name}
                                </ThemedText>
                                {method.description ? (
                                    <ThemedText className="font-body text-xs text-gray-500 mt-0.5" style={{ fontFamily: 'Montserrat_400Regular' }}>
                                        {method.description}
                                    </ThemedText>
                                ) : null}
                            </View>
                            <View className={`w-6 h-6 rounded-full border items-center justify-center ${isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}>
                                {isSelected && <CheckCircleIcon size={20} color="white" />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
                {methods.length === 0 && (
                    <ThemedText className="font-body text-center text-gray-500 py-4" style={{ fontFamily: 'Montserrat_400Regular' }}>{t('payment.options.noMethods')}</ThemedText>
                )}
            </View>
        )}

        <View className="mb-8">
            {loading ? (
                <ActivityIndicator size="large" color="#f97316" />
            ) : (
                <PrimaryButton
                    title={selectedMethodId ? t('payment.continue') : t('payment.selectMethod')}
                    onPress={handlePay}
                />
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}