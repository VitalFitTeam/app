
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRModalProps {
	visible: boolean;
	onClose: () => void;
	token: string;
	userName?: string;
	membershipTierLabel?: string;
	membershipId?: string;
	validUntilLabel?: string;
}

export const QRModal: React.FC<QRModalProps> = ({
	visible,
	onClose,
	token,
	userName,
	membershipTierLabel = 'MIEMBRO PREMIUM',
	membershipId = 'ID: FM-2024-001234',
	validUntilLabel = 'Válido hasta: 31 Dic 2025',
}) => {
	// Colores basados en el diseño
	const OVERLAY_COLOR = 'rgba(0, 0, 0, 0.7)';
	const CARD_BACKGROUND = '#333333';
	const TITLE_COLOR = 'white';
	const DESCRIPTION_COLOR = '#CCCCCC';

	const effectiveUserName = userName || 'Usuario';

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
						paddingVertical: 32,
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
							size={220}
							backgroundColor={CARD_BACKGROUND}
							color='#F27F2A'
							quietZone={4}
							ecl='H'
						/>
					</View>

					{/* Información del usuario y membresía */}
					<View
						style={{
							marginTop: 24,
							alignItems: 'center',
						}}>
						<Text
							style={{
								fontSize: 18,
								fontWeight: '700',
								color: 'white',
								letterSpacing: 0.5,
								textTransform: 'uppercase',
								marginBottom: 4,
								textAlign: 'center',
							}}>
							{effectiveUserName}
						</Text>
						<Text
							style={{
								fontSize: 12,
								fontWeight: '700',
								color: '#F27F2A',
								textTransform: 'uppercase',
								marginBottom: 12,
							}}>
							{membershipTierLabel}
						</Text>
						<Text
							style={{
								fontSize: 12,
								color: DESCRIPTION_COLOR,
								marginBottom: 4,
								textAlign: 'center',
							}}>
							{membershipId}
						</Text>
						<Text
							style={{
								fontSize: 12,
								color: DESCRIPTION_COLOR,
								marginBottom: 20,
								textAlign: 'center',
							}}>
							{validUntilLabel}
						</Text>
					</View>

					{/* Botón Descargar */}
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={onClose}
						style={{
							marginTop: 4,
							backgroundColor: 'white',
							borderRadius: 6,
							paddingVertical: 10,
							paddingHorizontal: 24,
							alignSelf: 'stretch',
						}}>
						<Text
							style={{
								textAlign: 'center',
								fontSize: 14,
								fontWeight: '500',
								color: '#111827',
							}}>
							Descargar
						</Text>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		</Modal>
	);
};
