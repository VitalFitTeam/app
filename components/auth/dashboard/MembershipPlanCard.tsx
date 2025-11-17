import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CheckCircleIcon } from 'react-native-heroicons/solid';

type MembershipCardProps = {
	title: string;
	price: string;
	features: string[];
	isSelected?: boolean;
	onPress?: () => void;
};

	export default function MembershipCard({
	title,
	price,
	features,
	isSelected = false,
	onPress,
}: MembershipCardProps) {
	return (
		<TouchableOpacity
			activeOpacity={0.9}
			onPress={onPress}
			style={[
				styles.card,
				isSelected ? styles.cardSelected : styles.cardDefault,
			]}
		>
			<View className='flex-1 mr-4'>
				<ThemedText
					lightColor='#ffffff'
					darkColor='#ffffff'
					className='text-base font-semibold mb-1'
				>
					{title}
				</ThemedText>
				{features.length > 0 && (
					<ThemedText
						lightColor='#e5e7eb'
						darkColor='#e5e7eb'
						className='text-xs mb-2'
						numberOfLines={2}
					>
						{features[0]}
					</ThemedText>
				)}
				<View className='flex-row items-baseline'>
					<ThemedText
						lightColor='#ffffff'
						darkColor='#ffffff'
						className='text-sm font-semibold mr-1'
					>
						${price}
					</ThemedText>
					<ThemedText
						lightColor='#e5e7eb'
						darkColor='#e5e7eb'
						className='text-xs font-semibold'
					>
						/mes
					</ThemedText>
				</View>
			</View>
			<View className='items-center justify-center'>
				<CheckCircleIcon
					size={28}
					color={isSelected ? '#F97316' : '#E5E7EB'}
				/>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderRadius: 24,
		paddingHorizontal: 20,
		paddingVertical: 12,
		marginBottom: 16,
	},
	cardDefault: {
		backgroundColor: '#171717',
		borderColor: '#404040',
	},
	cardSelected: {
		backgroundColor: '#171717',
		borderColor: '#f97316',
		shadowColor: '#f97316',
		shadowOpacity: 0.3,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 4 },
		elevation: 4,
	},
});
