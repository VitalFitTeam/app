import vitalFitApi from './vitalfitSdk';

export interface Notification {
	id: string;
	title: string;
	message: string;
	type: string;
	is_read: boolean;
	metadata: Record<string, unknown>;
	created_at: string;
}

export interface NotificationSettings {
	classReminders: boolean;
	routineUpdates: boolean;
	promotions: boolean;
	systemMessages: boolean;
}

export interface PaginatedNotifications {
	data: Notification[];
	count: number;
	total: number;
	next: string | null;
	previous: string | null;
}

/**
 * Register device push token with the backend
 */
export async function registerDeviceToken(
	token: string,
	deviceToken: string
): Promise<void> {
	try {
		console.log('Attempting to register device token:', deviceToken);

		// Direct API call - endpoint not implemented yet
		await vitalFitApi.client.post({
			url: '/notifications/register',
			jwt: token,
			data: {
				device_token: deviceToken,
				platform: 'expo',
			},
		});

		console.log('Device token registered successfully');
	} catch (error: unknown) {
		// Endpoint not implemented yet - just log the token for now
		const apiError = error as { status?: number };
		if (apiError?.status === 404) {
			console.warn('Device registration endpoint not implemented yet');
			console.log('Device token (save this for testing):', deviceToken);
			// Don't throw error - allow app to continue
			return;
		}

		console.error('Error registering device token:', error);
		// Don't throw - allow app to continue even if registration fails
	}
}

/**
 * Get user notifications with pagination
 */
export async function getUserNotifications(
	token: string,
	page: number = 1,
	limit: number = 20
): Promise<PaginatedNotifications> {
	try {
		// Direct API call until SDK is updated
		const response = await vitalFitApi.client.get({
			url: '/notifications',
			jwt: token,
			params: {
				page,
				limit,
			},
		});
		return response;
	} catch (error) {
		console.error('Error fetching notifications:', error);
		throw error;
	}
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(
	token: string,
	notificationId: string
): Promise<void> {
	try {
		// Direct API call until SDK is updated
		await vitalFitApi.client.patch({
			url: `/notifications/${notificationId}/read`,
			jwt: token,
		});
	} catch (error) {
		console.error('Error marking notification as read:', error);
		throw error;
	}
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(token: string): Promise<void> {
	try {
		// Direct API call until SDK is updated
		await vitalFitApi.client.patch({
			url: '/notifications/read-all',
			jwt: token,
		});
	} catch (error) {
		console.error('Error marking all notifications as read:', error);
		throw error;
	}
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(token: string): Promise<number> {
	try {
		// Direct API call until SDK is updated
		const response = await vitalFitApi.client.get({
			url: '/notifications/unread-count',
			jwt: token,
		});
		return response.count;
	} catch (error) {
		console.error('Error fetching unread count:', error);
		throw error;
	}
}

/**
 * Get notification settings
 */
export async function getNotificationSettings(
	token: string
): Promise<NotificationSettings> {
	try {
		// Direct API call until SDK is updated
		// This endpoint might not exist yet - return defaults for now
		const settings = await vitalFitApi.client.get({
			url: '/notifications/settings',
			jwt: token,
		});
		return settings;
	} catch (error) {
		console.error('Error fetching notification settings:', error);
		// Return default settings if endpoint doesn't exist
		return {
			classReminders: true,
			routineUpdates: true,
			promotions: false,
			systemMessages: true,
		};
	}
}

/**
 * Update notification settings
 */
export async function updateNotificationSettings(
	token: string,
	settings: Partial<NotificationSettings>
): Promise<NotificationSettings> {
	try {
		// Direct API call until SDK is updated
		const updatedSettings = await vitalFitApi.client.patch({
			url: '/notifications/settings',
			jwt: token,
			data: settings,
		});
		return updatedSettings;
	} catch (error) {
		console.error('Error updating notification settings:', error);
		throw error;
	}
}

/**
 * Delete a notification
 */
export async function deleteNotification(
	token: string,
	notificationId: string
): Promise<void> {
	try {
		// Direct API call until SDK is updated
		await vitalFitApi.client.delete({
			url: `/notifications/${notificationId}`,
			jwt: token,
		});
	} catch (error) {
		console.error('Error deleting notification:', error);
		throw error;
	}
}
