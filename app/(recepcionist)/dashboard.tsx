import { GymCapacityCard } from '@/components/auth/dashboard/GymCapacityCard';
import { RecepcionistStatsCardGroup } from '@/components/auth/dashboard/RecepcionistStatsCardGroup';
import { RecepcionistTodayClassCard } from '@/components/auth/dashboard/RecepcionistTodayClassCard';
import { UserHeader } from '@/components/auth/dashboard/userheader';
import { ValidateCheckInCard } from '@/components/auth/dashboard/ValidateCheckInCard';
import { QRScannerModal } from '@/components/recepcionist/QRScannerModal';
import { ThemedView } from '@/components/themed-view';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { QrCodeIcon } from 'react-native-heroicons/outline';

export default function DashboardRecepcionist() {
	const [loading, setLoading] = useState(true);
	const [firstName, setFirstName] = useState<string | null>(null);
	const [scannerVisible, setScannerVisible] = useState(false);

	const handleValidateMembership = async (qrJwtLong: string) => {
		try {
			const token = await AsyncStorage.getItem('token');
			if (!token) return;

			// 1. OBTENER ID DE LA SEDE (BRANCH)
			// Lo ideal es sacarlo del usuario logueado. Si no lo tienes, usa uno fijo por ahora.
			const branchId = "45e6bbd5-d9fd-490c-9672-a3208852a116"; // Ejemplo UUID válido

			console.log("Enviando Check-In...", { qrJwtLong: qrJwtLong.substring(0, 20) + '...', branchId });

			// 2. LLAMAR AL ENDPOINT DE CHECK-IN USANDO EL SDK
			// Nota: vitalFitApi.access debe estar disponible según indicaciones del usuario
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const response = await (vitalFitApi as any).access.checkIn(
				token,
				{
					qr_jwt: qrJwtLong,
					branch_id: branchId
				}
			);

			const data = response.data || response; // Ajuste por si el SDK devuelve axios response o data directa

			// 3. MOSTRAR RESULTADO BASADO EN LA RESPUESTA DEL BACKEND
			Alert.alert(
				"✅ BIENVENIDO",
				`Cliente: ${data.user.first_name} ${data.user.last_name}\nEstado: Acceso Concedido`
			);

			setScannerVisible(false); // Cerrar escáner si fue exitoso

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error("Error en Check-In:", error);

			// Manejo de errores específicos
			if (isAPIError(error)) {
				if (error.status === 402) {
					Alert.alert("⛔ PAGO REQUERIDO", "El usuario tiene pagos pendientes.");
				} else if (error.status === 403) {
					Alert.alert("🚫 ACCESO DENEGADO", "El usuario no tiene permiso para entrar a esta área o sede.");
				} else if (error.status === 401) {
					Alert.alert("⚠️ QR EXPIRADO", "El código QR ha caducado. Pide al usuario que genere uno nuevo.");
				} else {
					Alert.alert("Error", error.message || "No se pudo procesar el acceso.");
				}
			} else {
				Alert.alert("Error", error.message || "Error de conexión con el servidor.");
			}
		}
	};

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = await AsyncStorage.getItem('token');
				if (!token) return;
				const userData = await vitalFitApi.user.WhoAmI(token);
				setFirstName(userData?.user?.first_name || 'Recepcionista');
			} catch (error: unknown) {
				let errorMessage = 'Ocurrió un error inesperado.';
				if (isAPIError(error)) errorMessage = error.messages.join(', ');
				else if (error instanceof Error) errorMessage = error.message;
				console.error('Error whoami (Recepcionista):', errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	if (loading) {
		return (
			<ThemedView className='flex-1 justify-center items-center bg-white dark:bg-neutral-950'>
				<ActivityIndicator size='large' color='#F27F2A' />
			</ThemedView>
		);
	}

	return (
		<ThemedView className='flex-1 bg-white dark:bg-neutral-950 px-4 pt-10'>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				<UserHeader
					name={firstName ?? 'Recepcionista'}
					avatarUrl='https://randomuser.me/api/portraits/women/44.jpg'
				/>

				<RecepcionistStatsCardGroup />
				<ValidateCheckInCard />
				<GymCapacityCard />
				<RecepcionistTodayClassCard />
			</ScrollView>

			<TouchableOpacity
				style={{
					position: 'absolute',
					bottom: 30,
					right: 30,
					backgroundColor: '#F27F2A',
					width: 60,
					height: 60,
					borderRadius: 30,
					justifyContent: 'center',
					alignItems: 'center',
					elevation: 5,
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.3,
					shadowRadius: 3,
				}}
				onPress={() => setScannerVisible(true)}
			>
				<QrCodeIcon color="white" size={30} />
			</TouchableOpacity>

			<QRScannerModal
				visible={scannerVisible}
				onClose={() => setScannerVisible(false)}
				onScan={handleValidateMembership}
			/>
		</ThemedView>
	);
}
