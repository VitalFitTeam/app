import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAPIError } from '@vitalfit/sdk';
import type { VitalFit } from '@vitalfit/sdk';

import vitalFitApi, { rawVitalFitApi } from './vitalfitSdk';

// Token refresh state
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Subscribe to token refresh
function subscribeTokenRefresh(callback: (token: string) => void) {
	refreshSubscribers.push(callback);
}

// Notify all subscribers
function onTokenRefreshed(token: string) {
	refreshSubscribers.forEach((callback) => callback(token));
	refreshSubscribers = [];
}

// Refresh access token
async function refreshAccessToken(): Promise<string | null> {
	try {
		const refreshToken = await AsyncStorage.getItem('refresh_token');
		if (!refreshToken) {
			console.error('[SDK Middleware] No refresh token available');
			return null;
		}

		console.log('[SDK Middleware] Refreshing token...');
		// Use rawVitalFitApi to avoid infinite loop
		const response = await rawVitalFitApi.auth.refresh({
			refresh_token: refreshToken,
		});

		const newToken = response.token;
		const newRefreshToken = (response as { refresh_token?: string }).refresh_token;

		if (newToken) {
			await AsyncStorage.setItem('token', newToken);
			if (newRefreshToken) {
				await AsyncStorage.setItem('refresh_token', newRefreshToken);
			}
			console.log('[SDK Middleware] Token refreshed successfully');
			return newToken;
		}

		return null;
	} catch (error) {
		console.error('[SDK Middleware] Error refreshing token:', error);
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

// Intercept function calls and handle 401 errors
async function interceptApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
	try {
		return await apiCall();
	} catch (error) {
		// If not 401, just throw
		if (!isUnauthorizedError(error)) {
			throw error;
		}

		console.log('[SDK Middleware] 401 detected, attempting token refresh...');

		// If already refreshing, wait for it
		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				subscribeTokenRefresh(async () => {
					try {
						const result = await apiCall();
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
				isRefreshing = false;
				onTokenRefreshed(newToken);

				// Retry original request
				return await apiCall();
			} else {
				// Refresh failed - clear tokens and throw
				isRefreshing = false;
				await AsyncStorage.multiRemove(['token', 'refresh_token']);
				throw new Error('Session expired. Please login again.');
			}
		} catch {
			isRefreshing = false;
			await AsyncStorage.multiRemove(['token', 'refresh_token']);
			throw new Error('Session expired. Please login again.');
		}
	}
}

// Create a Proxy wrapper for any object
function createProxy<T extends object>(target: T, _path: string[] = []): T {
	return new Proxy(target, {
		get(obj, prop: string | symbol) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const value = (obj as any)[prop];

			// If it's a function, wrap it with the interceptor
			if (typeof value === 'function') {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return function (this: any, ...args: any[]) {
					const result = value.apply(this, args);

					// If the result is a Promise, intercept it
					if (result instanceof Promise) {
						return interceptApiCall(() => result);
					}

					return result;
				};
			}

			// If it's an object (like auth, user, etc.), recursively proxy it
			if (typeof value === 'object' && value !== null) {
				return createProxy(value, [..._path, prop.toString()]);
			}

			return value;
		},
	});
}

// Export the proxied SDK
const vitalFitApiWithMiddleware = createProxy(vitalFitApi) as typeof VitalFit.prototype;

export default vitalFitApiWithMiddleware;
