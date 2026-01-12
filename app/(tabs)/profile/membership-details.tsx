import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';


import vitalFitApi from '@/services';

interface MembershipDetail {
  client_membership_id: string;
  membership_type_id: string;
  start_date: string;
  end_date: string;
  status: string;
  membership_type: {
    name: string;
    description: string;
    price: number;
    duration_days: number;
  };
}

export default function MembershipDetailsScreen() {
  const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [membershipDetail, setMembershipDetail] = useState<MembershipDetail | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
          const response = await vitalFitApi.client.get({
              url: '/client-memberships/me',
              jwt: token
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const json = response as any;
          if (json && json.data) {
              setMembershipDetail(json.data);
          } else if (json && json.client_membership_id) {
               setMembershipDetail(json);
          }
        } catch (error) {
          console.error('Error fetching membership details:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleCancelMembership = () => {
      // Placeholder for cancellation logic
      console.log("Cancel membership logic to be implemented");
  };

  if (loading) {
    return (
      <ThemedView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
      </ThemedView>
    );
  }

  if (!membershipDetail) {
    return (
        <ThemedView className="flex-1 bg-white">
            <View className="w-full bg-[#F3F4F6] rounded-2xl py-2 mb-3 items-center justify-center relative mt-10 mx-4">
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => router.back()}
                    style={{ position: 'absolute', left: 12, top: 8, bottom: 8, justifyContent: 'center' }}>
                    <ChevronLeftIcon width={20} height={20} color="#f97316" />
                </TouchableOpacity>
                <Text className='font-heading' style={{ color: '#111827', fontSize: 16, fontWeight: '600' }}>Detalles de membresía</Text>
            </View>
            <View className="flex-1 items-center justify-center font-body">
                <Text style={{ color: '#111827' }}>No se encontraron detalles de membresía activa.</Text>
            </View>
        </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 40, paddingBottom: 96 }}>
        <View
          className="w-full bg-[#F3F4F6] rounded-2xl py-2 mb-3 items-center justify-center"
          style={{ position: 'relative' }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={{ position: 'absolute', left: 12, top: 8, bottom: 8, justifyContent: 'center' }}>
            <ChevronLeftIcon width={20} height={20} color="#f97316" />
          </TouchableOpacity>

          <Text className='font-heading' style={{ color: '#111827', fontSize: 16, fontWeight: '600' }}>Detalles de membresía</Text>
        </View>

        <View className="mb-4">
          <Text className="font-heading text-[14px] font-semibold text-[#111827] mb-2">Plan actual</Text>

          <View
            className="rounded-2xl px-4 py-4 border"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#F97316' }}>
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-1 mr-2">
                <Text className="font-body text-xs mb-1" style={{ color: '#6B7280' }}>
                  {membershipDetail.membership_type?.name || 'Nombre no disponible'}
                </Text>
                <Text className="font-heading text-sm font-semibold" style={{ color: '#F97316' }}>
                  {membershipDetail.membership_type?.description || ''}
                </Text>
              </View>

              <View className="px-3 py-1 rounded-full" style={{ backgroundColor: '#FEF3C7' }}>
                <Text className="font-body text-[10px] font-semibold" style={{ color: '#F97316' }}>
                  {membershipDetail.status}
                </Text>
              </View>
            </View>

             <View className="mb-4 flex-row justify-between">
               <View>
                  <Text className="font-body text-xs mb-1" style={{ color: '#6B7280' }}>
                    Precio
                  </Text>
                  <Text className="font-body text-sm font-semibold" style={{ color: '#111827' }}>
                    ${membershipDetail.membership_type?.price}
                  </Text>
               </View>
               <View>
                  <Text className="font-body text-xs mb-1" style={{ color: '#6B7280' }}>
                    Duración
                  </Text>
                  <Text className="font-body text-sm font-semibold" style={{ color: '#111827' }}>
                    {membershipDetail.membership_type?.duration_days} días
                  </Text>
               </View>
            </View>

            <View className="mb-4">
              <Text className="font-body text-xs mb-1" style={{ color: '#6B7280' }}>
                Fecha de inicio
              </Text>
              <Text className="font-body text-xs" style={{ color: '#111827' }}>
                {formatDate(membershipDetail.start_date)}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="font-body text-xs mb-1" style={{ color: '#6B7280' }}>
                Fecha de vencimiento
              </Text>
              <Text className="font-body text-xs" style={{ color: '#111827' }}>
                {formatDate(membershipDetail.end_date)}
              </Text>
            </View>
            
          </View>

          <TouchableOpacity
            onPress={handleCancelMembership}
            className="w-full py-4 mt-4 rounded-xl items-center border border-red-500"
          >
              <Text className="text-red-500 font-semibold font-body">
                  Cancelar membresía
              </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-2">
          <View
            className="rounded-2xl border px-4 py-4"
            style={{ borderColor: '#DC2626', backgroundColor: '#FFFFFF' }}>
            <Text
              className="font-heading text-[12px] font-semibold mb-1"
              style={{ color: '#B91C1C' }}>
              CANCELAR MEMBRESÍA
            </Text>
            <Text className="font-body text-xs mb-4" style={{ color: '#B91C1C' }}>
              Tu membresía permanecerá activa hasta el {formatDate(membershipDetail.end_date)}.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              className="w-full rounded-full py-3 items-center justify-center"
              style={{ backgroundColor: '#EF4444' }}
              onPress={() => {
                router.push('/profile/cancel-membership');
              }}>
              <Text className="font-body text-sm font-semibold" style={{ color: '#FFFFFF' }}>
                Cancelar renovación
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
