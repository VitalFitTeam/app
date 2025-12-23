import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, ScrollView, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import {
    AdjustmentsHorizontalIcon,
    MagnifyingGlassIcon
} from 'react-native-heroicons/outline';
import {
    ArrowPathIcon,
    CheckCircleIcon,
    ChevronLeftIcon,
    ClockIcon,
    XCircleIcon
} from 'react-native-heroicons/solid';

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todo');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filters = ['Todo', 'Membresías', 'Servicios'];

  const mockPayments = [
    {
      id: '1',
      title: 'Monthly Membership',
      date: 'Oct 15, 2023',
      fullDate: '11/11/2025 8:00 PM',
      amount: '$500',
      status: 'Pagado',
      statusColor: '#10b981',
      statusIcon: 'check',
      method: 'Visa **** 4321',
      transactionId: 'TX-1A9D04',
      serviceType: 'Membership'
    },
    {
      id: '2',
      title: 'Monthly Membership',
      date: 'Oct 15, 2023',
      fullDate: '11/11/2025 8:00 PM',
      amount: '$500',
      status: 'Fallido',
      statusColor: '#ef4444',
      statusIcon: 'x',
      method: 'Visa **** 4321',
      transactionId: 'TX-2B8C03',
      serviceType: 'Membership'
    },
    {
      id: '3',
      title: 'Monthly Membership',
      date: 'Oct 15, 2023',
      fullDate: '11/11/2025 8:00 PM',
      amount: '$500',
      status: 'Reembolsado',
      statusColor: '#6b7280',
      statusIcon: 'arrow',
      method: 'Visa **** 4321',
      transactionId: 'TX-3C7B02',
      serviceType: 'Membership'
    },
    {
      id: '4',
      title: 'Monthly Membership',
      date: 'Oct 15, 2023',
      fullDate: '11/11/2025 8:00 PM',
      amount: '$500',
      status: 'Pendiente',
      statusColor: '#f97316',
      statusIcon: 'clock',
      method: 'Visa **** 4321',
      transactionId: 'TX-4D6A01',
      serviceType: 'Membership'
    },
  ];

  const getStatusIcon = (iconType: string) => {
    switch (iconType) {
      case 'check':
        return <CheckCircleIcon size={16} color="#ffffff" />;
      case 'x':
        return <XCircleIcon size={16} color="#ffffff" />;
      case 'clock':
        return <ClockIcon size={16} color="#ffffff" />;
      case 'arrow':
        return <ArrowPathIcon size={16} color="#ffffff" />;
      default:
        return <CheckCircleIcon size={16} color="#ffffff" />;
    }
  };

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'Todo' || 
      (activeFilter === 'Membresías' && payment.serviceType === 'Membership') ||
      (activeFilter === 'Servicios' && payment.serviceType !== 'Membership');
    
    return matchesSearch && matchesFilter;
  });

  return (
    <ThemedView className='flex-1 bg-white pt-10'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96 }}>
        
        {/* Header - Exactamente como Notificaciones */}
        <View
          className='w-full bg-[#F3F4F6] rounded-2xl py-2 mb-3 items-center justify-center'
          style={{ position: 'relative' }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={{ position: 'absolute', left: 12, top: 8, bottom: 8, justifyContent: 'center' }}>
            <ChevronLeftIcon width={20} height={20} color='#f97316' />
          </TouchableOpacity>

          <Text style={{ color: '#111827', fontSize: 16, fontWeight: '600' }}>Historial de pago</Text>
        </View>

        {/* Barra de búsqueda */}
        <View style={{
          backgroundColor: '#ffffff',
          borderRadius: 28,
          paddingVertical: 12,
          paddingHorizontal: 16,
          marginBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#e5e7eb',
        }}>
          <MagnifyingGlassIcon size={20} color='#f97316' />
          <TextInput 
            placeholder="Nombre del servicio"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ flex: 1, marginLeft: 10, fontSize: 14, color: '#111827' }}
          />
        </View>

        {/* Botón Filter */}
        <TouchableOpacity 
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            paddingVertical: 10,
            paddingHorizontal: 20,
            alignSelf: 'flex-start',
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#e5e7eb',
          }}
          activeOpacity={0.8}
        >
          <AdjustmentsHorizontalIcon size={16} color='#111827' style={{ marginRight: 6 }} />
          <Text style={{ color: '#111827', fontSize: 14, fontWeight: '500' }}>Filter</Text>
        </TouchableOpacity>

        {/* Chips de Filtros */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={{ marginBottom: 16 }}
          contentContainerStyle={{ gap: 10 }}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
                backgroundColor: activeFilter === filter ? '#f97316' : '#ffffff',
                borderWidth: 1,
                borderColor: activeFilter === filter ? '#f97316' : '#e5e7eb',
              }}
            >
              <Text style={{ 
                color: activeFilter === filter ? '#ffffff' : '#111827',
                fontSize: 14,
                fontWeight: activeFilter === filter ? '600' : '500'
              }}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de Pagos - Estilo Notificaciones */}
        <View style={{ gap: 8 }}>
          {filteredPayments.map((payment) => {
            const isExpanded = expandedId === payment.id;
            return (
              <TouchableOpacity
                key={payment.id}
                activeOpacity={0.9}
                onPress={() => toggleExpand(payment.id)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 16,
                  padding: 16,
                  shadowColor: '#000',
                  shadowOpacity: 0.06,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 1,
                }}
              >
                {/* Vista Compacta */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  {/* Icono de estado */}
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: payment.statusColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                      marginTop: 2,
                    }}>
                    {getStatusIcon(payment.statusIcon)}
                  </View>

                  {/* Contenido principal */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1, marginRight: 12 }}>
                        <Text
                          style={{
                            color: '#111827',
                            fontSize: 15,
                            fontWeight: '700',
                            marginBottom: 2,
                          }}
                          numberOfLines={1}>
                          {payment.title}
                        </Text>
                        <Text style={{ color: '#f97316', fontSize: 11 }}>
                          {payment.date}
                        </Text>
                        <Text style={{ color: '#6b7280', fontSize: 11, marginTop: 2 }}>
                          {payment.method}
                        </Text>
                      </View>

                      {/* Monto y estado */}
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ 
                          color: '#111827', 
                          fontSize: 17, 
                          fontWeight: '700',
                          marginBottom: 4
                        }}>
                          {payment.amount}
                        </Text>
                        <View style={{ 
                          backgroundColor: payment.statusColor,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 12,
                        }}>
                          <Text style={{ 
                            color: '#ffffff', 
                            fontSize: 11, 
                            fontWeight: '600'
                          }}>
                            {payment.status}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Detalles Expandidos */}
                    {isExpanded && (
                      <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' }}>
                        <View style={{ gap: 12 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#6b7280', fontSize: 12 }}>ID Transacción:</Text>
                            <Text style={{ color: '#111827', fontSize: 12, fontWeight: '500' }}>
                              {payment.transactionId}
                            </Text>
                          </View>

                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#6b7280', fontSize: 12 }}>Fecha y hora de pago:</Text>
                            <Text style={{ color: '#111827', fontSize: 12, fontWeight: '500' }}>
                              {payment.fullDate}
                            </Text>
                          </View>

                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#6b7280', fontSize: 12 }}>Método de pago:</Text>
                            <Text style={{ color: '#111827', fontSize: 12, fontWeight: '500' }}>
                              Tarjeta Crédito ({payment.method.split(' ')[2]})
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </ThemedView>
  );
}