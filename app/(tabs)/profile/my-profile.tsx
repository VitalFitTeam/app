import { StyledTextInput } from '@/components/StyledTextInput';
import { ThemedView } from '@/components/themed-view';
import { ToastNotification } from '@/components/ToastNotification';
import { useUser } from '@/contexts/UserContext';
import vitalFitApi from '@/services/vitalfitSdk';

import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { isAPIError } from '@vitalfit/sdk';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon, PencilSquareIcon, PhoneIcon, UserCircleIcon } from 'react-native-heroicons/solid';
import PhoneInput, { IPhoneInputRef } from 'react-native-international-phone-number';
import { z } from 'zod';

const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

const ProfileSchema = z.object({
    firstName: z
        .string()
        .min(1, 'El nombre es requerido.')
        .regex(nameRegex, 'El nombre solo puede contener letras.'),
    lastName: z
        .string()
        .min(1, 'El apellido es requerido.')
        .regex(nameRegex, 'El apellido solo puede contener letras.'),
    documentId: z
        .string()
        .min(6, 'El documento debe tener al menos 6 dígitos.')
        .regex(/^[0-9]+$/, 'El documento solo puede contener números.'),
    birthDate: z
        .string()
        .min(1, 'La fecha de nacimiento es requerida.')
        .refine(
            (date) => {
                const birthDate = new Date(date);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age >= 18;
            },
            { message: 'Debes ser mayor de 18 años.' },
        ),
    phone: z
        .string()
        .optional()
        .refine(
            (phone) => {
                if (!phone) return true;
                const numericPhone = phone.replace(/\D/g, '');
                return numericPhone.length >= 10 && numericPhone.length <= 15;
            },
            { message: 'El número de teléfono debe tener entre 10 y 15 dígitos.' },
        ),
    gender: z
        .string()
        .min(1, 'El género es requerido.'),
});

type ProfileFormData = z.infer<typeof ProfileSchema>;

