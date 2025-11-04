import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { Text } from 'react-native';

export default function DashboardRecepcionist() {
	return (
		<ThemedView className='flex-1 justify-center items-center bg-white dark:bg-neutral-950'>
			<Text className='text-2xl font-semibold text-neutral-900 dark:text-white'>
				🧾 Dashboard del Recepcionista
			</Text>
			<Text className='mt-2 text-neutral-700 dark:text-neutral-300 text-center px-6'>
				Bienvenido al panel del recepcionista. Aquí podrás ver y gestionar los check-ins,
				clases reservadas y asistencia de los clientes.
			</Text>
		</ThemedView>
	);
}
