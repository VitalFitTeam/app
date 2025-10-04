// components/auth/Logo.tsx
import { Image } from 'expo-image';

export function Logo() {
	return (
		<Image
			source={require('@/assets/images/logovitalfit.png')}
			style={{ width: 200, height: 200, marginBottom: 24 }}
			contentFit='contain'
		/>
	);
}
