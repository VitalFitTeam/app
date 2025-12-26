import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useReservations } from '@/contexts/reservations';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/useToast';
import vitalFitApi from '@/services/vitalfitSdk';
import { isAPIError } from '@vitalfit/sdk';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, ClockIcon as OutlineClockIcon, UsersIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { CheckCircleIcon, CheckIcon, ExclamationCircleIcon, StarIcon, UserIcon } from 'react-native-heroicons/solid';

const styles = StyleSheet.create({
  heroImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
  },
});

export default function ClassDetailsScreen() {
  const router = useRouter();
  const { time, title, instructor, imageUrl, capacity, occupied, mode, classId, serviceId, instructorId, bookingId, startsAt } =
    useLocalSearchParams();

  const { isReserved, reserve, cancel } = useReservations();
  const { user } = useUser();
  const hasMembership = user?.membership?.status === 'Active';

  const classDateFormatted = useMemo(() => {
    try {
      const dateToFormat = startsAt ? new Date(String(startsAt)) : new Date();
      
      if (startsAt && String(startsAt).match(/^\d{4}-\d{2}-\d{2}$/)) {
        dateToFormat.setMinutes(dateToFormat.getMinutes() + dateToFormat.getTimezoneOffset());
      }

      return dateToFormat.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  }, [startsAt]);

  const [serviceDescription, setServiceDescription] = useState<string | null>(null);
  const [serviceImageUrl, setServiceImageUrl] = useState<string | null>(null);
  const [instructorImageUrl, setInstructorImageUrl] = useState<string | null>(null);

  type ApiServiceImage = { image_url?: string; is_primary?: boolean };
  type ApiServiceDetail = { description?: string; images?: ApiServiceImage[] };
  type ApiInstructorDetail = {
    avatar_url?: string;
    image_url?: string;
    profile_image_url?: string;
  };

  useEffect(() => {
    void (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        if (serviceId) {
          try {
            const serviceResp = await vitalFitApi.client.get({
              url: `/services/${String(serviceId)}`,
              jwt: token,
            });
            const s =
              (serviceResp as { data?: ApiServiceDetail }).data ??
              (serviceResp as ApiServiceDetail | undefined);
            if (s) {
              if (typeof s.description === 'string') {
                setServiceDescription(s.description);
              }
              const images: ApiServiceImage[] = Array.isArray(s.images) ? s.images : [];
              if (images.length > 0) {
                const primary = images.find((img) => img.is_primary) ?? images[0];
                if (primary?.image_url) {
                  setServiceImageUrl(primary.image_url);
                }
              }
            }
          } catch (error) {
            console.error('Error cargando servicio para detalle de clase:', error);
          }
        }

        if (instructorId) {
          try {
            const instResp = await vitalFitApi.client.get({
              url: `/instructor/${String(instructorId)}`,
              jwt: token,
            });
            const inst =
              (instResp as { data?: ApiInstructorDetail }).data ??
              (instResp as ApiInstructorDetail | undefined);
            const avatar = inst?.avatar_url || inst?.image_url || inst?.profile_image_url;
            if (typeof avatar === 'string' && avatar.startsWith('http')) {
              setInstructorImageUrl(avatar);
            }
          } catch (error) {
            console.error('Error cargando instructor para detalle de clase:', error);
          }
        }
      } catch {
        // Se ignora el error de carga inicial
      }
    })();
  }, [serviceId, instructorId]);

  const heroSource = useMemo(() => {
    if (serviceImageUrl && /^https?:\/\//i.test(serviceImageUrl)) {
      return { uri: serviceImageUrl };
    }

    if (typeof imageUrl === 'number') {
      return imageUrl;
    }

    const url = imageUrl as string | undefined;
    if (url && /^https?:\/\//i.test(url)) {
      return { uri: url };
    }

    if (!serviceId) {
      return require('@/assets/images/yoga-w.jpg');
    }

    return null;
  }, [imageUrl, serviceImageUrl, serviceId]);

  const description = useMemo(() => {
    if (serviceDescription) return serviceDescription;
    if (serviceId) return '';
    const t = String(title || '').toLowerCase();
    const map: Record<string, string> = {
      zumba: 'Clase de baile fitness con ritmos latinos para mejorar resistencia y coordinación. Ideal para todos los niveles y enfocada en divertirse mientras quemas calorías.',
      spinning:
        'Entrenamiento en bicicleta estacionaria de alta intensidad que mejora la capacidad cardiovascular y fortalece piernas y glúteos con intervalos y cambios de ritmo.',
      'yoga flow':
        'Secuencia fluida de posturas que trabaja fuerza, flexibilidad y respiración consciente. Perfecta para reducir el estrés y mejorar la movilidad general.',
      crossfit:
        'Entrenamiento funcional de alta intensidad que combina levantamiento olímpico, gimnasia y trabajo metabólico. Mejora fuerza, potencia y resistencia con WODs variados.',
    };
    return (
      map[t] ||
      'Entrenamiento diseñado para mejorar tu condición física con foco en técnica y progreso seguro. Incluye trabajo de fuerza, movilidad y resistencia.'
    );
  }, [serviceDescription, serviceId, title]);

  const capNum = Number(capacity ?? 25);
  const occNumInitial = Number(occupied ?? 18);
  const [forceFull] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const isFullInitial = occNumInitial >= capNum;
  const effectiveFull = isFullInitial || forceFull;
  const occNum = effectiveFull ? capNum : occNumInitial;

  const id = useMemo(() => `${String(title || '')}|${String(time || '')}`, [title, time]);
  const reservedFromContext = isReserved(id);
  const hasBookingId = Boolean(bookingId);
  const reserved = reservedFromContext || hasBookingId;

  const { showToast } = useToast();
  const isCrossfitCompleted =
    String(title || '').toLowerCase() === 'crossfit' && effectiveFull;

  const timeRange = useMemo(() => {
    const raw = String(time || '').trim();
    if (!raw) return '07:00 - 08:00 AM';
    if (raw.includes('-')) return raw;
    const m = raw.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
    if (!m) return raw;
    const [, hh, mm, ap] = m;
    let hour = parseInt(hh, 10) % 12;
    if (ap.toUpperCase() === 'PM') hour += 12;
    const start = new Date(2000, 0, 1, hour, parseInt(mm, 10));
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const fmt = (d: Date) => {
      let h = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const suffix = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      if (h === 0) h = 12;
      return `${h.toString().padStart(2, '0')}:${minutes} ${suffix}`;
    };
    return `${fmt(start)} - ${fmt(end)}`;
  }, [time]);

  const isInstructorMode = String(mode || '').toLowerCase() === 'instructor';

  const [instructorFirstName, setInstructorFirstName] = useState<string | null>(null);
  const [instructorLastName, setInstructorLastName] = useState<string | null>(null);

  useEffect(() => {
    if (!isInstructorMode) return;

    const fetchInstructor = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const userData = await vitalFitApi.user.WhoAmI(token);
        setInstructorFirstName(userData?.user?.first_name || null);
        setInstructorLastName(userData?.user?.last_name || null);
      } catch {
        console.error('Error fetching instructor data');
      }
    };

    fetchInstructor();
  }, [isInstructorMode]);

  const [activeTab, setActiveTab] = useState<'clientes' | 'pasar-lista'>('clientes');
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'late' | 'absent'>>({});
  const [search, setSearch] = useState('');
  const [classNotes, setClassNotes] = useState('');

  const filteredClients = useMemo(
    () => {
      const instructorClients = [
        { id: '1', name: 'Juan Perez', level: 'Nivel 5', program: 'Fuerza Máxima - Semana 2' },
        { id: '2', name: 'María López', level: 'Nivel 3', program: 'Resistencia Funcional - Semana 1' },
        { id: '3', name: 'Carlos Pérez', level: 'Nivel 4', program: 'Hipertrofia - Semana 4' },
        { id: '4', name: 'Ana García', level: 'Nivel 2', program: 'Inicio Funcional - Semana 3' },
      ];

      return instructorClients.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase().trim()),
      );
    },
    [search],
  );

  if (isInstructorMode) {
    return (
      <ThemedView
        lightColor='#FFFFFF'
        darkColor='#050816'
        className='flex-1 p-4 pt-12'>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className='w-full bg-[#F3F4F6] rounded-2xl py-2 mb-4 flex-row items-center justify-center'>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              className='absolute left-4'>
              <ChevronLeftIcon width={20} height={20} color='#f97316' />
            </TouchableOpacity>
            <ThemedText
              lightColor='#111827'
              className='text-base font-semibold'
              style={{ fontFamily: 'System', fontSize: 16, fontWeight: '600' }}>
              Detalles clase
            </ThemedText>
          </View>
          <Image source={heroSource} style={styles.heroImage} contentFit='cover' />

          <ThemedText
            lightColor='#111827'
            darkColor='#ffffff'
            className='text-3xl font-extrabold mt-4 mb-1'
            style={{ fontFamily: 'BebasNeue-Regular' }}>
            {String(title || 'Nombre de la clase').toUpperCase()}
          </ThemedText>

          <View className='mb-1'>
            <ThemedText
              lightColor='#6b7280'
              darkColor='#d4d4d4'
              className='text-sm'
              style={{ fontFamily: 'Montserrat_400Regular' }}>
              {classDateFormatted}
            </ThemedText>
          </View>

          <View className='mb-1'>
            <ThemedText
              lightColor='#4b5563'
              darkColor='#e5e5e5'
              className='text-sm'
              style={{ fontFamily: 'Montserrat_500Medium' }}>
              18 / 25 cupos ocupados
            </ThemedText>
          </View>

          <View className='mb-3'>
            <ThemedText
              lightColor='#f97316'
              darkColor='#f97316'
              className='font-bold'>
              07:00 - 08:00 AM
            </ThemedText>
          </View>

          <View className='flex-row items-center mb-3'>
            <StarIcon size={16} color='#F59E0B' />
            <ThemedText
              lightColor='#4b5563'
              darkColor='#e5e5e5'
              className='ml-2 text-sm'
              style={{ fontFamily: 'Montserrat_400Regular' }}>
              4.9 (231 reviews)
            </ThemedText>
          </View>

          <View className='flex-row items-center mb-4'>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/31.jpg' }}
              style={{ width: 28, height: 28, borderRadius: 9999 }}
              contentFit='cover'
            />
            <ThemedText
              lightColor='#4b5563'
              darkColor='#e5e5e5'
              className='ml-2'
              style={{ fontFamily: 'Montserrat_500Medium' }}>
              {instructorFirstName || instructorLastName
                ? `${instructorFirstName ?? ''} ${instructorLastName ?? ''}`.trim()
                : String(instructor || 'Nombre del Instructor')}
            </ThemedText>
          </View>

          <View className='mb-2'>
            <ThemedText
              lightColor='#f97316'
              darkColor='#f97316'
              className='font-semibold'
              style={{ fontFamily: 'Montserrat_600SemiBold' }}>
              Nivel: intermedio
            </ThemedText>
          </View>

          <View className='mb-4'>
            <ThemedText
              lightColor='#111827'
              darkColor='#ffffff'
              className='mb-1'
              style={{ fontFamily: 'Montserrat_600SemiBold' }}>
              Descripción de la clase:
            </ThemedText>
            <ThemedText
              lightColor='#4b5563'
              darkColor='#ffffff'
              className='text-sm leading-relaxed'
              style={{ fontFamily: 'Montserrat_400Regular' }}>
              Este entrenamiento de fuerza se enfoca en el desarrollo muscular y la resistencia. Incluye ejercicios con pesas,
              bandas de resistencia y peso corporal. Ideal para todos los niveles.
            </ThemedText>
          </View>

          <View className='flex-row bg-[#F3F4F6] rounded-2xl p-1 mb-3'>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-xl items-center ${
                activeTab === 'clientes' ? 'bg-white' : 'bg-transparent'
              }`}
              activeOpacity={0.7}
              onPress={() => setActiveTab('clientes')}>
              <Text
                className={`font-semibold ${
                  activeTab === 'clientes' ? 'text-[#111827]' : 'text-[#6b7280]'
                }`}>
                Clientes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-xl items-center ${
                activeTab === 'pasar-lista' ? 'bg-white' : 'bg-transparent'
              }`}
              activeOpacity={0.7}
              onPress={() => setActiveTab('pasar-lista')}>
              <Text
                className={`font-semibold ${
                  activeTab === 'pasar-lista' ? 'text-[#111827]' : 'text-[#6b7280]'
                }`}>
                Pasar lista
              </Text>
            </TouchableOpacity>
          </View>

          <View className='mb-3'>
            <View className='border border-[#e5e7eb] rounded-2xl px-3 py-2 bg-white flex-row items-center'>
              <MagnifyingGlassIcon width={18} height={18} color='#f97316' />
              <TextInput
                placeholder='Nombre del cliente'
                placeholderTextColor='#9ca3af'
                value={search}
                onChangeText={setSearch}
                style={{ fontSize: 14, color: '#111827', marginLeft: 8, flex: 1 }}
              />
            </View>
          </View>

          <View className='mb-6'>
            {activeTab === 'clientes' ? (
              <View className='rounded-2xl bg-white px-4 py-3 border border-[#e5e7eb] shadow-sm'>
                <View className='flex-row items-center mb-3'>
                  <UsersIcon size={18} color='#f97316' />
                  <Text className='ml-2 text-[14px] font-medium text-[#111827]'>
                    Lista de clientes inscritos
                  </Text>
                </View>

                {filteredClients.map((client) => (
                  <TouchableOpacity
                    key={client.id}
                    className='flex-row items-center justify-between bg-[#F8F9FB] rounded-2xl px-4 py-4 mb-3'
                    activeOpacity={0.8}>
                    <View className='flex-row items-center flex-1'>
                      <View className='w-10 h-10 rounded-xl bg-[#FED7AA] justify-center items-center mr-3'>
                        <UserIcon size={22} color='#f97316' />
                      </View>
                      <View className='flex-1'>
                        <Text className='text-[14px] font-bold text-[#1F2024]'>
                          {client.name}
                        </Text>
                        <Text className='text-[12px] text-[#71727A]'>
                          {client.level}
                        </Text>
                      </View>
                    </View>
                    <ChevronRightIcon size={12} color='#71727A' />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View className='rounded-2xl bg-white px-4 py-4 border border-[#e5e7eb] shadow-sm'>
                <View className='flex-row items-center mb-4'>
                  <UsersIcon size={18} color='#f97316' />
                  <Text className='ml-2 text-[14px] font-medium text-[#111827]'>
                    Clientes inscritos
                  </Text>
                </View>

                {filteredClients.map((client) => {
                  const status = attendance[client.id];
                  return (
                    <View
                      key={client.id}
                      className='bg-[#F8F9FB] rounded-2xl px-4 py-4 mb-4'>
                      <View className='flex-row items-center mb-2'>
                        <View className='w-12 h-12 rounded-full bg-[#FED7AA] justify-center items-center mr-3'>
                          <UserIcon size={26} color='#f97316' />
                        </View>
                        <View className='flex-1'>
                          <Text className='text-[16px] font-bold text-[#1F2024]'>
                            {client.name}
                          </Text>
                          <Text className='text-[12px] text-[#71727A] mb-1'>
                            {client.level}
                          </Text>
                        </View>
                      </View>

                      <View className='mb-4'>
                        <ThemedText
                          lightColor='#111827'
                          darkColor='#e5e5e5'
                          className='text-[15px] font-semibold'
                          style={{ fontFamily: 'Montserrat_600SemiBold' }}>
                          {client.program}
                        </ThemedText>
                      </View>

                      <View className='flex-row gap-2'>
                        <TouchableOpacity
                          className={`flex-1 flex-row justify-center items-center rounded-xl py-3 ${
                            status === 'present'
                              ? 'bg-[#f97316]'
                              : 'bg-white border border-[#f97316]'
                          }`}
                          activeOpacity={0.8}
                          onPress={() =>
                            setAttendance((prev) => ({ ...prev, [client.id]: 'present' }))
                          }>
                          <CheckIcon size={16} color={status === 'present' ? '#ffffff' : '#f97316'} strokeWidth={3} />
                          <Text
                            className={`ml-2 text-[13px] ${
                              status === 'present' ? 'text-white' : 'text-[#f97316]'
                            }`}
                            style={{ fontFamily: 'Montserrat_600SemiBold' }}>
                            Presente
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          className={`flex-1 flex-row justify-center items-center rounded-xl py-3 ${
                            status === 'late'
                              ? 'bg-[#D1D5DB]'
                              : 'bg-white border border-[#D1D5DB]'
                          }`}
                          activeOpacity={0.8}
                          onPress={() =>
                            setAttendance((prev) => ({ ...prev, [client.id]: 'late' }))
                          }>
                          <OutlineClockIcon size={16} color={status === 'late' ? '#374151' : '#9ca3af'} strokeWidth={2.5} />
                          <Text
                            className={`ml-2 text-[13px] ${
                              status === 'late' ? 'text-[#374151]' : 'text-[#9ca3af]'
                            }`}
                            style={{ fontFamily: 'Montserrat_600SemiBold' }}>
                            Tarde
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          className={`flex-1 flex-row justify-center items-center rounded-xl py-3 bg-white border ${
                            status === 'absent' ? 'border-[#374151]' : 'border-[#e5e7eb]'
                          }`}
                          activeOpacity={0.8}
                          onPress={() =>
                            setAttendance((prev) => ({ ...prev, [client.id]: 'absent' }))
                          }>
                          <XMarkIcon size={16} color='#374151' strokeWidth={2.5} />
                          <Text
                            className='ml-2 text-[13px] text-[#374151]'
                            style={{ fontFamily: 'Montserrat_600SemiBold' }}>
                            Ausente
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}

                <View className='h-[1px] bg-[#f97316] w-full mb-4 mt-1' />

                <View className='mt-1'>
                  <ThemedText
                    lightColor='#111827'
                    darkColor='#ffffff'
                    className='mb-2'
                    style={{ fontFamily: 'Montserrat_600SemiBold' }}>
                    Notas internas de la clase
                  </ThemedText>

                  <View className='mb-3'>
                    <TextInput
                      multiline
                      numberOfLines={4}
                      placeholder='Añade notas sobre esta clase...'
                      placeholderTextColor='#9ca3af'
                      value={classNotes}
                      onChangeText={setClassNotes}
                      style={{
                        borderWidth: 1,
                        borderColor: '#d1d5db',
                        borderRadius: 16,
                        paddingHorizontal: 12,
                        paddingVertical: 12,
                        minHeight: 120,
                        textAlignVertical: 'top',
                        fontSize: 13,
                        color: '#111827',
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    className='w-full py-3 rounded-2xl mb-3 items-center justify-center'
                    style={{ backgroundColor: '#4b5563', borderWidth: 1, borderColor: '#e5e7eb' }}
                    onPress={() =>
                      showToast(
                        'success',
                        'Notas guardadas',
                        'Las notas internas se han guardado correctamente.'
                      )
                    }>
                    <ThemedText
                      lightColor='#f9fafb'
                      darkColor='#f9fafb'
                      className='text-sm'
                      style={{ fontFamily: 'Montserrat_500Medium' }}>
                      Guardar notas
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    className='w-full py-3 rounded-2xl items-center justify-center'
                    style={{ backgroundColor: '#f97316' }}
                    onPress={() =>
                      showToast(
                        'success',
                        'Asistencia guardada',
                        'La asistencia de la clase se ha guardado correctamente.'
                      )
                    }>
                    <ThemedText
                      lightColor='#ffffff'
                      darkColor='#ffffff'
                      className='text-sm font-semibold'
                      style={{ fontFamily: 'Montserrat_600SemiBold' }}>
                      Guardar asistencia
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      lightColor='#FFFFFF'
      darkColor='#050816'
      className='flex-1 p-4 pt-12'>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='w-full bg-[#F3F4F6] rounded-2xl py-2 mb-4 flex-row items-center justify-center'>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            className='absolute left-4'>
            <ChevronLeftIcon width={20} height={20} color='#f97316' />
          </TouchableOpacity>
          <ThemedText
            lightColor='#111827'
            className='text-base font-semibold'
            style={{ fontFamily: 'System', fontSize: 16, fontWeight: '600' }}>
            Detalles clase
          </ThemedText>
        </View>
        <Image source={heroSource} style={styles.heroImage} contentFit='cover' />

        <ThemedText
          lightColor='#111827'
          darkColor='#ffffff'
          className='text-3xl font-extrabold mt-4 mb-1'
          style={{ fontFamily: 'BebasNeue-Regular' }}>
          {String(title || 'Nombre de la clase').toUpperCase()}
        </ThemedText>

        <View className='mb-1'>
          <ThemedText
            lightColor='#6b7280'
            darkColor='#d4d4d4'
            className='text-sm'
            style={{ fontFamily: 'Montserrat_400Regular' }}>
            {classDateFormatted}
          </ThemedText>
        </View>

        {effectiveFull && !isCrossfitCompleted && (
          <View
            className='mb-2 flex-row items-center rounded-2xl px-4 py-2'
            style={{ backgroundColor: '#fecaca' }}>
            <View
              className='items-center justify-center mr-3 rounded-full'
              style={{ width: 26, height: 26, backgroundColor: '#f97373' }}>
              <ExclamationCircleIcon size={15} color='#ffffff' />
            </View>
            <ThemedText
              lightColor='#b91c1c'
              darkColor='#b91c1c'
              className='text-xs font-medium'>
              La clase se llenó mientras la reservabas.
            </ThemedText>
          </View>
        )}

        <View className='mb-1'>
          <ThemedText
            lightColor={effectiveFull ? '#b91c1c' : '#4b5563'}
            darkColor={effectiveFull ? '#fca5a5' : '#e5e5e5'}
            className='text-sm'
            style={{ fontFamily: 'Montserrat_500Medium' }}>
            {occNum} / {capNum} cupos ocupados
          </ThemedText>
        </View>

        {reserved && (
          <View className='mb-3'>
            <View className='self-start bg-emerald-500 px-3 py-1 rounded-full'>
              <ThemedText
                lightColor='#ffffff'
                darkColor='#ffffff'
                className='text-xs font-semibold'>
                Reservada
              </ThemedText>
            </View>
          </View>
        )}

        <View className='mb-3'>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='font-bold'>
            {timeRange}
          </ThemedText>
        </View>

        <View className='flex-row items-center mb-4'>
          <Image
            source={
              instructorImageUrl && instructorImageUrl.startsWith('http')
                ? { uri: instructorImageUrl }
                : { uri: 'https://randomuser.me/api/portraits/men/32.jpg' }
            }
            style={{ width: 28, height: 28, borderRadius: 9999 }}
            contentFit='cover'
          />
          <ThemedText
            lightColor='#4b5563'
            darkColor='#e5e5e5'
            className='ml-2'
            style={{ fontFamily: 'Montserrat_500Medium' }}>
            {String(instructor || 'Nombre del Instructor')}
          </ThemedText>
        </View>

        <View className='mb-4'>
          <ThemedText
            lightColor='#111827'
            darkColor='#ffffff'
            className='mb-1'
            style={{ fontFamily: 'Montserrat_600SemiBold' }}>
            Descripción de la clase:
          </ThemedText>
          <ThemedText
            lightColor='#4b5563'
            darkColor='#ffffff'
            className='text-sm leading-relaxed'
            style={{ fontFamily: 'Montserrat_400Regular' }}>
            {description}
          </ThemedText>
        </View>

        {isCrossfitCompleted ? (
          <View className='mb-6 items-center'>
            <View className='flex-row items-center rounded-full px-4 py-2 bg-emerald-50'>
              <CheckCircleIcon size={18} color='#22c55e' />
              <ThemedText
                lightColor='#166534'
                darkColor='#e5e5e5'
                className='ml-2 text-xs font-semibold'>
                Completado
              </ThemedText>
            </View>
          </View>
        ) : (
          <View className='mb-6'>
            <PrimaryButton
              title={effectiveFull ? 'Clase llena' : reserved ? 'Cancelar' : 'Reservar'}
              disabled={effectiveFull || (!hasMembership && !reserved)}
              style={{ backgroundColor: effectiveFull || (!hasMembership && !reserved) ? '#6b7280' : reserved ? '#ef4444' : '#f97316' }}
              onPress={async () => {
                if (effectiveFull) return;

                if (reserved) {
                  setShowCancelModal(true);
                  return;
                }

                try {
                  const token = await AsyncStorage.getItem('token');
                  if (!token) {
                    showToast(
                      'error',
                      'Sesión no válida',
                      'Inicia sesión nuevamente para reservar la clase.',
                    );
                    return;
                  }

                  if (!classId) {
                    showToast(
                      'error',
                      'No se pudo reservar',
                      'Falta el identificador de la clase.',
                    );
                    return;
                  }

                  const whoAmI = (await vitalFitApi.user.WhoAmI(token)) as unknown as {
                    user?: { id?: string; user_id?: string };
                  };
                  const userId = whoAmI?.user?.id || whoAmI?.user?.user_id;

                  await vitalFitApi.client.post({
                    url: `/schedule/${String(classId)}/book`,
                    jwt: token,
                    data: userId ? { user_id: String(userId) } : undefined,
                  });

                  const img =
                    typeof heroSource === 'number'
                      ? heroSource
                      : (imageUrl as string | number | undefined);

                  await reserve({
                    id,
                    title: String(title || ''),
                    time: String(time || ''),
                    instructor: String(instructor || ''),
                    imageUrl: img,
                  });

                  showToast(
                    'success',
                    'Clase reservada',
                    'Tu clase ha sido reservada correctamente.',
                  );

                  router.back();
                } catch (error: unknown) {
                  let message = 'Ocurrió un error al reservar la clase.';
                  if (isAPIError(error)) {
                    message = error.messages.join(', ');
                  } else if (error instanceof Error) {
                    message = error.message;
                  }
                  console.error('Error al reservar clase:', error);
                  showToast('error', 'No se pudo reservar', message);
                }
              }}
            />
            {!hasMembership && !reserved && (
              <View className='mt-2 items-center'>
                <ThemedText lightColor='#ef4444' darkColor='#ef4444' className='text-xs font-medium'>
                  Necesitas una membresía activa para reservar
                </ThemedText>
              </View>
            )}
          </View>
        )}
        <View className='items-center justify-center mb-2'>
          <ThemedText
            lightColor='#9ca3af'
            darkColor='#9ca3af'
            className='italic text-center text-xs'>
            “Podrás cancelar hasta 2h antes del inicio”
          </ThemedText>
        </View>
      </ScrollView>

      <Modal
        visible={showCancelModal}
        transparent
        animationType='fade'
        onRequestClose={() => setShowCancelModal(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}
          onPress={() => setShowCancelModal(false)}>
          <View
            style={{ backgroundColor: '#ffffff', borderRadius: 24, paddingVertical: 24, paddingHorizontal: 20, width: '100%', maxWidth: 360 }}>
            <ThemedText
              lightColor='#111827'
              darkColor='#ffffff'
              className='text-xl font-bold text-center mb-2'>
              ¿Cancelar reserva?
            </ThemedText>
            <ThemedText
              lightColor='#4b5563'
              darkColor='#9ca3af'
              className='text-sm text-center mb-6'>
              Perderás tu cupo en esta clase. ¿Estás seguro?
            </ThemedText>
            <View className='gap-3'>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={async () => {
                  try {
                    const token = await AsyncStorage.getItem('token');
                    if (!token) {
                      showToast(
                        'error',
                        'Sesión no válida',
                        'Inicia sesión nuevamente para cancelar la reserva.',
                      );
                      return;
                    }

                    if (bookingId) {
                      await vitalFitApi.client.patch({
                        url: `/bookings/${String(bookingId)}/cancel`,
                        jwt: token,
                      });
                    }

                    await cancel(id);
                    setShowCancelModal(false);

                    showToast(
                      'success',
                      'Reserva cancelada',
                      'Tu reserva ha sido cancelada correctamente.',
                    );

                    router.back();
                  } catch (error: unknown) {
                    let message = 'Ocurrió un error al cancelar la reserva.';
                    if (isAPIError(error)) {
                      message = error.messages.join(', ');
                    } else if (error instanceof Error) {
                      message = error.message;
                    }
                    console.error('Error al cancelar reserva:', error);
                    showToast('error', 'No se pudo cancelar', message);
                  }
                }}
                className='py-3 rounded-2xl items-center'
                style={{ backgroundColor: '#f97316' }}>
                <ThemedText
                  lightColor='#ffffff'
                  darkColor='#ffffff'
                  className='text-base font-bold'>
                  Aceptar
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowCancelModal(false)}
                className='py-3 rounded-2xl items-center'
                style={{ backgroundColor: '#e5e7eb' }}>
                <ThemedText
                  lightColor='#111827'
                  darkColor='#ffffff'
                  className='text-base font-bold'>
                  Volver
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  );
}