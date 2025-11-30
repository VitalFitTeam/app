import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { BackHandler, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { CalendarDaysIcon, UserIcon } from 'react-native-heroicons/outline';

const formatFullDate = (dateString?: string) => {
  if (!dateString) return 'Fecha sin definir';
  const [year, monthIndex, dayNumber] = dateString.split('-').map(Number);
  const date = new Date(year, (monthIndex || 1) - 1, dayNumber || 1);

  const day = date.getDate();
  const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
  const weekday = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date);

  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  return `${capitalizedWeekday}, ${day} de ${month} de ${year}`;
};

const getClassDescription = (name: string) => {
  const upper = name.toUpperCase();

  if (upper.includes('YOGA')) {
    return 'Clase enfocada en respiración, estiramientos y posturas que mejoran la flexibilidad, reducen el estrés y fortalecen el cuerpo de forma progresiva.';
  }

  if (upper.includes('ZUMBA')) {
    return 'Clase de baile fitness con ritmos latinos para mejorar resistencia y coordinación. Ideal para todos los niveles y enfocada en divertirse mientras quemas calorías.';
  }

  if (upper.includes('SPINNING')) {
    return 'Entrenamiento cardiovascular en bicicleta fija, ideal para quemar calorías, mejorar la resistencia y fortalecer piernas y glúteos al ritmo de la música.';
  }

  if (upper.includes('CROSSFIT')) {
    return 'Entrenamiento funcional de alta intensidad que combina fuerza, resistencia y potencia usando movimientos variados con tu propio peso y equipamiento.';
  }

  if (upper.includes('PILATES')) {
    return 'Sesión centrada en el fortalecimiento del core, la postura y la movilidad, con ejercicios controlados que protegen las articulaciones.';
  }

  return 'Este entrenamiento se enfoca en el desarrollo muscular y la resistencia. Incluye ejercicios con pesas, bandas de resistencia y peso corporal. Ideal para todos los niveles.';
};

const getClassImage = (name: string) => {
  const upper = name.toUpperCase();

  if (upper.includes('ZUMBA')) {
    return require('@/assets/images/zumba-w.jpg');
  }

  if (upper.includes('YOGA')) {
    return require('@/assets/images/yoga-w.jpg');
  }

  if (upper.includes('SPINNING')) {
    return require('@/assets/images/spinning-w.jpg');
  }

  if (upper.includes('CROSSFIT')) {
    return require('@/assets/images/crossfit-w.jpg');
  }

  if (upper.includes('PILATES')) {
    return require('@/assets/images/pilates-w.webp');
  }

  return require('@/assets/images/man_black.png');
};

