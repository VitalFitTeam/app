import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { QrCodeIcon } from 'react-native-heroicons/outline';

interface Props {
	daysRemaining: number;
	onQRPress: () => void;
}

export const MembershipCard: React.FC<Props> = ({ daysRemaining, onQRPress }) => {
	const { width } = Dimensions.get('window');
	const cardWidth = Math.min(width - 32, 380);

	return (
		<LinearGradient
			colors={['#8C4918', '#F27F2A']}
			locations={[0, 0.7]}
			start={{ x: 0, y: 0.1 }}
			end={{ x: 1, y: 0.2 }}
			style={[styles.card, { width: cardWidth }]}>
			<TouchableOpacity
				style={styles.contentContainer}
				onPress={onQRPress}
				activeOpacity={0.8}>
				<View style={styles.iconContainer}>
					<QrCodeIcon size={56} color='#FFFFFF' strokeWidth={0.5} />
				</View>

				<View style={styles.textContainer}>
					<Text style={styles.title}>Acceso al Gimnasio</Text>
					<Text style={styles.subtitle}>Escanea para ingresar</Text>
				</View>
			</TouchableOpacity>

			<Text style={styles.footerText}>Membresía activa: {daysRemaining} días restantes</Text>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	card: {
		borderRadius: 16,
		borderWidth: 0.5,
		borderColor: '#E8E8E8',
		paddingHorizontal: 16,
		paddingVertical: 14,
		alignSelf: 'center',
		justifyContent: 'space-between',
		marginVertical: 10,
	},
	contentContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	iconContainer: {
		width: 145,
		alignItems: 'center',
		marginLeft: -30,
		justifyContent: 'center',
	},
	textContainer: {
		width: 200,
		justifyContent: 'center',
		marginLeft: 60,
	},
	title: {
		fontFamily: 'Inter_700Bold',
		fontSize: 14,
		fontWeight: '700',
		color: '#FFFFFF',
	},
	subtitle: {
		fontFamily: 'Inter_400Regular',
		fontSize: 12,
		fontWeight: '400',
		color: '#FFFFFF',
		letterSpacing: 0.5,
		marginTop: 4,
	},
	footerText: {
		fontFamily: 'Montserrat_500Medium',
		fontSize: 16,
		fontWeight: '500',
		textAlign: 'center',
		color: '#FFFFFF',
	},
});
