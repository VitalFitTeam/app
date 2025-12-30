import { ThemedView } from '@/components/themed-view';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon, PencilSquareIcon, PhoneIcon, UserCircleIcon } from 'react-native-heroicons/solid';
import PhoneInput, { IPhoneInputRef } from 'react-native-international-phone-number';

export default function InstructorProfilePersonalScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const phoneInputRef = useRef<IPhoneInputRef>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [specialty, setSpecialty] = useState('Functional Strength');
  const [birthDate, setBirthDate] = useState('mm/dd/yy');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('No se encontró token en AsyncStorage');
          setLoading(false);
          return;
        }

        const userData = await vitalFitApi.user.WhoAmI(token);
        setFirstName(userData?.user?.first_name || '');
        setLastName(userData?.user?.last_name || '');
        setEmail(userData?.user?.email || '');
        setPhone(userData?.user?.phone || '');
      } catch (error: unknown) {
        let errorMessage = 'Ocurrió un error inesperado al obtener los datos del usuario.';
        if (isAPIError(error)) {
          errorMessage = error.messages.join(', ');
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        console.error('Error en WhoAmI (Perfil personal instructor):', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleToggleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  if (loading) {
    return (
      <ThemedView className='flex-1 justify-center items-center bg-white'>
        <ActivityIndicator size='large' color='#F27F2A' />
      </ThemedView>
    );
  }

  const displayName =
    lastName && firstName ? `${firstName} ${lastName}` : firstName || lastName || 'Instructor';

  return (
    <ThemedView className='flex-1 bg-white pt-10'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96 }}>
        <View
          className='w-full bg-[#F3F4F6] rounded-2xl py-2 mb-3 items-center justify-center'
          style={{ position: 'relative' }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={{ position: 'absolute', left: 12, top: 8, bottom: 8, justifyContent: 'center' }}>
            <ChevronLeftIcon width={20} height={20} color='#f97316' />
          </TouchableOpacity>

          <Text style={{ color: '#111827', fontSize: 16, fontWeight: '600' }}>Perfil</Text>
        </View>
        <View className='mb-4 items-center'>
          <View style={{ position: 'relative', marginBottom: 12 }}>
            <View className='w-24 h-24 rounded-full overflow-hidden bg-[#FED7AA] items-center justify-center'>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/31.jpg' }}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
            {isEditing && (
              <View
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: '#f97316',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: '#FFFFFF',
                }}>
                <PencilSquareIcon width={16} height={16} color='#FFFFFF' />
              </View>
            )}
          </View>
          <Text style={{ color: '#111827', fontSize: 20, fontWeight: '600' }}>{displayName}</Text>
          <Text style={{ color: '#6b7280', fontSize: 13, marginTop: 2 }}>Instructor</Text>
          <Text style={{ color: '#f97316', fontSize: 13, marginTop: 2 }}>Functional Strength</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          className='w-full rounded-2xl py-3 mb-5 items-center justify-center'
          style={{ backgroundColor: isEditing ? '#4b5563' : '#f97316' }}
          onPress={handleToggleEdit}>
          <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '700' }}>
            {isEditing ? 'Guardar cambios' : 'Editar'}
          </Text>
        </TouchableOpacity>
        <View className='mb-4 rounded-2xl bg-[#F3F4F6] px-4 py-4'>
          <View className='flex-row items-center mb-3'>
            <UserCircleIcon width={18} height={18} color='#111827' />
            <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#111827' }}>
              Información Personal
            </Text>
          </View>

          <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Nombre</Text>
          <TextInput
            editable={isEditing}
            value={firstName}
            onChangeText={setFirstName}
            placeholder='Nombre'
            placeholderTextColor='#9CA3AF'
            style={{
              backgroundColor: isEditing ? '#FFFFFF' : '#E5E7EB',
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 8,
              fontSize: 13,
              color: '#111827',
              marginBottom: 10,
            }}
          />

          <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Apellido</Text>
          <TextInput
            editable={isEditing}
            value={lastName}
            onChangeText={setLastName}
            placeholder='Apellido'
            placeholderTextColor='#9CA3AF'
            style={{
              backgroundColor: isEditing ? '#FFFFFF' : '#E5E7EB',
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 8,
              fontSize: 13,
              color: '#111827',
              marginBottom: 10,
            }}
          />

          <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Documento de identidad</Text>
          <TextInput
            editable={isEditing}
            value={documentId}
            onChangeText={setDocumentId}
            placeholder='Documento de identidad'
            placeholderTextColor='#9CA3AF'
            keyboardType='numeric'
            style={{
              backgroundColor: isEditing ? '#FFFFFF' : '#E5E7EB',
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 8,
              fontSize: 13,
              color: '#111827',
              marginBottom: 10,
            }}
          />

          <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Especialidad</Text>
          <TextInput
            editable={isEditing}
            value={specialty}
            onChangeText={setSpecialty}
            placeholder='Especialidad'
            placeholderTextColor='#9CA3AF'
            style={{
              backgroundColor: isEditing ? '#FFFFFF' : '#E5E7EB',
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 8,
              fontSize: 13,
              color: '#111827',
              marginBottom: 10,
            }}
          />

          <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Fecha de nacimiento</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              editable={isEditing}
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder='mm/dd/yy'
              placeholderTextColor='#9CA3AF'
              style={{
                backgroundColor: isEditing ? '#FFFFFF' : '#E5E7EB',
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 8,
                fontSize: 13,
                color: '#111827',
                paddingRight: 32,
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: 10,
                top: 10,
              }}>
              <Calendar size={18} color='#9CA3AF' />
            </View>
          </View>
        </View>

        <View className='mb-4 rounded-2xl bg-[#F3F4F6] px-4 py-4'>
          <View className='flex-row items-center mb-3'>
            <PhoneIcon width={18} height={18} color='#111827' />
            <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#111827' }}>
              Información de contacto
            </Text>
          </View>

          <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Correo electrónico</Text>
          <TextInput
            editable={false}
            value={email}
            placeholder='Correo electrónico'
            placeholderTextColor='#9CA3AF'
            keyboardType='email-address'
            style={{
              backgroundColor: '#E5E7EB',
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 8,
              fontSize: 13,
              color: '#111827',
              marginBottom: 10,
            }}
          />

          <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Teléfono</Text>
          {isEditing ? (
            <PhoneInput
              ref={phoneInputRef}
              value={phone || ''}
              onChangePhoneNumber={setPhone}
              defaultCountry='VE'
              placeholder='Número de teléfono'
              phoneInputStyles={{
                container: {
                  ...styles.phoneContainer,
                  opacity: 1,
                },
                flagContainer: styles.flagContainer,
                flag: styles.flag,
                caret: styles.caret,
                divider: styles.divider,
                callingCode: styles.callingCode,
                input: styles.phoneInput,
              }}
            />
          ) : (
            <TextInput
              editable={false}
              value={phone}
              placeholder='Teléfono'
              placeholderTextColor='#9CA3AF'
              keyboardType='phone-pad'
              style={{
                backgroundColor: '#E5E7EB',
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 8,
                fontSize: 13,
                color: '#111827',
              }}
            />
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  phoneContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    height: 44,
  },
  flagContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  flag: {},
  caret: {
    color: '#6b7280',
    fontSize: 16,
  },
  divider: {
    backgroundColor: '#E5E7EB',
  },
  callingCode: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '500',
  },
  phoneInput: {
    color: '#111827',
    fontSize: 14,
  },
});
