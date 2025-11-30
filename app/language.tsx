import { PrimaryButton } from '@/components/PrimaryButton';
import { Stack, useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // 1. Importamos el hook de traducción
import { Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Opciones de idioma disponibles
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
];

export default function LanguageScreen() {
  const router = useRouter();
  
  // 2. Obtenemos la función 't' y la instancia 'i18n'
  const { t, i18n } = useTranslation();

  // 3. El estado inicial es el idioma que está activo actualmente
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSaveLanguage = () => {
    // 4. Cambiamos el idioma globalmente
    i18n.changeLanguage(selectedLanguage);
    
    // Mostrar modal de éxito
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Redirigir al perfil del recepcionista
    router.replace('/(recepcionist)/profile');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: t('language'), // 'Idioma' o 'Language' según corresponda
            headerBackTitle: t('nav.back'), // 'Volver' o 'Back'
            headerShadowVisible: false,
            headerStyle: { backgroundColor: '#F2F2F7' },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        <View style={styles.optionsContainer}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.option}
              onPress={() => setSelectedLanguage(lang.code)}>
              <Text style={styles.optionText}>{lang.name}</Text>
              
              {/* Si es el seleccionado, mostramos el Check */}
              {/* Usamos el color Naranja (#F27F2A) para consistencia con tu app */}
              {selectedLanguage === lang.code && (
                <Check color='#F27F2A' size={24} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {/* El botón también se traduce */}
          <PrimaryButton title={t('save')} onPress={handleSaveLanguage} />
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
              <Check color="#10B981" size={60} />
            </View>
            
            <Text style={styles.successTitle}>¡Éxito!</Text>
            <Text style={styles.successMessage}>
              Cambiado exitosamente
            </Text>
            
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleSuccessClose}
              activeOpacity={0.8}
            >
              <Text style={styles.successButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// Estilos (iguales a los que tenías)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  container: {
    flex: 1,
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 16,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500', // Un poco más de peso para legibilidad
  },
  buttonContainer: {
    padding: 16,
    marginTop: 'auto',
  },
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