import { Bell } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

interface Notification {
	id: string;
	title: string;
	time: string;
}

interface Props {
	name: string;
	message?: string;
	avatarUrl?: string;
	notifications?: Notification[];
}

export const UserHeader: React.FC<Props> = ({
	name,
	message = 'Es hora de desafiar tus límites',
	avatarUrl,
	notifications = [
		{ id: '1', title: 'Tu clase comienza en 10 minutos', time: 'Hace 5 min' },
		{ id: '2', title: 'Pago de membresía recibido', time: 'Hace 1 hora' },
	],
}) => {
	const [showNotifications, setShowNotifications] = useState(false);

	return (
		<View className='mb-6 relative'>
			<View className='flex-row justify-between items-center'>
				<View className='flex-row items-center'>
					<Image
						source={
							avatarUrl ? { uri: avatarUrl } : require('@/assets/images/usuario.png')
						}
						style={{
							width: 70,
							height: 70,
							borderRadius: 35,
							backgroundColor: '#D1D5DB',
							marginRight: 12,
						}}
					/>
					<View>
						<Text
							style={{
								fontFamily: 'BebasNeue-Regular',
								fontWeight: '400',
								fontSize: 31,
								color: '#000',
							}}>
							Bienvenido, {name}
						</Text>

						<Text
							style={{
								fontFamily: 'Montserrat_500Medium',
								fontWeight: '500',
								fontSize: 13,
								color: '#6B7280',
							}}>
							{message}
						</Text>
					</View>
				</View>

				<View className='relative'>
					<TouchableOpacity
						onPress={() => setShowNotifications(!showNotifications)}
						className='p-2 bg-gray-100 dark:bg-neutral-800 rounded-full'
						activeOpacity={0.8}>
						<Bell size={22} color='#333' />
					</TouchableOpacity>

					{notifications.length > 0 && (
						<View className='absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full' />
					)}
				</View>
			</View>

			{showNotifications && (
				<View className='absolute right-0 top-16 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-lg p-3 w-72 z-50'>
					<Text className='text-base font-semibold mb-2'>Notificaciones</Text>
					{notifications.length > 0 ? (
						<FlatList
							data={notifications}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => (
								<View className='mb-2'>
									<Text className='text-gray-800 dark:text-gray-200 font-medium text-sm'>
										{item.title}
									</Text>
									<Text className='text-gray-400 text-xs'>{item.time}</Text>
								</View>
							)}
						/>
					) : (
						<Text className='text-gray-400 text-sm'>
							No tienes notificaciones nuevas
						</Text>
					)}
				</View>
			)}
		</View>
	);
};
