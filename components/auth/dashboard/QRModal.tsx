import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRModalProps {
	visible: boolean;
	onClose: () => void;
	token: string;
}

export const QRModal: React.FC<QRModalProps> = ({ visible, onClose, token }) => {
	// Colores basados en el diseño
	const OVERLAY_COLOR = 'rgba(0, 0, 0, 0.7)';
	const CARD_BACKGROUND = '#333333';
	const TITLE_COLOR = 'white';
	const DESCRIPTION_COLOR = '#CCCCCC';

	return (
		<Modal animationType='fade' transparent={true} visible={visible} onRequestClose={onClose}>
			<TouchableOpacity
				style={{
					flex: 1,
					backgroundColor: OVERLAY_COLOR,
					justifyContent: 'center',
					alignItems: 'center',
					paddingHorizontal: 24,
				}}
				activeOpacity={1}
				onPress={onClose}>
				<View
					style={{
						backgroundColor: CARD_BACKGROUND,
						borderRadius: 12,
						paddingVertical: 40,
						paddingHorizontal: 24,
						width: '100%',
						maxWidth: 400,
						alignItems: 'center',
					}}>
					<Text
						style={{
							fontSize: 22,
							fontWeight: 'bold',
							textAlign: 'center',
							color: TITLE_COLOR,
							marginBottom: 8,
						}}>
						Código QR
					</Text>

					<Text
						style={{
							fontSize: 15,
							textAlign: 'center',
							color: DESCRIPTION_COLOR,
							marginBottom: 30,
							lineHeight: 22,
						}}>
						Usa este código para registrar tu entrada al gimnasio
					</Text>

					<View
						style={{
							alignItems: 'center',
						}}>
						<QRCode
							value={token || 'no-token-available'}
							size={250} // INCREMENTADO para hacer los módulos más grandes
							backgroundColor={CARD_BACKGROUND}
							color='white'
							quietZone={0} // REDUCIDO para usar más espacio
							ecl='H'
						/>
					</View>
				</View>
			</TouchableOpacity>
		</Modal>
	);
};
