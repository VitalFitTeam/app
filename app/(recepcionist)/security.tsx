import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useUser } from '@/contexts/UserContext';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, BackHandler, Image, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';

export default function SecurityScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Local state for user deleted in favor of context


  const handleBackPress = useCallback(() => {
    if (isEditing) {
      setIsEditing(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      return true;
    } else {
      router.replace('/(recepcionist)/profile');
      return true;
    }
  }, [router, isEditing]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => subscription.remove();
    }, [handleBackPress])
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const validateForm = () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Por favor llene el formulario');
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    
    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    setIsEditing(false);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Image
            source={
              user?.profilePicture
                ? { uri: user.profilePicture }
                : user?.gender === 'F'
                ? require('@/assets/images/Female.svg')
                : require('@/assets/images/Man.svg')
            }
            style={styles.avatar}
          />
          <View style={styles.headerInfo}>
            <ThemedText style={styles.nameText}>
              {user ? (user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName) : 'Recepcionista'}
            </ThemedText>
            <ThemedText style={styles.roleText}>{user?.roleName || 'Recepcionista'}</ThemedText>
          </View>
        </View>

        {!isEditing && (
          <TouchableOpacity style={styles.editButton} activeOpacity={0.8} onPress={handleEdit}>
            <ThemedText style={styles.editButtonText}>Editar Seguridad</ThemedText>
          </TouchableOpacity>
        )}

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Cambiar contraseña</ThemedText>

          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Contraseña actual</ThemedText>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder='Contraseña actual'
                placeholderTextColor='#9CA3AF'
                secureTextEntry={!showCurrentPassword}
                editable={isEditing}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={!isEditing}
              >
                {showCurrentPassword ? (
                  <EyeSlashIcon size={20} color="#6B7280" />
                ) : (
                  <EyeIcon size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Nueva contraseña</ThemedText>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder='Nueva contraseña'
                placeholderTextColor='#9CA3AF'
                secureTextEntry={!showNewPassword}
                editable={isEditing}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
                disabled={!isEditing}
              >
                {showNewPassword ? (
                  <EyeSlashIcon size={20} color="#6B7280" />
                ) : (
                  <EyeIcon size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Confirmar nueva contraseña</ThemedText>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder='Confirmar contraseña'
                placeholderTextColor='#9CA3AF'
                secureTextEntry={!showConfirmPassword}
                editable={isEditing}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={!isEditing}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon size={20} color="#6B7280" />
                ) : (
                  <EyeIcon size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {isEditing && (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} activeOpacity={0.8} onPress={handleCancel}>
              <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={handleSave}>
              <ThemedText style={styles.saveButtonText}>Guardar</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal
        transparent={true}
        visible={showSuccessModal}
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>¡Éxito!</ThemedText>
            <ThemedText style={styles.modalMessage}>
              Los cambios fueron guardados exitosamente
            </ThemedText>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSuccessClose}
            >
              <ThemedText style={styles.modalButtonText}>Aceptar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 999,
    marginBottom: 8,
  },
  headerInfo: {
    alignItems: 'center',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  roleText: {
    fontSize: 14,
    color: '#4B5563',
  },
  editButton: {
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: '#F97316',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6B7280',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#F97316',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#F97316',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    minWidth: 120,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
