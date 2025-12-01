import type { Client } from '@/components/recepcionista/ClientList';
import ClientList from '@/components/recepcionista/ClientList';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, BackHandler, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { CheckCircleIcon, MagnifyingGlassIcon, QrCodeIcon } from 'react-native-heroicons/outline';

export default function CheckInScreen() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [showAllClients, setShowAllClients] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const clients = Array.from({ length: 45 }).map((_, index) => ({
    id: (index + 1).toString(),
    name: `Cliente ${index + 1}`,
    level: `Nivel ${Math.floor(Math.random() * 10) + 1}`,
    time: `${15 + Math.floor(Math.random() * 4)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  }));

  // Mostrar solo los primeros 7 clientes inicialmente
  const displayedClients = showAllClients ? clients : clients.slice(0, 7);

  // Resetear a lista corta y scroll hacia arriba cuando la pantalla obtiene foco
  useFocusEffect(
    useCallback(() => {
      setShowAllClients(false);
      // Scroll hacia arriba con un pequeño delay para asegurar que el componente esté montado
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);

      // Manejar el botón de atrás para ir al inicio
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        router.replace('/(recepcionist)/dashboard');
        return true;
      });

      return () => backHandler.remove();
    }, [router])
  );

  const handleScanQR = () => {
    setIsScanning(true);
    
    // Simular escaneo de QR
    setTimeout(() => {
      setIsScanning(false);
      Alert.alert(
        'QR Escaneado',
        'Datos del QR: VITALFIT-MEMBER-12345\n\n¿Deseas procesar este check-in?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Procesar', onPress: () => processCheckIn() }
        ]
      );
    }, 2000);
  };

  const processCheckIn = () => {
    // Aquí iría la lógica para procesar el check-in
    Alert.alert('Éxito', 'Check-in procesado correctamente');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header con logo y título */}
        <View style={styles.header}>
        <Image 
          source={require('@/assets/images/Frame.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText style={styles.title}>Check-in de Clientes</ThemedText>
      </View>

      {/* Tarjeta principal de Validar Check-in */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <CheckCircleIcon width={20} height={20} color="#1F2937" />
          <ThemedText style={styles.cardTitle}>Validar Check-in</ThemedText>
        </View>

        {/* Campo de búsqueda */}
        <View style={styles.searchContainer}>
          <MagnifyingGlassIcon width={18} height={18} color="#1F2937" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por documento de identidad"
            placeholderTextColor="#71727A"
          />
        </View>

        {/* Botón Escanear QR */}
        <TouchableOpacity 
          style={styles.qrButton}
          onPress={handleScanQR}
          disabled={isScanning}
        >
          <QrCodeIcon width={16} height={16} color="#FFFFFF" />
          <ThemedText style={styles.qrButtonText}>Escanear QR</ThemedText>
        </TouchableOpacity>

        {/* Mensaje de preview */}
        <ThemedText style={styles.previewMessage}>
          Función de cámara no disponible en preview
        </ThemedText>
      </View>

      {/* Lista de clientes usando el componente reutilizable */}
      <ClientList
        clients={displayedClients}
        totalCapacity={100}
        onClientPress={(client: Client) => {
          console.log('Cliente seleccionado:', client);
          Alert.alert('Cliente', `Seleccionaste: ${client.name}`);
        }}
        onViewAllPress={() => {
          setShowAllClients(!showAllClients);
          console.log(showAllClients ? 'Mostrando menos clientes' : 'Mostrando todos los clientes');
        }}
        searchPlaceholder="Buscar cliente por nombre"
        title="Lista de clientes inscritos"
        showViewAllButton={!showAllClients}
      />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    marginLeft: 8,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F97316',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  qrButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  previewMessage: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  searchWrapper: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  searchInputClients: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  clientsHeader: {
    marginHorizontal: 20,
    marginBottom: 8,
  },
  clientsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientsTitle: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  clientsList: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  clientAvatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  clientLevel: {
    fontSize: 12,
    color: '#6B7280',
  },
  viewAllButton: {
    marginHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#F97316',
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  viewAllButtonText: {
    fontSize: 14,
    color: '#F97316',
    fontWeight: '500',
  },
});
