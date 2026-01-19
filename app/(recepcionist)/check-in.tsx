import { ValidateCheckInCard } from '@/components/auth/dashboard/ValidateCheckInCard';
import { QRScannerModal } from '@/components/recepcionist/QRScannerModal';
import { CheckInResultModal } from '@/components/recepcionista/CheckInResultModal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useBranch } from '@/contexts/BranchContext';
import vitalFitApi from '@/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, BackHandler, Image, ScrollView, StyleSheet, View } from 'react-native';

export default function CheckInScreen() {
	const { t } = useTranslation();
	const router = useRouter();
	const { selectedBranchId } = useBranch();
	const scrollViewRef = useRef<ScrollView>(null);
	const [scannerVisible, setScannerVisible] = useState(false);
	const [resultModalVisible, setResultModalVisible] = useState(false);
	const [checkInSuccess, setCheckInSuccess] = useState(false);
	const [checkInUserName, setCheckInUserName] = useState('');
	const [checkInMessage, setCheckInMessage] = useState('');

	useFocusEffect(
		useCallback(() => {
			setTimeout(() => {
				scrollViewRef.current?.scrollTo({ y: 0, animated: true });
			}, 100);
			const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
				router.replace('/(recepcionist)/dashboard');
				return true;
			});

			return () => backHandler.remove();
		}, [router]),
	);

	const handleValidateMembership = async (qrJwtLong: string) => {
		try {
			const token = await AsyncStorage.getItem('token');
			if (!token) return;
			if (!selectedBranchId) {
				Alert.alert(`${t('common.attention')}`, t('checkIn.error.selectBranch'));
				return;
			}
			const branchId = selectedBranchId;

			console.log('Enviando Check-In...', {
				qrJwtLong: qrJwtLong.substring(0, 20) + '...',
				branchId,
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const response = await (vitalFitApi as any).access.checkIn(token, {
				qr_jwt: qrJwtLong,
				branch_id: branchId,
			});

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
			console.error('Error en Check-In:', error);

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

	return (
		<ThemedView style={styles.container}>
			<ScrollView ref={scrollViewRef} contentContainerStyle={{ paddingBottom: 100 }}>
				<View style={styles.header}>
					<Image
						source={require('@/assets/images/Frame.png')}
						style={styles.logo}
						resizeMode='contain'
					/>
					<ThemedText className='font-heading' style={styles.title}>
						{t('checkIn.title')}
					</ThemedText>
				</View>

				<View style={styles.cardWrapper}>
					<ValidateCheckInCard onScanPress={() => setScannerVisible(true)} />
				</View>
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	header: {
		alignItems: 'center',
		paddingTop: 60,
		paddingBottom: 30,
	},
	logo: {
		width: 150,
		height: 50,
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#1F2937',
	},
	cardWrapper: {
		marginHorizontal: 20,
		marginBottom: 16,
	},
});
