// components/auth/Logo.tsx
import { Image } from 'expo-image';

export function Logo() {
	return (
		<Image
			source={require('@/assets/images/logovitalfit.png')}
			style={{ width: 120, height: 120, marginBottom: 24 }}
			contentFit='contain'
		/>
	);
}

export function LogoSimple() {
	return (
		<Image
			source={require('@/assets/images/isotipo.png')}
			style={{ width: 200, height: 200, marginBottom: 16 }}
			contentFit='contain'
		/>
	);
}

export function LogoVitalFit() {
	return (
		<Image
			source={require('@/assets/images/logoVitalFitH.png')}
			style={{ width: 200, height: 200, marginBottom: 16 }}
			contentFit='contain'
		/>
	);
}
