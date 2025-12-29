import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CheckCircleIcon, XMarkIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';

export const options = {
  headerShown: false,
  title: '',
};

export default function RoutineDetailsScreen() {
  const router = useRouter();
  const { width } = Dimensions.get('window');

  const exercises = [
    { id: 'ex1', title: 'Sentadillas con barra – 4×12', day: 'Monday', series: 115, reps: 5, time: '5 minutos' },
    { id: 'ex2', title: 'Sentadillas con barra – 4×12', day: 'Monday', series: 115, reps: 5, time: '5 minutos' },
    { id: 'ex3', title: 'Sentadillas con barra – 4×12', day: 'Monday', series: 115, reps: 5, time: '5 minutos' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ width: '100%', height: 220 }}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            { [require('@/assets/images/rutin.png')].map((src, idx) => (
              <Image key={idx} source={src} style={{ width, height: 220 }} resizeMode="cover" />
            )) }
          </ScrollView>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={{ position: 'absolute', top: 12, left: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(17,24,39,0.85)', alignItems: 'center', justifyContent: 'center' }}
          >
            <XMarkIcon size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <Text style={{ color: '#111827', fontWeight: '700', fontSize: 16, marginBottom: 8 }}>LISTA DE EJERCICIOS</Text>
          <View style={{ height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
            <View style={{ width: '40%', height: '100%', backgroundColor: '#F27F2A' }} />
          </View>
          <View>
            {exercises.map((ex) => (
              <LinearGradient
                key={ex.id}
                colors={["#3A2618", "#F27F2A", "#3A2618"]}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ borderRadius: 16, padding: 14, marginBottom: 12 }}
              >
                <View style={{ position: 'absolute', top: 8, right: 8 }}>
                  <CheckCircleIcon size={20} color="#F27F2A" />
                </View>

                <Text style={{ color: '#FFFFFF', fontWeight: '500', fontSize: 16, marginBottom: 10 }}>{ex.title}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                  <View>
                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '400' }}>Day</Text>
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>{ex.day}</Text>
                  </View>
                  <View>
                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '400' }}>Series</Text>
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>{ex.series}</Text>
                  </View>
                  <View>
                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '400' }}>Repeticiones</Text>
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>{ex.reps}</Text>
                  </View>
                  <View>
                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '400' }}>Tiempo</Text>
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>{ex.time}</Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: '#F27F2A', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8 }}>
                    <Text style={{ color: '#111827', fontWeight: '800' }}>Comenzar</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
