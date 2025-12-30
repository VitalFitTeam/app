import { GymCapacityCard } from '@/components/auth/dashboard/GymCapacityCard';
import { RecepcionistStatsCardGroup } from '@/components/auth/dashboard/RecepcionistStatsCardGroup';
import { RecepcionistTodayClassCard } from '@/components/auth/dashboard/RecepcionistTodayClassCard';
import { UserHeader } from '@/components/auth/dashboard/userheader';
import { ValidateCheckInCard } from '@/components/auth/dashboard/ValidateCheckInCard';
import { QRScannerModal } from '@/components/recepcionist/QRScannerModal';
import { BranchSelector } from '@/components/recepcionista/BranchSelector';
import { CheckInResultModal } from '@/components/recepcionista/CheckInResultModal';
import { ThemedView } from '@/components/themed-view';
import { useBranch } from '@/contexts/BranchContext';
import vitalFitApi from '@/services/vitalfitSdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';

export default function DashboardRecepcionist() {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(true);
	const [firstName, setFirstName] = useState<string | null>(null);
	const [scannerVisible, setScannerVisible] = useState(false);
	const { selectedBranchId } = useBranch();
	const [resultModalVisible, setResultModalVisible] = useState(false);
	const [checkInSuccess, setCheckInSuccess] = useState(false);
	const [checkInUserName, setCheckInUserName] = useState('');
	const [checkInMessage, setCheckInMessage] = useState('');

	const handleValidateMembership = async (qrJwtLong: string) => {
		try {
			const token = await AsyncStorage.getItem('token');
			if (!token) return;
			if (!selectedBranchId) {
				Alert.alert(`${t('common.attention')}`, t('checkIn.error.selectBranch'));
				return;
			}
			const branchId = selectedBranchId;

			console.log("Enviando Check-In...", { qrJwtLong: qrJwtLong.substring(0, 20) + '...', branchId });
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const response = await (vitalFitApi as any).access.checkIn(
				token,
				{
					qr_jwt: qrJwtLong,
					branch_id: branchId
				}
			);

			const data = response.data || response; 

			console.log('[Check-In] Respuesta completa:', JSON.stringify(data, null, 2));

			let userName = t('dashboard.defaultUser');
			
			if (data?.user?.first_name) {
				userName = `${data.user.first_name} ${data.user.last_name || ''}`.trim();
			} else if (data?.first_name) {
				userName = `${data.first_name} ${data.last_name || ''}`.trim();
			} else if (data?.name) {
				userName = data.name;
			}

			setCheckInSuccess(true);
			setCheckInUserName(userName);
			setResultModalVisible(true);
			setScannerVisible(false); 

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error("Error en Check-In:", error);

			let errorMessage = t('checkIn.error.default');
			
			if (isAPIError(error)) {
				if (error.status === 402) {
					errorMessage = t('checkIn.error.paymentPending');
				} else if (error.status === 403) {
					errorMessage = t('checkIn.error.accessDenied');
				} else if (error.status === 401) {
					errorMessage = t('checkIn.error.qrExpired');
				} else {
					errorMessage = error.message || t('checkIn.error.default');
				}
			} else {
				errorMessage = error.message || t('common.error.connection');
			}

			setCheckInSuccess(false);
			setCheckInMessage(errorMessage);
			setResultModalVisible(true);
		}
	};

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = await AsyncStorage.getItem('token');
				if (!token) return;
				const userData = await vitalFitApi.user.WhoAmI(token);
				setFirstName(userData?.user?.first_name || t('dashboard.recepcionistDefault'));
			} catch (error: unknown) {
				let errorMessage = t('common.error.unexpected');
				if (isAPIError(error)) errorMessage = error.messages.join(', ');
				else if (error instanceof Error) errorMessage = error.message;
				console.error('Error whoami (Recepcionista):', errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [t]);

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
					name={firstName ?? t('dashboard.recepcionistDefault')}
					avatarUrl='https://randomuser.me/api/portraits/women/44.jpg'
				/>

				<View style={{ alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 10, marginTop: -15 }}>
					<BranchSelector />
				</View>

				<RecepcionistStatsCardGroup />
				<ValidateCheckInCard onScanPress={() => setScannerVisible(true)} />
				<GymCapacityCard />
				<RecepcionistTodayClassCard />
			</ScrollView>

			<QRScannerModal
				visible={scannerVisible}
				onClose={() => setScannerVisible(false)}
				onScan={handleValidateMembership}
			/>

			<CheckInResultModal
				visible={resultModalVisible}
				onClose={() => setResultModalVisible(false)}
				success={checkInSuccess}
				userName={checkInUserName}
				message={checkInMessage}
			/>
		</ThemedView>
	);
}
