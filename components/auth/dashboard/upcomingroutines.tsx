import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
	Dimensions,
	Image,
	ImageSourcePropType,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

interface Routine {
	id: string;
	title: string;
	subtitle: string;
	duration: string;
	image: ImageSourcePropType;
}

interface Props {
	routines: Routine[];
	mode?: 'member' | 'guest';
	onPrimaryActionPress?: (id: string) => void;
}

export const UpcomingRoutinesSection: React.FC<Props> = ({ routines, mode = 'member', onPrimaryActionPress }) => {
	const { t } = useTranslation();
	const { width } = Dimensions.get('window');
	const cardWidth = Math.min(width - 32, 600);
	const sectionTitle = mode === 'member' ? t('dashboard.upcomingRoutines.title') : t('dashboard.upcomingRoutines.services');
	const buttonLabel = mode === 'member' ? t('dashboard.upcomingRoutines.start') : t('dashboard.upcomingRoutines.purchase');

	return (
		<View style={styles.container}>
			<Text className='font-heading' style={styles.sectionTitle}>{sectionTitle}</Text>
			{routines.map((routine) => (
				<LinearGradient
					key={routine.id}
					colors={['#4F3521', '#F27F2A']}
					locations={[0.2, 0.9]}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 1 }}
					style={[styles.card, { width: cardWidth }]}>
					<Image
						source={require('@/assets/images/Male.png')}
						style={styles.manImage}
						resizeMode='contain'
					/>

					<View style={styles.content}>
						<View style={styles.textContainer}>
							<Text className='font-body' style={styles.subtitle}>{routine.subtitle}</Text>
							<Text className='font-body' style={styles.duration}>{routine.duration}</Text>
							<Text className='font-heading' style={styles.title}>{routine.title}</Text>
						</View>
						<TouchableOpacity
							style={styles.button}
							activeOpacity={0.8}
							onPress={() => onPrimaryActionPress && onPrimaryActionPress(routine.id)}>
							<Text className='font-body' style={styles.buttonText}>{buttonLabel}</Text>
						</TouchableOpacity>
					</View>
				</LinearGradient>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 16,
	},
	sectionTitle: {
		fontFamily: 'BebasNeue-Regular',
		fontSize: 28,
		color: '#000000',
		marginBottom: 12,
		textAlign: 'center', 
	},
	card: {
		alignSelf: 'center',
		marginBottom: 16,
		borderRadius: 16,
		overflow: 'hidden',
		height: 160,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.4,
		shadowRadius: 5,
		elevation: 10,
		padding: 16,
		justifyContent: 'space-between',
		flexDirection: 'column',
	},
	manImage: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		height: '100%',
		width: '50%',
	},
	content: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		paddingRight: '45%',
	},
	textContainer: {
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
	subtitle: {
		fontFamily: 'Montserrat_500Medium',
		fontSize: 18,
		color: '#FFFFFF',
		marginBottom: 2,
	},
	duration: {
		fontFamily: 'Montserrat_400Regular',
		fontSize: 15,
		color: '#E0E0E0',
		marginBottom: 6,
	},
	title: {
		fontFamily: 'BebasNeue-Regular',
		fontSize: 25,
		color: '#FFFFFF',
		fontWeight: '700',
		textAlign: 'left',
		marginBottom: 4,
	},
	button: {
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 25,
		paddingVertical: 8,
		borderRadius: 11,
		alignSelf: 'flex-start',
		width: 'auto',
	},
	buttonText: {
		fontFamily: 'Montserrat_600SemiBold',
		fontSize: 18,
		color: '#000000',
		textAlign: 'center',
		fontWeight: '600',
	},
});
