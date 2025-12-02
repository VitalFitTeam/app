import { PrimaryButton } from '@/components/PrimaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedText } from '@/components/themed-text';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransferPaymentScreen() {
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

  const handleProcessPayment = async () => {
    if (!reference || !senderName) {
      Alert.alert('Error', 'Por favor ingresa el nombre del titular y la referencia.');
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
        receipt_url: `Titular: ${senderName}` 
      }, token);

      Alert.alert('¡Pago Registrado!', 'Validaremos tu transferencia y activaremos tu plan.', [
        { text: 'Finalizar', onPress: () => router.replace('/(tabs)/dashboard') }
      ]);

    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('Error', `No se pudo registrar el pago: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-6">
        <ThemedText className="text-2xl font-bold mb-2 text-center uppercase">
          {params.methodName}
        </ThemedText>
        <ThemedText className="text-center text-gray-500 mb-6">
            Reporta los detalles de tu transacción
        </ThemedText>

        <View className="bg-gray-100 p-4 rounded-xl mb-6">
            <ThemedText className="font-bold text-gray-800 mb-2">Monto a Transferir:</ThemedText>
            <ThemedText className="font-extrabold text-center text-2xl text-orange-600">
                ${params.totalAmount} {params.currency}
            </ThemedText>
        </View>

        <View className="mb-4">
            <StyledTextInput 
                label="Nombre del Titular de la Cuenta"
                placeholder="Quien realizó la transferencia"
                value={senderName}
                onChangeText={setSenderName}
            />
        </View>

        <View className="mb-8">
            <StyledTextInput 
                label="Número de Referencia / Confirmación"
                placeholder="Ej: 54321098"
                value={reference}
                onChangeText={setReference}
            />
        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#f97316" />
        ) : (
            <PrimaryButton title="Confirmar Pago" onPress={handleProcessPayment} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}