import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useReservations } from '@/contexts/reservations';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StarIcon } from 'react-native-heroicons/solid';

export default function ClassDetailsScreen() {
	const { time, title, instructor, imageUrl, capacity, occupied } = useLocalSearchParams();
	const { isReserved, reserve } = useReservations();

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
	const occNum = Number(occupied ?? 18);
	const isFull = occNum >= capNum;

	const id = useMemo(() => `${String(title || '')}|${String(time || '')}`, [title, time]);
	const reserved = isReserved(id);

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
		<ThemedView className='flex-1 bg-white dark:bg-neutral-950 p-4'>
			<ScrollView showsVerticalScrollIndicator={false}>
				<Image source={heroSource} style={styles.heroImage} contentFit='cover' />

				<ThemedText className='text-3xl font-extrabold mt-6 mb-2'>
					{String(title || 'Nombre de la clase').toUpperCase()}
				</ThemedText>

				<View className='mb-1'>
					<ThemedText className='text-neutral-400'>{todayFormatted}</ThemedText>
				</View>

				<View className='mb-1'>
					<ThemedText className={`${isFull ? 'text-red-400' : 'text-neutral-300'}`}>
						{occNum} / {capNum} cupos ocupados
					</ThemedText>
				</View>

				<View className='mb-4'>
					<ThemedText className='text-orange-500 font-bold'>{timeRange}</ThemedText>
				</View>

				<View className='flex-row items-center mb-4'>
					<StarIcon size={16} color='#F59E0B' />
					<ThemedText className='ml-2 text-neutral-300'>4.9 (231 reviews)</ThemedText>
				</View>

				<View className='flex-row items-center mb-6'>
					<Image
						source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
						style={{ width: 28, height: 28, borderRadius: 9999 }}
						contentFit='cover'
					/>
					<ThemedText className='ml-2 text-neutral-200'>
						{String(instructor || 'Nombre del Instructor')}
					</ThemedText>
				</View>

				<View className='mb-6'>
					<ThemedText className='font-bold mb-1'>Descripción de la clase:</ThemedText>
					<ThemedText className='text-neutral-300'>{description}</ThemedText>
				</View>

				<View className='mb-8'>
					<ThemedText className='text-orange-500 font-semibold'>
						Nivel: intermedio
					</ThemedText>
				</View>

				<View className='mb-6'>
					<PrimaryButton
						title={isFull ? 'Clase llena' : reserved ? 'Reservado' : 'Reservar'}
						disabled={isFull || reserved}
						style={{ backgroundColor: isFull || reserved ? '#6b7280' : undefined }}
						onPress={async () => {
							if (isFull || reserved) return;
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
						}}
					/>
				</View>

				<View className='items-center justify-center mb-2'>
					<ThemedText className='text-neutral-400 italic text-center'>
						“Podrás cancelar hasta 2h antes del inicio”
					</ThemedText>
				</View>
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	heroImage: {
		width: '100%',
		height: 200,
		borderRadius: 16,
	},
});
