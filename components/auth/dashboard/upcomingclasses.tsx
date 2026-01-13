import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { ClockIcon, FireIcon } from 'react-native-heroicons/solid';

const ClassImage = require('@/assets/images/Rectangle.png');

interface ClassItem {
	id: string;
	title: string;
	time: string;
	calories: string;
}

interface Props {
	classes: ClassItem[];
}

export const UpcomingClassesCarousel: React.FC<Props> = ({ classes }) => {
	const { t } = useTranslation();
	const { width } = Dimensions.get('window');
	const cardWidth = width * 0.75;

	const renderClassCard = ({ item }: { item: ClassItem }) => {
		const timeParts = item.time.split(' - ');

		return (
			<View style={[styles.card, { width: cardWidth }]}>
				<View style={styles.imageWrapper}>
					<Image source={ClassImage} style={styles.image} />
				</View>

				<View style={styles.detailsPill}>
					<View style={styles.detailBlock}>
						<View style={styles.iconCircle}>
							<ClockIcon size={16} color='#000000' />
						</View>
						<View style={styles.textGroup}>
							<Text className='font-body' style={styles.detailTitle}>{t('dashboard.upcomingClasses.time')}</Text>
							{timeParts.length === 2 ? (
								<>
									<Text className='font-body' style={styles.timeValue}>{timeParts[0]} -</Text>
									<Text className='font-body' style={styles.timeValue}>{timeParts[1]}</Text>
								</>
							) : (
								<Text className='font-body' style={styles.timeValue}>{item.time}</Text>
							)}
						</View>
					</View>

					<View style={styles.separator} />

					<View style={styles.detailBlock}>
						<View style={[styles.iconCircle, styles.fireIconCircle]}>
							<FireIcon size={16} color='#000000' />
						</View>
						<View style={styles.textGroup}>
							<Text className='font-body' style={styles.detailTitle}>{t('dashboard.upcomingClasses.burn')}</Text>
							<Text className='font-body' style={styles.caloriesValue}>{item.calories}</Text>
						</View>
					</View>
				</View>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Text className='font-heading' style={styles.carouselTitle}>{t('dashboard.upcomingClasses.title')}</Text>

			<FlatList
				data={classes}
				renderItem={renderClassCard}
				keyExtractor={(item) => item.id}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.listContainer}
				snapToInterval={cardWidth + 16}
				decelerationRate='fast'
			/>
		</View>
	);
};

const ORANGE_COLOR = '#FF6B2C';
const LIME_GREEN = '#A6E22E';

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'transparent',
	},
	carouselTitle: {
		fontFamily: 'BebasNeue-Regular',
		fontSize: 28,
		color: '#000000',
		marginBottom: 12,
		textAlign: 'center',
	},
	listContainer: {
		paddingHorizontal: 16,
	},
	card: {
		backgroundColor: 'transparent',
		borderRadius: 18,
		marginRight: 16,
		overflow: 'visible',
		height: 180,
		position: 'relative',
	},
	imageWrapper: {
		width: '100%',
		height: '100%',
		borderRadius: 18,
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},
	detailsPill: {
		position: 'absolute',
		bottom: 10,
		left: 10,
		right: 10,
		backgroundColor: 'rgba(20, 20, 20, 0.75)',
		borderRadius: 12,
		borderWidth: 0.5,
		borderColor: 'rgba(166, 226, 46, 0.3)',
		paddingHorizontal: 12,
		paddingVertical: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	detailBlock: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	separator: {
		width: 1,
		height: '60%',
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		marginHorizontal: 8,
	},
	iconCircle: {
		backgroundColor: ORANGE_COLOR,
		borderRadius: 8,
		padding: 6,
		marginRight: 6,
		alignItems: 'center',
		justifyContent: 'center',
	},
	fireIconCircle: {
		backgroundColor: ORANGE_COLOR,
	},
	textGroup: {
		justifyContent: 'center',
		flex: 1,
	},
	detailTitle: {
		fontFamily: 'Montserrat_500Medium',
		fontSize: 9,
		color: '#FFFFFF',
		textTransform: 'uppercase',
		marginBottom: 1,
	},
	timeValue: {
		fontFamily: 'Montserrat_700Bold',
		fontSize: 12,
		color: ORANGE_COLOR,
		lineHeight: 14,
	},
	caloriesValue: {
		fontFamily: 'Montserrat_700Bold',
		fontSize: 12,
		color: LIME_GREEN,
	},
});
