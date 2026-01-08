
import vitalFitApi from '@/services/vitalfitSdk';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface Props {
	visible: boolean;
	onClose: () => void;
	token: string; 
	userName: string;
}

export const QRModal: React.FC<Props> = ({ visible, onClose, token, userName }) => {
	const [qrValue, setQrValue] = useState<string>('');
	const [loading, setLoading] = useState(true);

	const fetchQrToken = React.useCallback(async () => {
		try {
			setLoading(true);
			console.log('Solicitando Token QR con Auth Token length:', token?.length);
			const response = await vitalFitApi.user.QrToken(token);
			if (response?.token) {
				console.log('Token QR Recibido:', response.token);
				console.log('Longitud del Token QR:', response.token.length);
				setQrValue(response.token);
			} else {
				console.warn('Respuesta QrToken sin token:', response);
				setQrValue('Error al generar código');
			}
		} catch (error) {
			console.error("Error generando QR:", error);
			setQrValue('Error al generar código');
		} finally {
			setLoading(false);
		}
	}, [token]);
	useEffect(() => {
		if (visible && token) {
			fetchQrToken();
		}
	}, [visible, token, fetchQrToken]);

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>

					<View style={styles.header}>
						<Text className='font-heading' style={styles.modalTitle}>Tu Código de Acceso</Text>
						<TouchableOpacity onPress={onClose} style={styles.closeButton}>
							<Ionicons name="close" size={24} color="#6B7280" />
						</TouchableOpacity>
					</View>

					<Text className='font-heading' style={styles.userName}>{userName}</Text>
					<Text className='font-body' style={styles.instruction}>
						Muestra este código en recepción para ingresar
					</Text>

					<View style={styles.qrContainer}>
						{loading ? (
							<ActivityIndicator size="large" color="#F27F2A" />
						) : qrValue && qrValue !== 'Error al generar código' ? (
							<QRCode
								value={qrValue}
								size={200}
								color="black"
								backgroundColor="white"
							/>
						) : (
							<Text className='font-body' style={{ color: 'red' }}>No se pudo cargar el QR</Text>
						)}
					</View>

					{!loading && (
						<TouchableOpacity onPress={fetchQrToken} style={styles.refreshButton}>
							<Ionicons name="refresh" size={20} color="#F27F2A" />
							<Text className='font-body' style={styles.refreshText}>Actualizar código</Text>
						</TouchableOpacity>
					)}

				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)', 
	},
	modalView: {
		width: '85%',
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 24,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	header: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#111827',
	},
	closeButton: {
		padding: 4,
	},
	userName: {
		fontSize: 20,
		fontWeight: '600',
		color: '#F27F2A', 
		marginBottom: 8,
	},
	instruction: {
		fontSize: 14,
		color: '#6B7280',
		textAlign: 'center',
		marginBottom: 24,
	},
	qrContainer: {
		padding: 16,
		backgroundColor: 'white',
		borderRadius: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
		marginBottom: 20,
	},
	refreshButton: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
	},
	refreshText: {
		color: '#F27F2A',
		fontWeight: '600',
		marginLeft: 8,
	},
});
