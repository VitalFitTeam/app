import { VitalFit } from '@vitalfit/sdk';
import Constants from 'expo-constants';

const isDevMode =
	Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL === 'http://localhost:3000/v1' ||
	process.env.EXPO_PUBLIC_API_URL === 'http://localhost:3000/v1';

// SDK instance with built-in automatic token refresh
const vitalFitApi = VitalFit.getInstance(isDevMode);

// Override the hardcoded baseURL with environment variable
const API_URL =
	Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
	process.env.EXPO_PUBLIC_API_URL;

if (API_URL && vitalFitApi.client?.client?.defaults) {
	vitalFitApi.client.client.defaults.baseURL = API_URL;
	console.log('VitalFit SDK baseURL configured to:', API_URL);
}


export default vitalFitApi;
