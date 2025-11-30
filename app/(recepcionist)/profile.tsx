import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ChevronRightIcon, QrCodeIcon } from 'react-native-heroicons/outline';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Eliminar el token de AsyncStorage
      await AsyncStorage.removeItem('token');
      // Navegar al login
      router.push('/(auth)/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header: avatar + nombre + rol */}
        <View style={styles.headerRow}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/32.jpg' }}
            style={styles.avatar}
          />
          <View style={styles.headerInfo}>
            <ThemedText style={styles.nameText}>Laura Torres</ThemedText>
            <ThemedText style={styles.roleText}>Recepcionista</ThemedText>
            <ThemedText style={styles.specialtyText}>Functional Strength</ThemedText>
          </View>
        </View>

        {/* About me */}
        <View style={styles.section}> 
          <ThemedText style={styles.sectionTitle}>Sobre mí</ThemedText>
          <ThemedText style={[styles.sectionBody, { fontFamily: 'BebasNeue-Regular' }]}>
            Recepcionista dedicada con experiencia en gestión de horarios, atención al cliente
            y coordinación de clases. Enfocada en brindar una experiencia fluida y organizada
            a todos los miembros del gimnasio.
          </ThemedText>
        </View>

        {/* Botón escanear QR */}
        <TouchableOpacity style={styles.qrButton} activeOpacity={0.8}>
          <QrCodeIcon size={18} color="#111827" />
          <ThemedText style={styles.qrButtonText}>Escanear QR</ThemedText>
        </TouchableOpacity>

        {/* Métricas */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <ThemedText style={styles.metricNumber}>6</ThemedText>
            <ThemedText style={styles.metricLabel}>Años</ThemedText>
          </View>
          <View style={styles.metricCard}>
            <ThemedText style={styles.metricNumber}>46</ThemedText>
            <ThemedText style={styles.metricLabel}>Clases</ThemedText>
          </View>
          <View style={styles.metricCard}>
            <ThemedText style={styles.metricNumber}>25</ThemedText>
            <ThemedText style={styles.metricLabel}>Clientes</ThemedText>
          </View>
        </View>

        {/* Configuración */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Configuración</ThemedText>

          {[
            'Información personal',
            'Seguridad',
            'Idioma',
            'Notificaciones',
            'Ayuda y soporte',
            'Términos y condiciones',
          ].map(item => (
            <TouchableOpacity
              key={item}
              style={styles.settingItem}
              activeOpacity={0.8}
              onPress={() => {
                if (item === 'Información personal') {
                  router.push('/(recepcionist)/personal-info');
                } else if (item === 'Seguridad') {
                  router.push('/(recepcionist)/security');
                } else if (item === 'Idioma') {
                  router.push('/language');
                } else if (item === 'Notificaciones') {
                  router.push('/(recepcionist)/notifications');
                } else if (item === 'Ayuda y soporte') {
                  // Por ahora mostramos una alerta ya que no existe la pantalla
                  alert('Función de ayuda y soporte en desarrollo');
                }
              }}
            >
              <View style={styles.settingBullet} />
              <ThemedText style={styles.settingText}>{item}</ThemedText>
              <ChevronRightIcon size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.logoutItem} activeOpacity={0.8} onPress={handleLogout}>
            <View style={styles.settingBullet} />
            <ThemedText style={styles.logoutText}>Cerrar sesión</ThemedText>
            <ChevronRightIcon size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 64,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 999,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 2,
  },
  specialtyText: {
    fontSize: 14,
    color: '#F97316',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F97316',
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  qrButton: {
    marginTop: 4,
    marginBottom: 24,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F97316',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: '#4B5563',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingBullet: {
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F97316',
  },
  logoutText: {
    flex: 1,
    fontSize: 14,
    color: '#F97316',
    fontWeight: '600',
  },
});
