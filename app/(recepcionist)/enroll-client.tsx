import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { BackHandler, Image, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ArrowLeftIcon, CheckCircleIcon } from 'react-native-heroicons/solid';

export default function EnrollClientScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    date?: string;
    time?: string;
    capacity?: string;
    enrolled?: string;
    status?: string;
    instructor?: string;
  }>();

  const className = params.name || 'NOMBRE DE LA CLASE';
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleBackPress = useCallback(() => {
    router.back();
    return true;
  }, [router]);

  const handleEnroll = () => {
    if (!clientId.trim() || !clientName.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Aquí iría la lógica para inscribir al cliente
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.back();
  };

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => subscription.remove();
  }, [handleBackPress]);

  return (
    <ThemedView style={styles.container}>
      {/* Header con logo */}
      <View style={styles.header}>
        <Image 
          source={require('@/assets/images/Frame.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Botón de regresar */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <ArrowLeftIcon size={24} color="#1F2937" />
      </TouchableOpacity>

      {/* Contenido principal */}
      <View style={styles.content}>
        <ThemedText style={styles.title}>Inscribir Cliente</ThemedText>
        
        {/* Información de la clase */}
        <View style={styles.classInfoCard}>
          <ThemedText style={styles.classTitle}>{className}</ThemedText>
          <ThemedText style={styles.classDetails}>
            {params.date || 'Fecha'} • {params.time || 'Hora'}
          </ThemedText>
        </View>

        {/* Formulario de inscripción */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>ID del Cliente</ThemedText>
            <TextInput
              style={styles.input}
              value={clientId}
              onChangeText={setClientId}
              placeholder="Ingrese el ID del cliente"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Nombre del Cliente</ThemedText>
            <TextInput
              style={styles.input}
              value={clientName}
              onChangeText={setClientName}
              placeholder="Ingrese el nombre del cliente"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Botón de inscribir */}
          <TouchableOpacity 
            style={styles.enrollButton} 
            onPress={handleEnroll}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.enrollButtonText}>Inscribir</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de éxito */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={handleSuccessClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleSuccessClose}
        >
          <View style={styles.successModal}>
            <View style={styles.successIcon}>
              <CheckCircleIcon size={60} color="#10B981" />
            </View>
            
            <ThemedText style={styles.successTitle}>¡Éxito!</ThemedText>
            <ThemedText style={styles.successMessage}>
              Cliente inscrito exitosamente
            </ThemedText>
            <ThemedText style={styles.className}>
              {className}
            </ThemedText>
            
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleSuccessClose}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.successButtonText}>Aceptar</ThemedText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  logo: {
    width: 150,
    height: 50,
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  classInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  classTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  classDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  enrollButton: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 48,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  enrollButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  className: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  successButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
