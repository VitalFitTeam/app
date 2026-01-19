import { UserAvatar } from '@/components/UserAvatar';
import { Award, Bell } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Notification {
	id: string;
	title: string;
	time: string;
}

interface Props {
	name: string;
	avatarUrl?: string;
	notifications?: Notification[];
	onBadgesPress?: () => void;
}

export const UserHeader: React.FC<Props> = ({ name, avatarUrl, notifications, onBadgesPress }) => {
	const { t } = useTranslation();
	const defaultNotifications = [
		{ id: '1', title: t('dashboard.notifications.mock.classStarting'), time: 'Hace 5 min' },
		{ id: '2', title: t('dashboard.notifications.mock.paymentReceived'), time: 'Hace 1 hora' },
	];
	const activeNotifications = notifications || defaultNotifications;
	const [showNotifications, setShowNotifications] = useState(false);
	const firstName = name.split(' ')[0];

	return (
		<View className='mb-6 mt-2'>
			<View style={styles.logoContainer}>
				<Image
					source={require('@/assets/images/Frame.png')}
					style={styles.logo}
					resizeMode='contain'
				/>
			</View>

			<View className='mt-6 flex-row items-center justify-between'>
				<View className='flex-1 flex-row items-center'>
					<UserAvatar
						name={name}
						imageUrl={avatarUrl}
						size={70}
						style={{ marginRight: 12 }}
					/>
					<View>
						<Text
							className='font-heading'
							style={{
								fontFamily: 'BebasNeue-Regular',
								fontWeight: '700',
								fontSize: 31,
								color: '#000',
							}}>
							{firstName}
						</Text>
					</View>
				</View>

				<View className='flex-row items-center gap-3'>
					{onBadgesPress && (
						<TouchableOpacity onPress={onBadgesPress} activeOpacity={0.7}>
							<Award size={24} color='#333' strokeWidth={2} />
						</TouchableOpacity>
					)}

					<TouchableOpacity
						onPress={() => setShowNotifications(!showNotifications)}
						className='relative'
						activeOpacity={0.7}>
						<Bell size={24} color='#333' />
						{activeNotifications.length > 0 && (
							<View className='absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-red-500' />
						)}
					</TouchableOpacity>
				</View>
			</View>

			{showNotifications && (
				<TouchableOpacity
					style={styles.notificationOverlay}
					activeOpacity={1}
					onPress={() => setShowNotifications(false)}>
					<TouchableOpacity
						activeOpacity={1}
						onPress={(e) => e.stopPropagation()}
						style={styles.notificationModal}>
						<Text className='mb-2 font-heading text-base font-semibold'>
							{t('dashboard.notifications.title')}
						</Text>
						{activeNotifications.length > 0 ? (
							<FlatList
								data={activeNotifications}
								keyExtractor={(item) => item.id}
								renderItem={({ item }) => (
									<View className='mb-2'>
										<Text className='font-body text-sm font-medium text-gray-800 dark:text-gray-200'>
											{item.title}
										</Text>
										<Text className='font-body text-xs text-gray-400'>
											{item.time}
										</Text>
									</View>
								)}
							/>
						) : (
							<Text className='font-body text-sm text-gray-400'>
								{t('dashboard.notifications.empty')}
							</Text>
						)}
					</TouchableOpacity>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	logoContainer: {
		alignItems: 'center',
		marginBottom: 8,
	},
	logo: {
		width: 150,
		height: 50,
	},
	notificationOverlay: {
		position: 'absolute',
		top: 0,
		left: -16,
		right: -16,
		bottom: -100,
		zIndex: 50,
	},
	notificationModal: {
		position: 'absolute',
		right: 16,
		top: 110,
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: '#E5E7EB',
		borderRadius: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 5,
		padding: 12,
		width: 288,
		zIndex: 51,
	},
});
