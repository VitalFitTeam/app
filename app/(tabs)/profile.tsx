import { ThemedText } from '@/components/themed-text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { ChevronRightIcon, Cog6ToothIcon } from 'react-native-heroicons/outline';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL;

type ProfileMenuItemProps = {
	title: string;
	onPress?: () => void;
	isLogout?: boolean;
	icon?: React.ReactNode;
};

const ProfileMenuItem = ({ title, onPress, isLogout = false, icon }: ProfileMenuItemProps) => (
	<TouchableOpacity
		onPress={onPress}
		className='flex-row justify-between items-center py-4 px-6 bg-white dark:bg-neutral-900'>
		<ThemedText className={`text-base font-semibold ${isLogout ? 'text-red-500' : ''}`}>
			{title}
		</ThemedText>
		{icon || <ChevronRightIcon size={20} color='#9ca3af' />}
	</TouchableOpacity>
);

export default function ProfileScreen() {
	const [userName, setUserName] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = await AsyncStorage.getItem('token');
				if (!token) {
					console.error('❌ No se encontró token en AsyncStorage');
					return;
				}

				const response = await fetch(`${API_URL.replace(/\/+$/, '')}/user/whoami`, {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					console.error('❌ Error al obtener el usuario:', response.status);
					return;
				}

				const data = await response.json();
				const fullName = `${data?.user?.first_name || ''} ${data?.user?.last_name || ''}`;
				setUserName(fullName.trim().toUpperCase() || 'USUARIO');
			} catch (error) {
				console.error('💥 Error en la solicitud whoami:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	if (loading) {
		return (
			<View className='flex-1 justify-center items-center bg-white dark:bg-neutral-950'>
				<ActivityIndicator size='large' color='#F27F2A' />
			</View>
		);
	}

	return (
		<View className='flex-1 bg-white dark:bg-neutral-950'>
			{/* Header con foto de perfil y nombre */}
			<View className='items-center justify-center py-16 bg-white dark:bg-neutral-900'>
				<View className='w-40 h-40 rounded-full mb-6 overflow-hidden bg-neutral-200 dark:bg-neutral-800'>
					<Image
						source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
						style={{ width: '100%', height: '100%' }}
						contentFit='cover'
					/>
				</View>
				<ThemedText
					className='text-4xl font-bold tracking-wide'
					style={{ fontFamily: 'Montserrat-ExtraBold' }}>
					{userName}
				</ThemedText>
			</View>

			{/* Menú de opciones */}
			<View className='bg-white dark:bg-neutral-900'>
				<Link href='/my-profile' asChild>
					<ProfileMenuItem title='Mi perfil' />
				</Link>
				<Link href='/cancel-membership' asChild>
					<ProfileMenuItem title='Membresía' />
				</Link>
				<ProfileMenuItem
					title='Historial pago'
					onPress={() => console.log('Historial pago')}
				/>
				<ProfileMenuItem title='Fidelización' onPress={() => console.log('Fidelización')} />
				<ProfileMenuItem
					title='Notificación'
					onPress={() => router.push('/notifications')}
				/>
				<Link href='/settings' asChild>
					<ProfileMenuItem
						title='Configuración'
						icon={<Cog6ToothIcon size={20} color='#9ca3af' />}
					/>
				</Link>
			</View>
		</View>
	);
}
