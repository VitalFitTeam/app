// components/auth/Logo.tsx
import { Image } from 'expo-image';

export function Logo() {
	return (
		<Image
			source={require('@/assets/images/isotipo.png')}
			style={{ width: 60, height: 60, marginBottom: 24 }}
			contentFit="contain"
		/>
	);
}