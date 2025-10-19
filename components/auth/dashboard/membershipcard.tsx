import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { QrCodeIcon } from 'react-native-heroicons/outline';

interface Props {
	daysRemaining: number;
}

export const MembershipCard: React.FC<Props> = ({ daysRemaining }) => {
	const { width } = Dimensions.get('window');
	const cardWidth = Math.min(width - 32, 380); // responsive, máx. 380px

	return (
		<LinearGradient
			colors={['#8C4918', '#F27F2A']}
			locations={[0, 0.7]}
			start={{ x: 0, y: 0.1 }}
			end={{ x: 1, y: 0.2 }}
			style={[styles.card, { width: cardWidth }]}>
			{/* Contenido principal */}
			<View style={styles.contentContainer}>
				{/* Icono QR */}
				<View style={styles.iconContainer}>
					<QrCodeIcon size={56} color='#FFFFFF' strokeWidth={0.5} />
				</View>

				{/* Texto derecho */}
				<View style={styles.textContainer}>
					<Text style={styles.title}>Acceso al Gimnasio</Text>
					<Text style={styles.subtitle}>Escanea para ingresar</Text>
				</View>
			</View>

			{/* Texto inferior */}
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
