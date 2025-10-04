// app/index.tsx
import { Redirect } from 'expo-router';

export default function StartPage() {
	const isAuthenticated = false;

	return isAuthenticated ? <Redirect href='/(tabs)' /> : <Redirect href='/(auth)/home' />;
}
