import 'dotenv/config';

export default {
	expo: {
		name: 'VitalFit',
		slug: 'VitalFit',
		version: '1.0.0',
		orientation: 'portrait',
		icon: './assets/images/icon.png',
		scheme: 'vitalfit',
		userInterfaceStyle: 'automatic',
		newArchEnabled: true,
		ios: {
			supportsTablet: true,
		},
		android: {
			adaptiveIcon: {
				backgroundColor: '#E6F4FE',
				foregroundImage: './assets/images/android-icon-foreground.png',
				backgroundImage: './assets/images/android-icon-background.png',
				monochromeImage: './assets/images/android-icon-monochrome.png',
			},
			edgeToEdgeEnabled: true,
			predictiveBackGestureEnabled: false,
			package: 'com.mrwisz.VitalFit',
		},
		web: {
			output: 'static',
			favicon: './assets/images/favicon.png',
		},
		plugins: [
			'expo-router',
			[
				'expo-splash-screen',
				{
					image: './assets/images/splash-icon.png',
					imageWidth: 200,
					resizeMode: 'contain',
					backgroundColor: '#ffffff',
					dark: {
						backgroundColor: '#000000',
					},
				},
			],
			'expo-font',
		],
		experiments: {
			typedRoutes: true,
		},
		extra: {
			router: {},
			eas: {
				projectId: '9082188e-00ad-4870-a784-a22d7a9af57a',
			},
			// 👇 Esta línea inyecta la variable del .env
			//EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
		},
		owner: 'mrwisz',
	},
};
