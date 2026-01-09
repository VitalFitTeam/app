import { VitalFit } from '@vitalfit/sdk';
import Constants from 'expo-constants';

const isDevMode =
	Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL === 'http://localhost:3000/v1' ||
	Constants.manifest?.extra?.EXPO_PUBLIC_API_URL === 'http://localhost:3000/v1' ||
	process.env.EXPO_PUBLIC_API_URL === 'http://localhost:3000/v1';

// Base SDK instance (used internally by middleware)
const vitalFitApi = VitalFit.getInstance(isDevMode);

export default vitalFitApi;

// Export the raw instance for special cases (like auth.refresh which shouldn't be intercepted)
export const rawVitalFitApi = vitalFitApi;
