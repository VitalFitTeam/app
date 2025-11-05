import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/outline';
import QRCode from 'react-native-qrcode-svg';

interface QRModalProps {
	visible: boolean;
	onClose: () => void;
	token: string;
}

export const QRModal: React.FC<QRModalProps> = ({ visible, onClose, token }) => {
	return (
		<Modal animationType='fade' transparent={true} visible={visible} onRequestClose={onClose}>
			<TouchableOpacity
				style={{
					flex: 1,
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					justifyContent: 'center',
					alignItems: 'center',
					paddingHorizontal: 16,
				}}
				activeOpacity={1}
				onPress={onClose}>
				<TouchableOpacity
					style={{
						backgroundColor: 'white',
						borderRadius: 24,
						padding: 32,
						width: '100%',
						maxWidth: 400,
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 10 },
						shadowOpacity: 0.3,
						shadowRadius: 20,
						elevation: 10,
					}}
					activeOpacity={1}
					onPress={(e) => e.stopPropagation()}>
					<TouchableOpacity
						onPress={onClose}
						style={{
							position: 'absolute',
							top: 16,
							right: 16,
							zIndex: 10,
							backgroundColor: '#F5F5F5',
							borderRadius: 20,
							padding: 8,
						}}
						activeOpacity={0.7}>
						<XMarkIcon size={20} color='#666' />
					</TouchableOpacity>

					<Text
						style={{
							fontSize: 20,
							fontWeight: 'bold',
							textAlign: 'center',
							color: '#1A1A1A',
							marginBottom: 24,
							marginTop: 8,
							fontFamily: 'Inter_700Bold',
						}}>
						Código QR de Acceso
					</Text>

					<View
						style={{
							backgroundColor: 'white',
							borderRadius: 16,
							padding: 24,
							alignItems: 'center',
							marginBottom: 24,
							shadowColor: '#000',
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.1,
							shadowRadius: 8,
							elevation: 3,
						}}>
						<QRCode
							value={token || 'no-token-available'}
							size={250}
							backgroundColor='white'
							color='black'
							logo={require('@/assets/images/isotipo 1.png')}
							logoSize={80}
							logoBackgroundColor='white'
							logoBorderRadius={8}
							quietZone={10}
							ecl='H'
						/>
					</View>

					<Text
						style={{
							fontSize: 14,
							textAlign: 'center',
							color: '#999',
							fontFamily: 'Inter_400Regular',
						}}>
						Escanea para ingresar
					</Text>
				</TouchableOpacity>
			</TouchableOpacity>
		</Modal>
	);
};
