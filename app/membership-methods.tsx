import { ThemedText } from '@/components/themed-text';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BranchPaymentMethod {
  method_id: string;
  branch_id: string;
  name: string;
  type: string;
  is_active: boolean;
}

export default function MembershipMethodsScreen() {
  const params = useLocalSearchParams();
  const [methods, setMethods] = useState<BranchPaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if(!token) return;
            
            const res = await vitalFitApi.paymentMethod.getBranchPaymentMethods(params.branchId as string, token);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = (res.data || res || []) as any[];
            setMethods(data as BranchPaymentMethod[]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    load();
  }, [params.branchId]);

  return (
    <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
            {loading ? <ActivityIndicator color="#f97316" /> : <ThemedText className="font-body">Métodos cargados: {methods.length}</ThemedText>}
        </View>
    </SafeAreaView>
  );
}