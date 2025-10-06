// components/auth/Logo.tsx
import { Image } from 'expo-image';

export function Logo() {
	return (
		<Image
			source={require('@/assets/images/logoo.png')}
			style={{ width: 190, height: 200, marginBottom: 24 }}
			contentFit='contain'
		/>
	);
}