export default function MyProfileScreen() {
    const router = useRouter();
    const { user, updateLocalUser } = useUser();

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const phoneInputRef = useRef<IPhoneInputRef>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [toast, setToast] = useState<{
        visible: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
    }>({
        visible: false,
        type: 'success',
        title: '',
        message: '',
    });

    const [userId, setUserId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [documentId, setDocumentId] = useState('');
    const [birthDate, setBirthDate] = useState('mm/dd/yy');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            documentId: '',
            birthDate: '',
            phone: '',
            gender: '',
        },
    });

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        setUserId(user.userId);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setPhone(user.phone);
        setDocumentId(user.identityDocument);
        setGender(user.gender);

        if (user.birthDate) {
            const parsedDate = new Date(user.birthDate);
            setBirthDate(format(parsedDate, 'yyyy-MM-dd'));
        }

        setValue('firstName', user.firstName);
        setValue('lastName', user.lastName);
        setValue('documentId', user.identityDocument);
        setValue('birthDate', user.birthDate);
        setValue('phone', user.phone);
        setValue('gender', user.gender);
        setLoading(false);
    }, [setValue, user]);

    const onSubmit = async (data: ProfileFormData) => {
        setSaving(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('No se encontró token en AsyncStorage');
                setToast({
                    visible: true,
                    type: 'error',
                    title: 'Error',
                    message: 'No se encontró token de autenticación',
                });
                setSaving(false);
                return;
            }

            if (!userId) {
                console.error('No se encontró userId');
                setToast({
                    visible: true,
                    type: 'error',
                    title: 'Error',
                    message: 'No se encontró el ID del usuario',
                });
                setSaving(false);
                return;
            }

            const genderForApi = data.gender === 'M' ? 'male' : 'female';

            const updateData = {
                first_name: data.firstName,
                last_name: data.lastName,
                birth_date: data.birthDate,
                gender: genderForApi,
                email: email,
                phone: data.phone || undefined,
                identity_document: data.documentId,
            };

            console.log('Enviando datos:', updateData);

            await vitalFitApi.user.updateUserClient(userId, updateData, token);

            console.log('Actualización exitosa');

            setFirstName(data.firstName);
            setLastName(data.lastName);
            setDocumentId(data.documentId);
            setPhone(data.phone || '');
            setGender(data.gender);
            updateLocalUser({
                firstName: data.firstName,
                lastName: data.lastName,
                identityDocument: data.documentId,
                phone: data.phone || '',
                gender: data.gender,
                birthDate: data.birthDate,
            });

            if (data.birthDate) {
                const date = new Date(data.birthDate);
                setBirthDate(format(date, 'yyyy-MM-dd'));
            }

            setIsEditing(false);
            setToast({
                visible: true,
                type: 'success',
                title: '¡Perfil actualizado!',
                message: 'Tus cambios se guardaron correctamente',
            });
        } catch (error: unknown) {
            console.error('Error completo:', error);
            let errorMessage = 'Ocurrió un error inesperado al actualizar el perfil.';
            if (isAPIError(error)) {
                console.error('Error de API:', error.messages);
                errorMessage = error.messages.join(', ');
            } else if (error instanceof Error) {
                console.error('Error estándar:', error.message);
                errorMessage = error.message;
            }
            console.error('Error al actualizar el perfil (perfil cliente):', errorMessage);
            setToast({
                visible: true,
                type: 'error',
                title: 'Error',
                message: errorMessage,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleToggleEdit = () => {
        if (isEditing) {
            handleSubmit(onSubmit)();
        } else {
            setIsEditing(true);
        }
    };

    const handleCancelEdit = () => {
        reset({
            firstName,
            lastName,
            documentId,
            birthDate: birthDate !== 'mm/dd/yy' ? birthDate : '',
            phone,
            gender,
        });
        setIsEditing(false);
    };

    if (loading) {
        return (
            <ThemedView className='flex-1 justify-center items-center bg-white'>
                <ActivityIndicator size='large' color='#F27F2A' />
            </ThemedView>
        );
    }

    const displayName =
        lastName && firstName ? `${firstName} ${lastName}` : firstName || lastName || 'Cliente';

    return (
        <ThemedView className='flex-1 bg-white pt-10'>
            <ToastNotification
                visible={toast.visible}
                type={toast.type}
                title={toast.title}
                message={toast.message}
                onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
            />
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
                                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <Text style={{ color: '#6b7280', fontSize: 13, marginRight: 4 }}>Nivel 24</Text>
                        <Image
                            source={require('@/assets/images/medal2.png')}
                            style={{ width: 14, height: 14 }}
                            contentFit='contain'
                        />
                    </View>
                    <Text style={{ color: '#f97316', fontSize: 13, marginTop: 2 }}>Premium</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
                    <TouchableOpacity
                        activeOpacity={0.85}
                        className='flex-1 rounded-2xl py-3 items-center justify-center'
                        style={{ backgroundColor: isEditing ? '#4b5563' : '#f97316' }}
                        onPress={handleToggleEdit}
                        disabled={saving}>
                        {saving ? (
                            <ActivityIndicator size='small' color='#ffffff' />
                        ) : (
                            <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '700' }}>
                                {isEditing ? 'Guardar cambios' : 'Editar'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {isEditing && (
                        <TouchableOpacity
                            activeOpacity={0.85}
                            className='flex-1 rounded-2xl py-3 items-center justify-center'
                            style={{ backgroundColor: '#9CA3AF' }}
                            onPress={handleCancelEdit}
                            disabled={saving}>
                            <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '700' }}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View className='mb-4 rounded-2xl bg-[#F3F4F6] px-4 py-4'>
                    <View className='flex-row items-center mb-3'>
                        <UserCircleIcon width={18} height={18} color='#111827' />
                        <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#111827' }}>
                            Información Personal
                        </Text>
                    </View>

                    <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Nombre</Text>
                    {isEditing ? (
                        <Controller
                            control={control}
                            name='firstName'
                            render={({ field: { onChange, onBlur, value } }) => (
                                <StyledTextInput
                                    label={undefined}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder='Nombre'
                                    error={errors.firstName?.message}
                                />
                            )}
                        />
                    ) : (
                        <TextInput
                            editable={false}
                            value={firstName}
                            placeholder='Nombre'
                            placeholderTextColor='#9CA3AF'
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
                    )}

                    <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Apellido</Text>
                    {isEditing ? (
                        <Controller
                            control={control}
                            name='lastName'
                            render={({ field: { onChange, onBlur, value } }) => (
                                <StyledTextInput
                                    label={undefined}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder='Apellido'
                                    error={errors.lastName?.message}
                                />
                            )}
                        />
                    ) : (
                        <TextInput
                            editable={false}
                            value={lastName}
                            placeholder='Apellido'
                            placeholderTextColor='#9CA3AF'
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
                    )}

                    <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Documento de identidad</Text>
                    {isEditing ? (
                        <Controller
                            control={control}
                            name='documentId'
                            render={({ field: { onChange, onBlur, value } }) => (
                                <StyledTextInput
                                    label={undefined}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder='Documento de identidad'
                                    keyboardType='numeric'
                                    error={errors.documentId?.message}
                                />
                            )}
                        />
                    ) : (
                        <TextInput
                            editable={false}
                            value={documentId}
                            placeholder='Documento de identidad'
                            placeholderTextColor='#9CA3AF'
                            keyboardType='numeric'
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
                    )}

                    <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Fecha de nacimiento</Text>
                    {isEditing ? (
                        <Controller
                            control={control}
                            name='birthDate'
                            render={({ field: { onChange, value } }) => {
                                const date = value ? new Date(value) : new Date();
                                return (
                                    <View style={{ width: '100%' }}>
                                        <TouchableOpacity
                                            onPress={() => setShowDatePicker(true)}
                                            style={{ position: 'relative' }}>
                                            <StyledTextInput
                                                label={undefined}
                                                value={value ? format(date, 'yyyy-MM-dd') : ''}
                                                editable={false}
                                                pointerEvents='none'
                                                placeholder='yyyy-mm-dd'
                                                error={errors.birthDate?.message}
                                            />
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    right: 10,
                                                    bottom: 10,
                                                }}>
                                                <Calendar size={18} color='#9CA3AF' />
                                            </View>
                                        </TouchableOpacity>
                                        {showDatePicker && (
                                            <DateTimePicker
                                                value={date}
                                                mode='date'
                                                display='default'
                                                onChange={(event, selectedDate) => {
                                                    setShowDatePicker(false);
                                                    if (selectedDate) {
                                                        onChange(selectedDate.toISOString());
                                                    }
                                                }}
                                            />
                                        )}
                                    </View>
                                );
                            }}
                        />
                    ) : (
                        <View style={{ position: 'relative' }}>
                            <TextInput
                                editable={false}
                                value={birthDate}
                                placeholder='mm/dd/yy'
                                placeholderTextColor='#9CA3AF'
                                style={{
                                    backgroundColor: '#E5E7EB',
                                    borderRadius: 10,
                                    paddingHorizontal: 10,
                                    paddingVertical: 8,
                                    fontSize: 13,
                                    color: '#111827',
                                    paddingRight: 32,
                                    marginBottom: 10,
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
                    )}

                    <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Género</Text>
                    {isEditing ? (
                        <Controller
                            control={control}
                            name='gender'
                            render={({ field: { onChange, value } }) => (
                                <View style={{ width: '100%', marginBottom: 10 }}>
                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            onPress={() => onChange('M')}
                                            style={{
                                                flex: 1,
                                                backgroundColor: value === 'M' ? '#f97316' : '#E5E7EB',
                                                borderRadius: 10,
                                                paddingVertical: 10,
                                                alignItems: 'center',
                                            }}>
                                            <Text style={{ color: value === 'M' ? '#FFFFFF' : '#6b7280', fontSize: 13, fontWeight: '600' }}>
                                                Masculino
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            onPress={() => onChange('F')}
                                            style={{
                                                flex: 1,
                                                backgroundColor: value === 'F' ? '#f97316' : '#E5E7EB',
                                                borderRadius: 10,
                                                paddingVertical: 10,
                                                alignItems: 'center',
                                            }}>
                                            <Text style={{ color: value === 'F' ? '#FFFFFF' : '#6b7280', fontSize: 13, fontWeight: '600' }}>
                                                Femenino
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {errors.gender && (
                                        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                            {errors.gender.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                    ) : (
                        <TextInput
                            editable={false}
                            value={gender === 'M' ? 'Masculino' : gender === 'F' ? 'Femenino' : ''}
                            placeholder='Género'
                            placeholderTextColor='#9CA3AF'
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
                        <Controller
                            control={control}
                            name='phone'
                            render={({ field: { onChange, value, ref } }) => (
                                <View style={{ width: '100%' }}>
                                    <PhoneInput
                                        ref={ref || phoneInputRef}
                                        value={value || ''}
                                        onChangePhoneNumber={(phoneNumber) => onChange(phoneNumber)}
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
                                    {errors.phone && (
                                        <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                                            {errors.phone.message}
                                        </Text>
                                    )}
                                </View>
                            )}
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
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        height: 48,
    },
    flagContainer: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
    },
    flag: {
        width: 24,
        height: 16,
    },
    caret: {
        color: '#6B7280',
        fontSize: 12,
    },
    divider: {
        backgroundColor: '#E5E7EB',
    },
    callingCode: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    phoneInput: {
        fontSize: 14,
        color: '#111827',
    },
});