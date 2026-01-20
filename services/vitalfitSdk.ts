// Re-export SDK types
import {
	AssignedClientResponse,
	BranchClassInfo,
	ClassScheduleItem,
	KPICard,
	VitalFit,
	UserRoutineResponse,
	Routine,
	RoutineExercise,
	RoutineExerciseDTO,
	Exercise,
} from '@vitalfit/sdk';
import Constants from 'expo-constants';

export {
	AssignedClientResponse,
	BranchClassInfo,
	ClassScheduleItem,
	KPICard,
	UserRoutineResponse,
	Routine,
	RoutineExercise,
	RoutineExerciseDTO,
	Exercise,
};

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


export default vitalFitApi;
