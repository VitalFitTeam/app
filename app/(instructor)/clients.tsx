import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { PlusIcon } from 'react-native-heroicons/outline';
import { UserIcon } from 'react-native-heroicons/solid';

export default function ClientsScreen() {
	const router = useRouter();
	const clients = useMemo(
		() => [
			{
				id: '1',
				name: 'Juan Perez',
				level: 'Nivel 5',
				program: 'Fuerza Máxima - Semana 2',
			},
			{
				id: '2',
				name: 'María López',
				level: 'Nivel 3',
				program: 'Hipertrofia - Semana 1',
			},
			{
				id: '3',
				name: 'Carlos Pérez',
				level: 'Nivel 4',
				program: 'Resistencia - Semana 4',
			},
			{
				id: '4',
				name: 'Ana García',
				level: 'Nivel 2',
				program: 'Inicio Funcional - Semana 3',
			},
		],
		[],
	);

	return (
		<ThemedView className='flex-1 bg-white pt-10'>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 16, paddingBottom: 96 }}>
				{/* Logo */}
				<View className='items-center mb-4'>
					<Image
						source={require('@/assets/images/Frame.png')}
						style={{ width: 150, height: 50, resizeMode: 'contain' }}
					/>
				</View>

				{/* Franja gris superior como calendario de clases */}
				<View className='w-full bg-[#F3F4F6] rounded-2xl py-2 mb-3 items-center justify-center'>
					<ThemedText
						lightColor='#111827'
						style={{ fontFamily: 'System', fontSize: 16, fontWeight: '600' }}>
						Mis clientes
					</ThemedText>
				</View>

				{clients.map((client) => (
					<View
							key={client.id}
							className='mb-4 rounded-2xl bg-white px-4 py-4 border border-[#e5e7eb] shadow-sm'>
						<View className='flex-row items-center mb-3'>
							<View className='w-11 h-11 rounded-full bg-[#FED7AA] justify-center items-center mr-3'>
								<UserIcon size={26} color='#f97316' />
							</View>
							<View className='flex-1'>
								<Text
									className='text-[14px] font-bold text-[#1F2024]'
									style={{ fontFamily: 'Montserrat_600SemiBold' }}>
									{client.name}
								</Text>
								<Text
									className='text-[12px] text-[#71727A]'
									style={{ fontFamily: 'Montserrat_400Regular' }}>
									{client.level}
								</Text>
								<Text
									className='text-[12px] text-[#111827] mt-1'
									style={{ fontFamily: 'Montserrat_500Medium' }}>
									{client.program}
								</Text>
							</View>
						</View>

						<View className='flex-row gap-3 mt-1'>
							<TouchableOpacity
									activeOpacity={0.8}
									className='flex-1 flex-row items-center justify-center rounded-2xl border border-[#e5e7eb] bg-white py-2.5'
									onPress={() =>
										router.push({
											pathname: '/instructor-assign-routine',
											params: {
												clientId: client.id,
												name: client.name,
												level: client.level,
												program: client.program,
											},
										})
									}>
									<PlusIcon width={16} height={16} color='#111827' />
									<Text
										className='ml-2 text-[12px] text-[#111827]'
										style={{ fontFamily: 'Montserrat_500Medium' }}>
										Asignar nueva rutina
									</Text>
								</TouchableOpacity>

							<TouchableOpacity
									activeOpacity={0.8}
									className='flex-1 items-center justify-center rounded-2xl bg-[#f97316] py-2.5'
									onPress={() =>
										router.push({
											pathname: '/instructor-client-progress',
											params: {
												clientId: client.id,
												name: client.name,
												level: client.level,
												program: client.program,
											},
										})
									}>
									<Text
										className='text-[12px] text-white'
										style={{ fontFamily: 'Montserrat_600SemiBold' }}>
										Ver progreso
									</Text>
								</TouchableOpacity>
						</View>
					</View>
				))}
			</ScrollView>
		</ThemedView>
	);
}
