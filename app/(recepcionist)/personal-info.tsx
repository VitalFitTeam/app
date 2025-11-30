import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Aquí guardarías los datos
    router.push('/(recepcionist)/profile');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Aquí restaurarías los valores originales
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar + nombre */}
        <View style={styles.headerRow}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/32.jpg' }}
            style={styles.avatar}
          />
          <View style={styles.headerInfo}>
            <ThemedText style={styles.nameText}>Laura Torres</ThemedText>
            <ThemedText style={styles.roleText}>Recepcionista</ThemedText>
          </View>
        </View>

        {/* Botón editar */}
        {!isEditing && (
          <TouchableOpacity style={styles.editButton} activeOpacity={0.8} onPress={handleEdit}>
            <ThemedText style={styles.editButtonText}>Editar Información</ThemedText>
          </TouchableOpacity>
        )}

        {/* Información Personal */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Información Personal</ThemedText>

          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Nombre</ThemedText>
            <TextInput
              style={styles.input}
              value='Alani'
              placeholderTextColor='#9CA3AF'
              editable={isEditing}
            />
          </View>

          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Apellido</ThemedText>
            <TextInput
              style={styles.input}
              value='Barragán'
              placeholderTextColor='#9CA3AF'
              editable={isEditing}
            />
          </View>

          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Documento de identidad</ThemedText>
            <TextInput
              style={styles.input}
              value='12345688'
              placeholderTextColor='#9CA3AF'
              keyboardType='numeric'
              editable={isEditing}
            />
          </View>

          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Fecha de nacimiento</ThemedText>
            <TextInput
              style={styles.input}
              value='01/01/1995'
              placeholderTextColor='#9CA3AF'
              editable={isEditing}
            />
          </View>
        </View>

        {/* Información de contacto */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Información de contacto</ThemedText>

          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Correo electrónico</ThemedText>
            <TextInput
              style={styles.input}
              value='correo@ejemplo.com'
              placeholderTextColor='#9CA3AF'
              keyboardType='email-address'
              editable={isEditing}
            />
          </View>

          <View style={styles.fieldGroup}>
            <ThemedText style={styles.fieldLabel}>Teléfono</ThemedText>
            <TextInput
              style={styles.input}
              value='+58 123 456 7891'
              placeholderTextColor='#9CA3AF'
              keyboardType='phone-pad'
              editable={isEditing}
            />
          </View>
        </View>

        {/* Botones de acción en modo edición */}
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
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
});
