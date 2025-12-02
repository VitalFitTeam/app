import { PrimaryButton } from '@/components/PrimaryButton';
import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedText } from '@/components/themed-text';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PagoMovilScreen() {
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
  const [phone, setPhone] = useState('');

  const handleProcessPayment = async () => {
    if (!reference || !phone) {
      Alert.alert('Error', 'Por favor completa todos los campos (Teléfono y Referencia).');
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
        receipt_url: `Phone: ${phone}` 
      }, token);

      Alert.alert('¡Pago Recibido!', 'Tu pago será verificado en breve.', [
        { text: 'Ir a Inicio', onPress: () => router.replace('/(tabs)/dashboard') }
      ]);

    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('Error', `No se pudo procesar: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-6">
        <ThemedText className="text-2xl font-bold mb-6 text-center">
          PAGO MÓVIL
        </ThemedText>

        <View className="bg-orange-50 p-4 rounded-xl mb-6 border border-orange-100">
            <ThemedText className="font-bold text-orange-800 mb-2">Datos para realizar el pago:</ThemedText>
            {/* Aquí podrías poner datos reales si los tienes, o dejarlos genéricos */}
            <ThemedText className="text-sm text-neutral-700">Banco: <ThemedText className="font-bold">Banesco</ThemedText></ThemedText>
            <ThemedText className="text-sm text-neutral-700">RIF: <ThemedText className="font-bold">J-12345678-9</ThemedText></ThemedText>
            <View className="mt-3 pt-3 border-t border-orange-200">
                 <ThemedText className="text-lg font-bold text-center text-orange-900">
                    Monto: {params.totalAmount} {params.currency}
                 </ThemedText>
            </View>
        </View>

        <View className="mb-4">
            <StyledTextInput 
                label="Número de Teléfono (Origen)"
                placeholder="0414..."
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
        </View>

        <View className="mb-8">
            <StyledTextInput 
                label="Referencia (Últimos 4-6 dígitos)"
                placeholder="123456"
                value={reference}
                onChangeText={setReference}
                keyboardType="numeric"
            />
        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#f97316" />
        ) : (
            <PrimaryButton title="Reportar Pago" onPress={handleProcessPayment} />
        )}

      </ScrollView>
    </SafeAreaView>
  );
}