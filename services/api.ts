// services/api.ts
import axios from 'axios';

// Lee la variable de entorno directamente
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Verifica que la URL exista
if (!API_URL) {
	throw new Error(
		'La variable de entorno EXPO_PUBLIC_API_URL no está configurada. Revisa tu archivo .env',
	);
}

const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

export default api;
