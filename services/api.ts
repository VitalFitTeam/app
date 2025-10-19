// src/services/api.ts
import axios from 'axios';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

let API_URL: string | undefined =
	Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
	Constants.manifest?.extra?.EXPO_PUBLIC_API_URL ||
	process.env.EXPO_PUBLIC_API_URL;

// 🔍 Diagnóstico directo en el APK
if (!API_URL) {
	console.warn('⚠️ EXPO_PUBLIC_API_URL no encontrada en runtime');
	Alert.alert(
		'Error de configuración',
		'La variable EXPO_PUBLIC_API_URL no está configurada en el APK.\n\nRevisa el archivo app.config.js o EAS Secrets.',
	);
	// Valor de fallback opcional (no crash)
	API_URL = 'https://api-rm8x.onrender.com/v1';
} else {
	console.log('✅ API_URL detectada:', API_URL);
}

const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

export default api;
