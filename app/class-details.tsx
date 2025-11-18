import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ToastNotification } from '@/components/ToastNotification';
import { useReservations } from '@/contexts/reservations';
import { useToast } from '@/hooks/useToast';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CheckCircleIcon, ExclamationCircleIcon, StarIcon } from 'react-native-heroicons/solid';

const styles = StyleSheet.create({
  heroImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
  },
});

export default function ClassDetailsScreen() {
  const { time, title, instructor, imageUrl, capacity, occupied } = useLocalSearchParams();
  const { isReserved, reserve, cancel } = useReservations();

  const todayFormatted = useMemo(() => {
    try {
      return new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  }, []);

  const heroSource = useMemo(() => {
    const t = String(title || '').toLowerCase();
    const localByTitle: Record<string, number> = {
      zumba: require('@/assets/images/zumba-w.jpg'),
      spinning: require('@/assets/images/spinning-w.jpg'),
      'yoga flow': require('@/assets/images/yoga-w.jpg'),
      crossfit: require('@/assets/images/crossfit-w.jpg'),
    };
    const fromTitle = localByTitle[t];
    const url = imageUrl as string | undefined;
    if (url && /^https?:\/\//i.test(url)) return { uri: url };
    if (fromTitle) return fromTitle;
    return require('@/assets/images/yoga-w.jpg');
  }, [imageUrl, title]);

  const description = useMemo(() => {
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
  }, [title]);

  const capNum = Number(capacity ?? 25);
  const occNumInitial = Number(occupied ?? 18);
  const [forceFull, setForceFull] = useState(false);
  const isFullInitial = occNumInitial >= capNum;
  const effectiveFull = isFullInitial || forceFull;
  const occNum = effectiveFull ? capNum : occNumInitial;

  const id = useMemo(() => `${String(title || '')}|${String(time || '')}`, [title, time]);
  const reserved = isReserved(id);
  const { toastState, showToast, hideToast } = useToast();
  const isCrossfitCompleted =
    String(title || '').toLowerCase() === 'crossfit' && effectiveFull;

  const timeRange = useMemo(() => {
    const raw = String(time || '').trim();
    if (!raw) return '07:00 - 08:00 AM';
    if (raw.includes('-')) return raw; // already a range
    // parse 12h like '07:00 AM'
    const m = raw.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
    if (!m) return raw; // unknown format, show raw
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

  return (
    <ThemedView
      lightColor='#050816'
      darkColor='#050816'
      className='flex-1 p-4 pt-12'>
      <ToastNotification
        type={toastState.type}
        title={toastState.title}
        message={toastState.message}
        visible={toastState.visible}
        onClose={hideToast}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={heroSource} style={styles.heroImage} contentFit='cover' />

        <ThemedText
          lightColor='#ffffff'
          darkColor='#ffffff'
          className='text-3xl font-extrabold mt-4 mb-1'>
          {String(title || 'Nombre de la clase').toUpperCase()}
        </ThemedText>

        <View className='mb-1'>
          <ThemedText
            lightColor='#d4d4d4'
            darkColor='#d4d4d4'
            className='text-sm'>
            {todayFormatted}
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
            lightColor={effectiveFull ? '#fca5a5' : '#e5e5e5'}
            darkColor={effectiveFull ? '#fca5a5' : '#e5e5e5'}
            className='text-sm'>
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

        <View className='flex-row items-center mb-3'>
          <StarIcon size={16} color='#F59E0B' />
          <ThemedText
            lightColor='#e5e5e5'
            darkColor='#e5e5e5'
            className='ml-2 text-sm'>
            4.9 (231 reviews)
          </ThemedText>
        </View>

        <View className='flex-row items-center mb-4'>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={{ width: 28, height: 28, borderRadius: 9999 }}
            contentFit='cover'
          />
          <ThemedText
            lightColor='#e5e5e5'
            darkColor='#e5e5e5'
            className='ml-2'>
            {String(instructor || 'Nombre del Instructor')}
          </ThemedText>
        </View>

        <View className='mb-4'>
          <ThemedText
            lightColor='#ffffff'
            darkColor='#ffffff'
            className='mb-1'>
            Descripción de la clase:
          </ThemedText>
          <ThemedText
            lightColor='#ffffff'
            darkColor='#ffffff'
            className='text-sm leading-relaxed'>
            {description}
          </ThemedText>
        </View>

        <View className='mb-4'>
          <ThemedText
            lightColor='#f97316'
            darkColor='#f97316'
            className='font-semibold'>
            Nivel: intermedio
          </ThemedText>
        </View>

        <View className='mb-4 flex-row items-baseline'>
          <ThemedText
            lightColor='#ffffff'
            darkColor='#ffffff'
            className='font-semibold text-sm'>
            Ubicación / Sala:
          </ThemedText>
          <ThemedText
            lightColor='#d4d4d4'
            darkColor='#d4d4d4'
            className='text-sm ml-1'>
            Sala B - Planta 2
          </ThemedText>
        </View>

        {isCrossfitCompleted ? (
          <View className='mb-6 items-center'>
            <View className='flex-row items-center rounded-full px-4 py-2 bg-neutral-800'>
              <CheckCircleIcon size={18} color='#22c55e' />
              <ThemedText
                lightColor='#e5e5e5'
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
              disabled={effectiveFull}
              style={{ backgroundColor: effectiveFull ? '#6b7280' : reserved ? '#ef4444' : '#f97316' }}
              onPress={async () => {
                if (effectiveFull) {
                  return;
                }
                if (reserved) {
                  await cancel(id);
                  return;
                }
                const lowerTitle = String(title || '').toLowerCase();
                const img =
                  typeof heroSource === 'number'
                    ? heroSource
                    : (imageUrl as string | number | undefined);
                if (lowerTitle === 'yoga flow') {
                  setForceFull(true);
                  showToast(
                    'error',
                    'Clase llena',
                    'La clase se llenó mientras la reservabas.'
                  );
                  return;
                }
                if (lowerTitle === 'crossfit') {
                  await reserve({
                    id,
                    title: String(title || ''),
                    time: String(time || ''),
                    instructor: String(instructor || ''),
                    imageUrl: img,
                  });
                  setForceFull(true);
                  return;
                }
                await reserve({
                  id,
                  title: String(title || ''),
                  time: String(time || ''),
                  instructor: String(instructor || ''),
                  imageUrl: img,
                });
                if (lowerTitle === 'spinning') {
                  showToast(
                    'success',
                    'Clase reservada',
                    'Su clase ha sido reservada correctamente'
                  );
                }
              }}
            />
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
    </ThemedView>
  );
}
