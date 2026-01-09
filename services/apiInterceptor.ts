import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';

import vitalFitApi from './vitalfitSdk';

type RequestConfig = {
	url: string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	data?: any;
	headers?: Record<string, string>;
};

type InterceptorCallbacks = {
	onTokenRefresh?: () => Promise<void>;
	onLogout?: () => Promise<void>;
};

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Subscribe to token refresh completion
function subscribeTokenRefresh(callback: (token: string) => void) {
	refreshSubscribers.push(callback);
}

// Notify all subscribers when token is refreshed
function onTokenRefreshed(token: string) {
	refreshSubscribers.forEach((callback) => callback(token));
	refreshSubscribers = [];
}

// Refresh the access token using refresh_token
async function refreshAccessToken(): Promise<string | null> {
	try {
		const refreshToken = await AsyncStorage.getItem('refresh_token');

		if (!refreshToken) {
			console.error('No refresh token available');
			return null;
		}

		const response = await vitalFitApi.auth.refresh({
			refresh_token: refreshToken,
		});

		const newToken = response.token;
		const newRefreshToken = (response as any).refresh_token;

		if (newToken) {
			await AsyncStorage.setItem('token', newToken);
			if (newRefreshToken) {
				await AsyncStorage.setItem('refresh_token', newRefreshToken);
			}
			return newToken;
		}

		return null;
	} catch (error) {
		console.error('Error refreshing token:', error);
		return null;
	}
}

// Check if error is 401 Unauthorized
function isUnauthorizedError(error: unknown): boolean {
	if (isAPIError(error)) {
		return error.status === 401;
	}
	return false;
}

// Interceptor function to handle requests with automatic token refresh
export async function apiRequestWithInterceptor<T>(
	requestFn: () => Promise<T>,
	callbacks?: InterceptorCallbacks
): Promise<T> {
	try {
		return await requestFn();
	} catch (error) {
		// If not a 401 error, just throw it
		if (!isUnauthorizedError(error)) {
			throw error;
		}

		// Handle 401 - token expired
		console.log('Token expired (401), attempting refresh...');

		// If already refreshing, wait for the refresh to complete
		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				subscribeTokenRefresh(async (newToken) => {
					try {
						// Retry the original request with new token
						const result = await requestFn();
						resolve(result);
					} catch (retryError) {
						reject(retryError);
					}
				});
			});
		}

		// Start refreshing
		isRefreshing = true;

		try {
			const newToken = await refreshAccessToken();

			if (newToken) {
				console.log('Token refreshed successfully');
				isRefreshing = false;

				// Notify all waiting requests
				onTokenRefreshed(newToken);

				// Call the onTokenRefresh callback if provided
				if (callbacks?.onTokenRefresh) {
					await callbacks.onTokenRefresh();
				}

				// Retry the original request
				return await requestFn();
			} else {
				// Refresh failed, logout user
				console.error('Token refresh failed, logging out');
				isRefreshing = false;

				// Clear tokens
				await AsyncStorage.multiRemove(['token', 'refresh_token']);

				// Call the onLogout callback if provided
				if (callbacks?.onLogout) {
					await callbacks.onLogout();
				}

				throw new Error('Session expired. Please login again.');
			}
		} catch (refreshError) {
			isRefreshing = false;
			console.error('Error during token refresh:', refreshError);

			// Clear tokens
			await AsyncStorage.multiRemove(['token', 'refresh_token']);

			// Call the onLogout callback if provided
			if (callbacks?.onLogout) {
				await callbacks.onLogout();
			}

			throw new Error('Session expired. Please login again.');
		}
	}
}

// Wrapper for SDK calls that need token refresh handling
export async function withTokenRefresh<T>(
	apiCall: () => Promise<T>,
	callbacks?: InterceptorCallbacks
): Promise<T> {
	return apiRequestWithInterceptor(apiCall, callbacks);
}
