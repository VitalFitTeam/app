import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRightIcon, UserIcon, UsersIcon } from 'react-native-heroicons/outline';

export function MyClientsCardGroup() {
  const { t } = useTranslation();
  const clients = [
    {
      id: 1,
      name: 'Juan Perez',
      level: `${t('instructor.dashboard.myClients.level')} 5`,
      program: t('instructor.assignRoutine.programs.maxStrength'),
      avatar: null,
    },
    {
      id: 2,
      name: 'Juan Perez',
      level: `${t('instructor.dashboard.myClients.level')} 5`,
      program: t('instructor.assignRoutine.programs.maxStrength'),
      avatar: null,
    },
    {
      id: 3,
      name: 'Ana García',
      level: `${t('instructor.dashboard.myClients.level')} 3`,
      program: t('instructor.assignRoutine.programs.hypertrophy'),
      avatar: null,
    },
    {
      id: 4,
      name: 'Luis Martínez',
      level: `${t('instructor.dashboard.myClients.level')} 2`,
      program: t('instructor.assignRoutine.programs.endurance'),
      avatar: null,
    },
    {
      id: 5,
      name: 'María López',
      level: `${t('instructor.dashboard.myClients.level')} 4`,
      program: t('instructor.assignRoutine.programs.powerlifting'),
      avatar: null,
    },
  ];

  return (
    <View className='mt-6 rounded-2xl bg-white px-4 py-3 border border-[#e5e7eb] shadow-sm'>
      <View className='flex-row items-center mb-3'>
        <UsersIcon size={18} color='#f97316' />
        <Text className='ml-2 text-[14px] font-medium text-[#111827]'>{t('instructor.dashboard.myClients.title')}</Text>
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
