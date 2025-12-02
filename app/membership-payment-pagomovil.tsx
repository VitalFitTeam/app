import { PrimaryButton } from '@/components/PrimaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedText } from '@/components/themed-text';
import { ToastNotification } from '@/components/ToastNotification';
import { useToast } from '@/hooks/useToast';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { ExclamationTriangleIcon } from 'react-native-heroicons/outline';
import PhoneInput, { IPhoneInputRef } from 'react-native-international-phone-number';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MembershipPaymentPagoMovilScreen() {
  const router = useRouter();
  
  // Recibimos los datos finales de la factura
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
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');
  const phoneInputRef = useRef<IPhoneInputRef | null>(null);

  // Hook de notificaciones
  const { toastState, showToast, hideToast } = useToast();

  const handleProcessPayment = async () => {
    // Validaciones simples
    if (!reference || !documentNumber || !phone) {
      showToast('warning', 'Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }

    if (reference.length < 4) {
      showToast('warning', 'Referencia inválida', 'Ingresa al menos los últimos 4 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Sesión expirada');

      // Ejecutar pago en el backend
      await vitalFitApi.billing.AddPaymentToInvoice({
        invoice_id: params.invoiceId,
        payment_method_id: params.methodId,
        amount_paid: Number(params.totalAmount),
        currency_paid: params.currency || 'VES', // Asumimos VES para pago móvil, o lo que venga
        transaction_id: reference,
        // Guardamos cédula y teléfono en el campo de recibo/notas para referencia administrativa
        receipt_url: `CI: ${documentNumber} - Tlf: ${phone}` 
      }, token);

      showToast('success', 'Pago Reportado', 'Tu pago ha sido enviado a verificación.');

      // Redirigir después de mostrar el éxito
      setTimeout(() => {
        router.replace('/(tabs)/dashboard');
      }, 2500);

    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      showToast('error', 'Error en el pago', `No se pudo registrar: ${msg}`);
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
            className='text-3xl mb-6 text-center'
            style={{ fontFamily: 'BebasNeue-Regular' }}
        >
            PAGO MÓVIL
        </ThemedText>

        {/* Datos Bancarios del Comercio */}
        <View className='mb-6 border border-orange-500/80 rounded-2xl px-4 py-4 bg-orange-50'>
          <ThemedText className='text-xs font-bold tracking-widest mb-3 text-orange-800 uppercase'>
            DATOS PARA EL PAGO
          </ThemedText>
          
          <View className='space-y-3'>
            <View className='flex-row justify-between border-b border-orange-200 pb-2'>
                <ThemedText className='text-gray-600 text-sm'>Banco:</ThemedText>
                <ThemedText className='font-bold text-gray-900'>Banco de Venezuela</ThemedText>
            </View>
            <View className='flex-row justify-between border-b border-orange-200 pb-2'>
                <ThemedText className='text-gray-600 text-sm'>Teléfono:</ThemedText>
                <ThemedText className='font-bold text-gray-900'>0414-1234567</ThemedText>
            </View>
            <View className='flex-row justify-between border-b border-orange-200 pb-2'>
                <ThemedText className='text-gray-600 text-sm'>RIF:</ThemedText>
                <ThemedText className='font-bold text-gray-900'>J-12345678-9</ThemedText>
            </View>
            <View className='flex-row justify-between pt-1'>
                <ThemedText className='text-gray-600 text-sm'>Titular:</ThemedText>
                <ThemedText className='font-bold text-gray-900'>VitalFit Cabudare</ThemedText>
            </View>
          </View>
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
              TOTAL A PAGAR
            </ThemedText>
            <ThemedText className='text-white font-bold text-xs'>
               Orden #{params.invoiceId?.slice(0,8)}
            </ThemedText>
          </View>
          <View className='items-end'>
            <ThemedText className='text-3xl font-bold text-white' style={{ fontFamily: 'BebasNeue-Regular' }}>
              ${parseFloat(params.totalAmount).toFixed(2)}
            </ThemedText>
            <ThemedText className='text-white/90 text-xs font-bold'>
              {params.currency}
            </ThemedText>
          </View>
        </LinearGradient>

        {/* Formulario */}
        <View className='mb-8 space-y-4'>
          
          {/* Teléfono */}
          <View>
            <ThemedText className='text-sm mb-2 text-gray-600 font-medium'>Teléfono Origen</ThemedText>
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

          {/* Cédula */}
          <StyledTextInput 
            label="Cédula / RIF del Titular"
            placeholder="V-12345678"
            value={documentNumber}
            onChangeText={setDocumentNumber}
          />

          {/* Referencia */}
          <StyledTextInput 
            label="Número de Referencia (Últimos 4 dígitos)"
            placeholder="Ej: 5678"
            value={reference}
            onChangeText={setReference}
            keyboardType="numeric"
          />

        </View>

        {/* Aviso Importante */}
        <View className='mb-8 border border-blue-100 rounded-xl px-4 py-3 bg-blue-50 flex-row items-center'>
          <ExclamationTriangleIcon size={24} color='#3b82f6' />
          <View className='ml-3 flex-1'>
            <ThemedText className='text-xs text-blue-800 font-bold mb-1'>
              Verificación
            </ThemedText>
            <ThemedText className='text-xs text-blue-600'>
              Tu pago será validado manualmente por administración. Guarda tu comprobante digital.
            </ThemedText>
          </View>
        </View>

        <View className='mb-10'>
            {loading ? (
                <ActivityIndicator size="large" color="#f97316" />
            ) : (
                <PrimaryButton
                    title='Reportar Pago'
                    onPress={handleProcessPayment}
                />
            )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}