import { Fonts } from '@/constants/theme';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomAlertProps {
	visible: boolean;
	title: string;
	message?: string;
	onConfirm: () => void;
	confirmText?: string;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
	visible,
	title,
	message,
	onConfirm,
	confirmText = 'Continuar',
}) => {
	return (
		<Modal transparent visible={visible} animationType='fade' onRequestClose={onConfirm}>
			<View style={styles.overlay}>
				<View style={styles.alertContainer}>
					{/* Título */}
					<Text style={styles.title}>{title}</Text>

					{/* Mensaje (opcional) */}
					{message && <Text style={styles.message}>{message}</Text>}

					{/* Botón */}
					<TouchableOpacity style={styles.button} onPress={onConfirm} activeOpacity={0.8}>
						<Text style={styles.buttonText}>{confirmText}</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	alertContainer: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 32,
		width: '100%',
		maxWidth: 400,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 8,
	},
	title: {
		fontFamily: Fonts.title,
		fontSize: 24,
		fontWeight: '700',
		color: '#1A1A1A',
		textAlign: 'center',
		marginBottom: 24,
		lineHeight: 32,
	},
	message: {
		fontFamily: Fonts.medium,
		fontSize: 16,
		color: '#5C5E60',
		textAlign: 'center',
		marginBottom: 24,
		lineHeight: 22,
	},
	button: {
		backgroundColor: '#FF8A3D',
		borderRadius: 12,
		paddingVertical: 16,
		paddingHorizontal: 48,
		width: '100%',
		alignItems: 'center',
		shadowColor: '#FF8A3D',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	buttonText: {
		fontFamily: Fonts.medium,
		fontSize: 18,
		fontWeight: '600',
		color: '#FFFFFF',
	},
});