export default function ClassDetailsScreen() {
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

  // Manejar el botón de atrás para ir a horarios
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        router.replace('/(recepcionist)/schedule');
        return true;
      });

      return () => backHandler.remove();
    }, [router])
  );

  const name = params.name || 'NOMBRE DE LA CLASE';
  const date = params.date || '2025-07-15';
  const time = params.time || '07:00 - 08:00 AM';
  const capacity = Number(params.capacity || 25);
  const enrolled = Number(params.enrolled || 45);
  const status = params.status || 'available';
  const instructorName = params.instructor || 'Nombre del Instructor';

  const formattedDate = formatFullDate(date);
  const description = getClassDescription(name);
  const heroImageSource = getClassImage(name);

  const clients = Array.from({ length: enrolled > 0 ? Math.min(enrolled, 4) : 4 }).map((_, index) => ({
    id: index.toString(),
    name: 'Juan Perez',
    level: 'Nivel 5',
  }));

  const isFull = status === 'full' || enrolled >= capacity;

  useEffect(() => {
    const handler = () => {
      router.replace('/(recepcionist)/schedule');
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => subscription.remove();
  }, [router]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageWrapper}>
          <Image
            source={heroImageSource}
            style={styles.heroImage}
            resizeMode='cover'
          />
        </View>

        <View style={styles.content}>
          <ThemedText style={styles.className}>{name}</ThemedText>

          <View style={styles.metaBlock}>
            <ThemedText style={styles.dateText}>{formattedDate}</ThemedText>
            <ThemedText style={styles.capacityText}>
              {enrolled}/{capacity} cupos ocupados
            </ThemedText>
            <ThemedText style={styles.timeText}>{time}</ThemedText>
            <ThemedText style={styles.durationText}>(1 hora)</ThemedText>
          </View>

          <View style={styles.instructorCard}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/31.jpg' }}
              style={styles.instructorPhoto}
            />
            <View style={styles.instructorInfo}>
              <ThemedText style={styles.instructorName}>{instructorName}</ThemedText>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Descripción de la clase:</ThemedText>
            <ThemedText style={styles.sectionBody}>
              {description}
            </ThemedText>
          </View>

          {/* Lista de clientes implementado inline */}
          <View style={styles.searchWrapper}>
            <TextInput
              placeholder='Nombre del cliente'
              placeholderTextColor='#9CA3AF'
              style={styles.searchInput}
            />
          </View>

          <View style={styles.clientsHeader}>
            <View style={styles.clientsTitleRow}>
              <CalendarDaysIcon size={20} color='#6B7280' />
              <ThemedText style={styles.clientsTitle}>
                Lista de clientes inscritos ({enrolled}/{capacity})
              </ThemedText>
            </View>
          </View>

          <View style={styles.clientsList}>
            {clients.map(client => (
              <TouchableOpacity key={client.id} style={styles.clientCard} activeOpacity={0.8}>
                <View style={styles.clientAvatar}>
                  <UserIcon size={24} color='#F97316' />
                </View>
                <View style={styles.clientInfo}>
                  <ThemedText style={styles.clientName}>{client.name}</ThemedText>
                  <ThemedText style={styles.clientLevel}>{client.level}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.8}>
            <ThemedText style={styles.viewAllButtonText}>Ver todos los inscritos</ThemedText>
          </TouchableOpacity>

          {isFull ? (
            <TouchableOpacity style={styles.fullButton} activeOpacity={0.8}>
              <ThemedText style={styles.fullButtonText}>Clase Llena</ThemedText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.primaryButton} 
              activeOpacity={0.8}
              onPress={() => {
                const queryParams = new URLSearchParams({
                  id: params.id || '',
                  name: name,
                  date: date,
                  time: time,
                  capacity: capacity.toString(),
                  enrolled: enrolled.toString(),
                  status: status,
                  instructor: instructorName
                });
                router.push(`/(recepcionist)/enroll-client?${queryParams.toString()}`);
              }}
            >
              <ThemedText style={styles.primaryButtonText}>Inscribir Cliente</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  imageWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heroImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  className: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  metaBlock: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  capacityText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#F97316',
    fontWeight: '600',
    marginBottom: 2,
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  instructorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 999,
    padding: 8,
    marginBottom: 16,
  },
  instructorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: '#4B5563',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructorInfo: {
    marginLeft: 12,
  },
  instructorName: {
    fontSize: 14,
    color: '#F9FAFB',
    fontWeight: '500',
  },
  instructorPhoto: {
    width: 44,
    height: 44,
    borderRadius: 999,
    marginRight: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sectionBody: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  searchWrapper: {
    marginBottom: 16,
  },
  searchInput: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  clientsHeader: {
    marginBottom: 8,
  },
  clientsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientsTitle: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  clientsList: {
    marginBottom: 12,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  clientAvatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  clientLevel: {
    fontSize: 12,
    color: '#6B7280',
  },
  viewAllButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#F97316',
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  viewAllButtonText: {
    fontSize: 14,
    color: '#F97316',
    fontWeight: '500',
  },
  primaryButton: {
    borderRadius: 999,
    backgroundColor: '#F97316',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 48,
  },
  primaryButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  fullButton: {
    borderRadius: 999,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  fullButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
