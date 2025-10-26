import { ThemedText } from '@/components/themed-text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, TouchableOpacity, View } from 'react-native';
import { ArrowRightOnRectangleIcon, ChevronRightIcon } from 'react-native-heroicons/outline';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL;

type ProfileMenuItemProps = {
	title: string;
	onPress?: () => void;
	isLogout?: boolean;
};

const ProfileMenuItem = ({ title, onPress, isLogout = false }: ProfileMenuItemProps) => (
	<TouchableOpacity
		onPress={onPress}
		className='flex-row justify-between items-center py-4 px-6 bg-white dark:bg-neutral-900'>
		<ThemedText className={`text-base font-semibold ${isLogout ? 'text-red-500' : ''}`}>
			{title}
		</ThemedText>
		{isLogout ? (
			<ArrowRightOnRectangleIcon size={20} color='#ef4444' />
		) : (
			<ChevronRightIcon size={20} color='#9ca3af' />
		)}
	</TouchableOpacity>
);

export default function ProfileScreen() {
	const [userName, setUserName] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [showLogoutModal, setShowLogoutModal] = useState(false);
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

	const handleLogout = async () => {
		try {
			await AsyncStorage.removeItem('token');
			await AsyncStorage.removeItem('userData');
			setShowLogoutModal(false);
			router.replace('/login');
		} catch (error) {
			console.error('Error al cerrar sesión:', error);
		}
	};

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
				<ProfileMenuItem title='Membresía' onPress={() => console.log('Membresía')} />
				<ProfileMenuItem
					title='Historial pago'
					onPress={() => console.log('Historial pago')}
				/>
				<ProfileMenuItem title='Fidelización' onPress={() => console.log('Fidelización')} />
				<ProfileMenuItem title='Notificación' onPress={() => console.log('Notificación')} />
				<ProfileMenuItem
					title='Cerrar sesión'
					onPress={() => setShowLogoutModal(true)}
					isLogout={true}
				/>
			</View>

			{/* Modal de confirmación de cierre de sesión */}
			<Modal
				visible={showLogoutModal}
				transparent={true}
				animationType='fade'
				onRequestClose={() => setShowLogoutModal(false)}>
				<View className='flex-1 justify-center items-center bg-black/50'>
					<View className='bg-white dark:bg-neutral-900 rounded-3xl w-11/12 max-w-sm p-8 shadow-2xl'>
						<ThemedText className='text-2xl font-bold text-center mb-4'>
							¿Cerrar sesión?
						</ThemedText>
						<ThemedText className='text-base text-center text-neutral-600 dark:text-neutral-400 mb-8'>
							¿Estás seguro que quieres cerrar sesión?
						</ThemedText>

						<View className='gap-3'>
							<TouchableOpacity
								onPress={handleLogout}
								className='bg-orange-500 py-4 rounded-2xl items-center'
								activeOpacity={0.8}>
								<ThemedText className='text-white text-lg font-bold'>
									Sí, cerrar sesión
								</ThemedText>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => setShowLogoutModal(false)}
								className='bg-neutral-200 dark:bg-neutral-800 py-4 rounded-2xl items-center'
								activeOpacity={0.8}>
								<ThemedText className='text-neutral-800 dark:text-white text-lg font-bold'>
									No, cancelar
								</ThemedText>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}
