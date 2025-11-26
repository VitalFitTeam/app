import { InstructorQRModal } from '@/components/instructor/InstructorQRModal';
import { ThemedView } from '@/components/themed-view';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
	ArrowRightOnRectangleIcon,
	BellIcon,
	ChevronRightIcon,
	GlobeAltIcon,
	QrCodeIcon,
	QuestionMarkCircleIcon,
	ShieldCheckIcon,
	UserCircleIcon,
} from 'react-native-heroicons/outline';

export default function InstructorProfileScreen() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [firstName, setFirstName] = useState<string | null>(null);
	const [lastName, setLastName] = useState<string | null>(null);
	const [qrModalVisible, setQrModalVisible] = useState(false);
	const [logoutModalVisible, setLogoutModalVisible] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = await AsyncStorage.getItem('token');
				if (!token) {
					console.error('No se encontró token en AsyncStorage');
					return;
				}

				const userData = await vitalFitApi.user.WhoAmI(token);
				setFirstName(userData?.user?.first_name || 'Instructor');
				setLastName(userData?.user?.last_name || '');
			} catch (error: unknown) {
				let errorMessage = 'Ocurrió un error inesperado al obtener los datos del usuario.';
				if (isAPIError(error)) {
					errorMessage = error.messages.join(', ');
				} else if (error instanceof Error) {
					errorMessage = error.message;
				}
				console.error('Error en la solicitud whoami (Perfil instructor):', errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	if (loading) {
		return (
			<ThemedView className='flex-1 justify-center items-center bg-white'>
				<ActivityIndicator size='large' color='#F27F2A' />
			</ThemedView>
		);
	}

	const displayName = lastName ? `${firstName ?? 'Instructor'} ${lastName}` : firstName ?? 'Instructor';

	const handleConfirmLogout = async () => {
		try {
			await AsyncStorage.removeItem('token');
		} catch (error) {
			console.error('Error al eliminar el token en logout:', error);
		} finally {
			setLogoutModalVisible(false);
			router.replace('/(auth)/login');
		}
	};

	return (
		<ThemedView className='flex-1 bg-white pt-10'>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96 }}>
				{/* Avatar e info básica */}
				<View className='mb-4 items-start'>
					<View className='w-24 h-24 rounded-full overflow-hidden mb-3 bg-[#FED7AA] items-center justify-center'>
						<Image
							source={{ uri: 'https://randomuser.me/api/portraits/men/31.jpg' }}
							style={{ width: '100%', height: '100%' }}
						/>
					</View>
					<Text className='text-[20px] font-semibold text-[#111827]'>{displayName}</Text>
					<Text className='text-[13px] text-[#6b7280] mt-1'>Instructor</Text>
					<Text className='text-[13px] text-[#f97316] mt-0.5'>Functional Strength</Text>
				</View>

				{/* About Me */}
				<View className='mb-4'>
					<Text className='text-[14px] font-semibold text-[#111827] mb-1'>About Me</Text>
					<Text className='text-[13px] text-[#4b5563] leading-5'>
						Dr. Carly Angel is a specialist in strength and conditioning. She helps clients build
							a solid foundation and improve performance with personalized training programs.
					</Text>
				</View>

				{/* Botón Escanear QR */}
				<TouchableOpacity
					activeOpacity={0.85}
					className='w-full rounded-2xl border border-[#d1d5db] py-3 px-4 mb-4 flex-row items-center justify-center bg-white'
					onPress={() => setQrModalVisible(true)}>
					<QrCodeIcon width={18} height={18} color='#111827' />
					<Text className='ml-2 text-[13px] font-medium text-[#111827]'>Escanear QR</Text>
				</TouchableOpacity>

				{/* Estadísticas */}
				<View className='w-full bg-[#F3F4F6] rounded-2xl py-3 px-3 mb-6 flex-row justify-between'>
					<View className='flex-1 items-center'>
						<Text className='text-[18px] font-semibold text-[#111827]'>6</Text>
						<Text className='text-[11px] text-[#4b5563] mt-1'>Experience</Text>
					</View>
					<View className='w-px bg-[#d1d5db] mx-2' />
					<View className='flex-1 items-center'>
						<Text className='text-[18px] font-semibold text-[#111827]'>46</Text>
						<Text className='text-[11px] text-[#4b5563] mt-1'>Completed</Text>
					</View>
					<View className='w-px bg-[#d1d5db] mx-2' />
					<View className='flex-1 items-center'>
						<Text className='text-[18px] font-semibold text-[#111827]'>25</Text>
						<Text className='text-[11px] text-[#4b5563] mt-1'>Active Clients</Text>
					</View>
				</View>

				{/* Configuración */}
				<View className='mb-2'>
					<Text className='text-[14px] font-semibold text-[#111827] mb-2'>Configuración</Text>
				</View>

				{/* Opción: Información personal */}
				<TouchableOpacity
					activeOpacity={0.8}
					className='w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3'
					onPress={() => {
						router.push('/instructor-profile-personal');
					}}>
					<View className='flex-row items-center'>
						<View className='w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3'>
							<UserCircleIcon width={18} height={18} color='#111827' />
						</View>
						<Text className='text-[13px] text-[#111827]'>Información personal</Text>
					</View>
					<ChevronRightIcon width={16} height={16} color='#9ca3af' />
				</TouchableOpacity>

				{/* Opción: Seguridad */}
				<TouchableOpacity
					activeOpacity={0.8}
					className='w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3'
					onPress={() => {
						router.push('/instructor-security');
					}}>
					<View className='flex-row items-center'>
						<View className='w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3'>
							<ShieldCheckIcon width={18} height={18} color='#111827' />
						</View>
						<Text className='text-[13px] text-[#111827]'>Seguridad</Text>
					</View>
					<ChevronRightIcon width={16} height={16} color='#9ca3af' />
				</TouchableOpacity>

				{/* Opción: Idioma */}
				<TouchableOpacity
					activeOpacity={0.8}
					className='w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3'
					onPress={() => {
						console.log('Idioma');
					}}>
					<View className='flex-row items-center'>
						<View className='w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3'>
							<GlobeAltIcon width={18} height={18} color='#111827' />
						</View>
						<Text className='text-[13px] text-[#111827]'>Idioma</Text>
					</View>
					<ChevronRightIcon width={16} height={16} color='#9ca3af' />
				</TouchableOpacity>

				{/* Opción: Notificaciones */}
				<TouchableOpacity
					activeOpacity={0.8}
					className='w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3'
					onPress={() => {
						router.push('/instructor-notifications');
					}}>
					<View className='flex-row items-center'>
						<View className='w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3'>
							<BellIcon width={18} height={18} color='#111827' />
						</View>
						<Text className='text-[13px] text-[#111827]'>Notificaciones</Text>
					</View>
					<ChevronRightIcon width={16} height={16} color='#9ca3af' />
				</TouchableOpacity>

				{/* Opción: Ayuda y soporte */}
				<TouchableOpacity
					activeOpacity={0.8}
					className='w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3'
					onPress={() => {
						console.log('Ayuda y soporte');
					}}>
					<View className='flex-row items-center'>
						<View className='w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3'>
							<QuestionMarkCircleIcon width={18} height={18} color='#111827' />
						</View>
						<Text className='text-[13px] text-[#111827]'>Ayuda y soporte</Text>
					</View>
					<ChevronRightIcon width={16} height={16} color='#9ca3af' />
				</TouchableOpacity>

				{/* Opción: Términos y condiciones */}
				<TouchableOpacity
					activeOpacity={0.8}
					className='w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-3'
					onPress={() => {
						console.log('Términos y condiciones');
					}}>
					<View className='flex-row items-center'>
						<View className='w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3'>
							<GlobeAltIcon width={18} height={18} color='#111827' />
						</View>
						<Text className='text-[13px] text-[#111827]'>Términos y condiciones</Text>
					</View>
					<ChevronRightIcon width={16} height={16} color='#9ca3af' />
				</TouchableOpacity>

				{/* Opción: Cerrar sesión */}
				<TouchableOpacity
					activeOpacity={0.8}
					className='w-full flex-row items-center justify-between rounded-2xl bg-white border border-[#e5e7eb] px-4 py-3 mb-6'
					onPress={() => {
						setLogoutModalVisible(true);
					}}>
					<View className='flex-row items-center'>
						<View className='w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center mr-3'>
							<ArrowRightOnRectangleIcon width={18} height={18} color='#b91c1c' />
						</View>
						<Text className='text-[13px] text-[#b91c1c] font-semibold'>Cerrar sesión</Text>
					</View>
					<ChevronRightIcon width={16} height={16} color='#b91c1c' />
				</TouchableOpacity>
			</ScrollView>

			<InstructorQRModal
				visible={qrModalVisible}
				onClose={() => setQrModalVisible(false)}
			/>

			<Modal
				visible={logoutModalVisible}
				transparent
				animationType='fade'
				onRequestClose={() => setLogoutModalVisible(false)}>
				<View
					style={{
						flex: 1,
						backgroundColor: 'rgba(0,0,0,0.4)',
						justifyContent: 'center',
						alignItems: 'center',
						paddingHorizontal: 24,
					}}>
					<View
						style={{
							width: '100%',
							maxWidth: 360,
							borderRadius: 16,
							backgroundColor: '#FFFFFF',
							paddingHorizontal: 20,
							paddingVertical: 20,
						}}>
						<Text
							style={{
								fontSize: 16,
								fontWeight: '600',
								color: '#111827',
								marginBottom: 8,
							}}>
							¿Cerrar sesión?
						</Text>
						<Text
							style={{
								fontSize: 13,
								color: '#4b5563',
								marginBottom: 16,
						}}>
							Se cerrará tu sesión actual y deberás iniciar sesión nuevamente.
						</Text>
						<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
							<TouchableOpacity
								activeOpacity={0.8}
								onPress={() => setLogoutModalVisible(false)}
								style={{ paddingVertical: 8, paddingHorizontal: 12, marginRight: 8 }}>
								<Text style={{ fontSize: 13, color: '#4b5563' }}>Cancelar</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.9}
								onPress={handleConfirmLogout}
								style={{
									paddingVertical: 8,
									paddingHorizontal: 14,
									borderRadius: 999,
									backgroundColor: '#f97316',
								}}>
								<Text style={{ fontSize: 13, color: '#FFFFFF', fontWeight: '600' }}>Cerrar sesión</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</ThemedView>
	);
}
