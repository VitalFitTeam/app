// app/language.tsx
import { PrimaryButton } from '@/components/PrimaryButton';
import { Stack, useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- Importa tu configuración de i18n ---
// import i18n from '../services/i18n'; // (Ajusta esta ruta)

// Opciones de idioma
const LANGUAGES = [
	{ code: 'en', name: 'English' },
	{ code: 'es', name: 'Español' },
	// Agrega más idiomas si es necesario
];

export default function LanguageScreen() {
	const router = useRouter();

	// Obtén el idioma actual de i18n
	// const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
	// --- Placeholder si aún no tienes i18n ---
	const [selectedLanguage, setSelectedLanguage] = useState('es');

	const handleSaveLanguage = () => {
		// 1. Guarda el idioma seleccionado usando i18n
		// i18n.changeLanguage(selectedLanguage);

		// 2. Redirige al usuario a la pantalla de bienvenida (index.tsx)
		// Usamos "replace" para que el usuario no pueda "volver" a la pantalla de idioma
		router.replace('/');
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<Stack.Screen
					options={{
						title: 'Idioma',
						headerBackTitle: 'Volver',
						headerShadowVisible: false,
						headerStyle: { backgroundColor: '#F2F2F7' },
						headerTitleStyle: {
							fontWeight: 'bold',
						},
					}}
				/>

				<View style={styles.optionsContainer}>
					{LANGUAGES.map((lang) => (
						<TouchableOpacity
							key={lang.code}
							style={styles.option}
							onPress={() => setSelectedLanguage(lang.code)}>
							<Text style={styles.optionText}>{lang.name}</Text>
							{selectedLanguage === lang.code && <Check color='#007AFF' size={24} />}
						</TouchableOpacity>
					))}
				</View>

				<View style={styles.buttonContainer}>
					<PrimaryButton title='Guardar' onPress={handleSaveLanguage} />
				</View>
			</View>
		</SafeAreaView>
	);
}

// Estilos
const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#F2F2F7',
	},
	container: {
		flex: 1,
	},
	optionsContainer: {
		backgroundColor: 'white',
		borderRadius: 10,
		margin: 16,
		overflow: 'hidden', // Para que el borde redondeado afecte a los items
	},
	option: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0',
	},
	optionText: {
		fontSize: 16,
	},
	buttonContainer: {
		padding: 16,
		marginTop: 'auto', // Empuja el botón al fondo
	},
});
