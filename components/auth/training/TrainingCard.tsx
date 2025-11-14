import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export type TrainingCardProps = {
  id: string;
  title: string;
  subtitle: string;
  progressPercent: number; // 0-100
  instructor?: string;
  onPress?: () => void;
};

const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function TrainingCard({ id, title, subtitle, progressPercent, instructor = 'Instructor', onPress }: TrainingCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress ? onPress : () => router.push({ pathname: '/routine/details', params: { id } })}
      className="w-full rounded-2xl overflow-hidden bg-white mb-4"
      style={{ shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 5 }}
    >
      {/* Background image */}
      <View style={{ height: 180 }}>
        <Image
          source={require('@/assets/images/rutin.png')}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        {/* No overlay over the image as requested */}

        {/* Content over image */}
        <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12 }}>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18 }}>
            {title}
          </Text>
        </View>

        {/* Circular progress */}
        <View style={{ position: 'absolute', right: 12, bottom: 12, width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A' }}>
          {(() => {
            const size = 40;
            const stroke = 4;
            const radius = (size - stroke) / 2;
            const circumference = 2 * Math.PI * radius;
            const progress = Math.max(0, Math.min(100, progressPercent));
            const dash = (progress / 100) * circumference;
            const gap = circumference - dash;
            return (
              <Svg width={size} height={size}>
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={"rgba(255,255,255,0.25)"}
                  strokeWidth={stroke}
                  fill="none"
                />
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={"#F27F2A"}
                  strokeWidth={stroke}
                  fill="none"
                  strokeDasharray={`${dash},${gap}`}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
              </Svg>
            );
          })()}
          <Text style={{ position: 'absolute', color: '#F27F2A', fontWeight: '700', fontSize: 11 }}>{Math.round(progressPercent)}%</Text>
        </View>
      </View>

      {/* Footer info */}
      <View className="px-4 py-3" style={{ backgroundColor: '#111827' }}>
        <View className="flex-row items-start justify-between">
          {/* Left column: subtitle and instructor */}
          <View style={{ flexShrink: 1, paddingRight: 12 }}>
            <Text style={{ color: '#D1D5DB', fontSize: 12, marginBottom: 2 }}>{subtitle}</Text>
            <Text style={{ color: '#9CA3AF', fontSize: 12 }}>{instructor}</Text>
          </View>
          {/* Right column: days in the same row */}
          <View className="flex-row items-center" style={{ flexShrink: 0 }}>
            {days.map((d, i) => {
              const activeIndices = [1, 3, 5, 6]; // Ma, Ju, Sa, Do
              const active = activeIndices.includes(i);
              return (
                <View key={`${d}-${i}`} style={{ alignItems: 'center', marginLeft: 10 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: active ? '#F27F2A' : '#FFFFFF', marginBottom: 2 }} />
                  <Text style={{ color: '#FFFFFF', fontSize: 10 }}>{d}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
