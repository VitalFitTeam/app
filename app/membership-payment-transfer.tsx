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
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { ExclamationTriangleIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MembershipPaymentTransferScreen() {
  const router = useRouter();
  
  // Recibimos los datos de la factura
  const params = useLocalSearchParams<{
    invoiceId: string;
    totalAmount: string;
    methodId: string;
    methodName: string;
    currency: string;
  }>();

  // Estados del formulario
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState('');
  const [senderName, setSenderName] = useState('');

  // Hook de notificaciones
  const { toastState, showToast, hideToast } = useToast();

  const currencySymbol = params.currency === 'EUR' ? '€' : params.currency === 'VES' ? 'Bs' : '$';

  const handleProcessPayment = async () => {
    // 1. Validaciones
    if (!reference || !senderName) {
      showToast('warning', 'Campos incompletos', 'Por favor ingresa el titular y la referencia.');
      return;
    }

    if (reference.length < 4) {
      showToast('warning', 'Referencia corta', 'Verifica el número de referencia.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Sesión expirada');

      // 2. Ejecutar pago en el backend
      await vitalFitApi.billing.AddPaymentToInvoice({
        invoice_id: params.invoiceId,
        payment_method_id: params.methodId,
        amount_paid: Number(params.totalAmount),
        currency_paid: params.currency || 'USD',
        transaction_id: reference,
        // Guardamos el titular en el campo de recibo/notas
        receipt_url: `Titular: ${senderName}` 
      }, token);

      // 3. Éxito
      showToast('success', 'Pago Registrado', 'Validaremos tu transferencia pronto.');

      // 4. Redirigir
      setTimeout(() => {
        router.replace('/(tabs)/dashboard');
      }, 2500);

    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      showToast('error', 'Error', `No se pudo registrar el pago: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      {/* Componente de Notificación */}
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
            {params.methodName || 'TRANSFERENCIA'}
        </ThemedText>
        
        <ThemedText className="text-center text-gray-500 mb-6">
            Reporta los detalles de tu transacción
        </ThemedText>

        {/* Datos Bancarios (Ejemplo dinámico según si es Zelle o Banco) */}
        <View className='mb-6 border border-gray-200 rounded-2xl px-4 py-4 bg-gray-50'>
          <ThemedText className='text-xs font-bold tracking-widest mb-3 text-gray-500 uppercase'>
            CUENTA DESTINO
          </ThemedText>
          
          {params.methodName?.toLowerCase().includes('zelle') ? (
             <View className='space-y-2'>
                <View className='flex-row justify-between'>
                    <ThemedText className='text-gray-600'>Email:</ThemedText>
                    <ThemedText className='font-bold text-gray-900'>pagos@vitalfit.com</ThemedText>
                </View>
                <View className='flex-row justify-between'>
                    <ThemedText className='text-gray-600'>Titular:</ThemedText>
                    <ThemedText className='font-bold text-gray-900'>VitalFit LLC</ThemedText>
                </View>
             </View>
          ) : (
             <View className='space-y-2'>
                <View className='flex-row justify-between'>
                    <ThemedText className='text-gray-600'>Banco:</ThemedText>
                    <ThemedText className='font-bold text-gray-900'>Banco Nacional</ThemedText>
                </View>
                <View className='flex-row justify-between'>
                    <ThemedText className='text-gray-600'>Cuenta:</ThemedText>
                    <ThemedText className='font-bold text-gray-900'>0134-XXXX-XXXX-XXXX</ThemedText>
                </View>
                <View className='flex-row justify-between'>
                    <ThemedText className='text-gray-600'>RIF:</ThemedText>
                    <ThemedText className='font-bold text-gray-900'>J-12345678-9</ThemedText>
                </View>
             </View>
          )}
        </View>

        {/* Tarjeta de Monto */}
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
              TOTAL A TRANSFERIR
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

        {/* Formulario */}
        <View className='mb-8 space-y-4'>
          
          <StyledTextInput 
            label="Nombre del Titular de la Cuenta"
            placeholder="Quien realizó la transferencia"
            value={senderName}
            onChangeText={setSenderName}
          />

          <StyledTextInput 
            label="Número de Referencia / Confirmación"
            placeholder="Ej: 12345678"
            value={reference}
            onChangeText={setReference}
            keyboardType="numeric" // Numérico suele ser mejor para referencias
          />

        </View>

        {/* Aviso Importante */}
        <View className='mb-8 border border-blue-100 rounded-xl px-4 py-3 bg-blue-50 flex-row items-center'>
          <ExclamationTriangleIcon size={24} color='#3b82f6' />
          <View className='ml-3 flex-1'>
            <ThemedText className='text-xs text-blue-800 font-bold mb-1'>
              Confirmación Manual
            </ThemedText>
            <ThemedText className='text-xs text-blue-600'>
              Nuestro equipo administrativo verificará la transacción antes de activar tu plan.
            </ThemedText>
          </View>
        </View>

        <View className='mb-10'>
            {loading ? (
                <ActivityIndicator size="large" color="#f97316" />
            ) : (
                <PrimaryButton
                    title='Confirmar Pago'
                    onPress={handleProcessPayment}
                />
            )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}