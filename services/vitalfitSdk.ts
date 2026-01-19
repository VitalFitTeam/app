// Re-export SDK types
import {
	AssignedClientResponse,
	BranchClassInfo,
	ClassScheduleItem,
	KPICard,
	VitalFit,
} from '@vitalfit/sdk';
import Constants from 'expo-constants';

export { AssignedClientResponse, BranchClassInfo, ClassScheduleItem, KPICard };

const isDevMode =
	Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL === 'http://localhost:3000/v1' ||
	process.env.EXPO_PUBLIC_API_URL === 'http://localhost:3000/v1';

// SDK instance with built-in automatic token refresh
const vitalFitApi = VitalFit.getInstance(isDevMode);

// Override the hardcoded baseURL with environment variable
const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (API_URL && (vitalFitApi.client as any).client?.defaults) {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	(vitalFitApi.client as any).client.defaults.baseURL = API_URL;
	/* eslint-enable @typescript-eslint/no-explicit-any */
	console.log('VitalFit SDK baseURL configured to:', API_URL);
}

// Add request interceptor to log what's actually being sent
if (vitalFitApi.client?.client?.interceptors) {
	vitalFitApi.client.client.interceptors.request.use(
		(config) => {
			if (config.url?.includes('/auth/login') || config.url?.includes('/auth/oauth-login')) {
				console.log('🔍 INTERCEPTED REQUEST TO:', config.url);
				console.log('🔍 Request Method:', config.method);
				console.log('🔍 Request Headers:', JSON.stringify(config.headers, null, 2));
				console.log('🔍 Request Data (what SDK is actually sending):', JSON.stringify(config.data, null, 2));
			}
			return config;
		},
		(error) => {
			console.error('🔍 Request interceptor error:', error);
			return Promise.reject(error);
		}
	);
}

export default vitalFitApi;
