import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRightIcon, UserIcon, UsersIcon } from 'react-native-heroicons/outline';

export function MyClientsCardGroup() {
  const clients = [
    {
      id: 1,
      name: 'Juan Perez',
      level: 'Nivel 5',
      program: 'Fuerza Máxima - Semana 2',
      avatar: null,
    },
    {
      id: 2,
      name: 'Juan Perez',
      level: 'Nivel 5',
      program: 'Fuerza Máxima - Semana 2',
      avatar: null,
    },
    {
      id: 3,
      name: 'Ana García',
      level: 'Nivel 3',
      program: 'Hipertrofia - Semana 1',
      avatar: null,
    },
    {
      id: 4,
      name: 'Luis Martínez',
      level: 'Nivel 2',
      program: 'Resistencia - Semana 4',
      avatar: null,
    },
    {
      id: 5,
      name: 'María López',
      level: 'Nivel 4',
      program: 'Powerlifting - Semana 3',
      avatar: null,
    },
  ];

  return (
    <View className='mt-6 rounded-2xl bg-white px-4 py-3 border border-[#e5e7eb] shadow-sm'>
      <View className='flex-row items-center mb-3'>
        <UsersIcon size={18} color='#f97316' />
        <Text className='ml-2 text-[14px] font-medium text-[#111827]'>Mis Clientes</Text>
      </View>

      {clients.map((client) => (
        <TouchableOpacity
          key={client.id}
          className='flex-row items-center justify-between bg-[#F8F9FB] rounded-2xl px-4 py-3 mb-3'
          activeOpacity={0.8}>
          <View className='w-10 h-10 rounded-xl bg-[#FED7AA] justify-center items-center mr-3'>
            <UserIcon size={22} color='#f97316' />
          </View>

          <View className='flex-1'>
            <Text className='text-[14px] font-bold text-[#1F2024]'>{client.name}</Text>
            <Text className='text-[12px] text-[#71727A]'>{client.level}</Text>
            <Text className='text-[12px] font-medium text-[#f97316] mt-0.5'>
              {client.program}
            </Text>
          </View>

          <ChevronRightIcon size={12} color='#71727A' />
        </TouchableOpacity>
      ))}
    </View>
  );
}
