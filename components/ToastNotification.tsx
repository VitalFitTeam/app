// components/ToastNotification.tsx
import { CheckCircle, X, XCircle } from 'lucide-react-native';
import { useCallback, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
	type: 'success' | 'error';
	title: string;
	message: string;
	visible: boolean;
	onClose: () => void;
	duration?: number;
}

export function ToastNotification({
	type,
	title,
	message,
	visible,
	onClose,
	duration = 5000,
}: Props) {
	const translateY = useRef(new Animated.Value(-100)).current;

	const handleClose = useCallback(() => {
		Animated.timing(translateY, {
			toValue: -100,
			duration: 200,
			useNativeDriver: true,
		}).start(onClose);
	}, [onClose, translateY]);

	useEffect(() => {
		if (visible) {
			Animated.spring(translateY, {
				toValue: 0,
				useNativeDriver: true,
				tension: 50,
				friction: 7,
			}).start();

			const timer = setTimeout(handleClose, duration);

			return () => clearTimeout(timer);
		}
	}, [visible, duration, handleClose, translateY]);

	if (!visible) return null;

	const isSuccess = type === 'success';
	const backgroundColor = isSuccess ? '#D1F4E0' : '#FFE5E5';
	const iconColor = isSuccess ? '#22C55E' : '#EF4444';
	const Icon = isSuccess ? CheckCircle : XCircle;

	return (
		<Animated.View style={[styles.container, { backgroundColor, transform: [{ translateY }] }]}>
			<View style={styles.content}>
				<View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
					<Icon size={24} color='white' />
				</View>
				<View style={styles.textContainer}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.message}>{message}</Text>
				</View>
				<TouchableOpacity onPress={handleClose} style={styles.closeButton}>
					<X size={20} color='#6B7280' />
				</TouchableOpacity>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 60,
		left: 20,
		right: 20,
		borderRadius: 12,
		paddingVertical: 16,
		paddingHorizontal: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 5,
		zIndex: 1000,
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	textContainer: {
		flex: 1,
		gap: 4,
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		color: '#1F2937',
	},
	message: {
		fontSize: 14,
		color: '#6B7280',
	},
	closeButton: {
		padding: 4,
	},
});
