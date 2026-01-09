import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import vitalFitApi from '@/services';

type AuthContextType = {
	isAuthenticated: boolean;
	isLoading: boolean;
	token: string | null;
	refreshToken: string | null;
	login: (token: string, refreshToken?: string) => Promise<void>;
	logout: () => Promise<void>;
	refresh: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [token, setToken] = useState<string | null>(null);
	const [refreshToken, setRefreshToken] = useState<string | null>(null);
	const router = useRouter();

	// Initialize auth state from storage
	const initializeAuth = useCallback(async () => {
		try {
			setIsLoading(true);
			const storedToken = await AsyncStorage.getItem('token');
			const storedRefreshToken = await AsyncStorage.getItem('refresh_token');

			if (storedToken) {
				setToken(storedToken);
				setRefreshToken(storedRefreshToken);
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
			}
		} catch (error) {
			console.error('Error initializing auth:', error);
			setIsAuthenticated(false);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Login function - stores tokens and updates state
	const login = useCallback(async (newToken: string, newRefreshToken?: string) => {
		try {
			await AsyncStorage.setItem('token', newToken);
			if (newRefreshToken) {
				await AsyncStorage.setItem('refresh_token', newRefreshToken);
			}
			setToken(newToken);
			setRefreshToken(newRefreshToken || null);
			setIsAuthenticated(true);
		} catch (error) {
			console.error('Error storing tokens:', error);
			throw error;
		}
	}, []);

	// Logout function - clears tokens and redirects
	const logout = useCallback(async () => {
		try {
			await AsyncStorage.multiRemove(['token', 'refresh_token', 'temp_email', 'temp_password']);
			setToken(null);
			setRefreshToken(null);
			setIsAuthenticated(false);
			router.replace('/(auth)/login');
		} catch (error) {
			console.error('Error during logout:', error);
		}
	}, [router]);

	// Refresh token function - gets new token using refresh_token
	const refresh = useCallback(async (): Promise<boolean> => {
		try {
			const storedRefreshToken = await AsyncStorage.getItem('refresh_token');

			if (!storedRefreshToken) {
				console.error('No refresh token available');
				await logout();
				return false;
			}

			// Call the refresh endpoint
			const response = await vitalFitApi.auth.refresh({
				refresh_token: storedRefreshToken,
			});

			const newToken = response.token;
			const newRefreshToken = (response as { refresh_token?: string }).refresh_token;

			if (newToken) {
				await login(newToken, newRefreshToken || storedRefreshToken);
				return true;
			} else {
				console.error('No token received from refresh');
				await logout();
				return false;
			}
		} catch (error) {
			console.error('Error refreshing token:', error);
			await logout();
			return false;
		}
	}, [login, logout]);

	// Initialize on mount
	useEffect(() => {
		initializeAuth();
	}, [initializeAuth]);

	const value = useMemo<AuthContextType>(
		() => ({
			isAuthenticated,
			isLoading,
			token,
			refreshToken,
			login,
			logout,
			refresh,
		}),
		[isAuthenticated, isLoading, token, refreshToken, login, logout, refresh]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
