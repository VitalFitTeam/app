import { VitalFit } from '@vitalfit/sdk';
import Constants from 'expo-constants';

const isDevMode =
	Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL === 'http://localhost:3000/v1' ||
	Constants.manifest?.extra?.EXPO_PUBLIC_API_URL === 'http://localhost:3000/v1' ||
	process.env.EXPO_PUBLIC_API_URL === 'http://localhost:3000/v1';

// SDK instance with built-in automatic token refresh
const vitalFitApi = VitalFit.getInstance(isDevMode);

export default vitalFitApi;
