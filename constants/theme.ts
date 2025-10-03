
// --- Nueva Paleta de Colores VitalFit ---
const naranjaVital = '#F27F2A';
const negroCarbon = '#1A1A1A';
const grisOscuro = '#5C5E60';
const verdeVital = '#42672D';
const rojoIntenso = '#EA232D';

export const Colors = {
	light: {
		text: negroCarbon,
		background: '#FFFFFF', // Fondo blanco para el tema claro
		tint: naranjaVital,
		icon: grisOscuro,
		tabIconDefault: grisOscuro,
		tabIconSelected: naranjaVital,
	},
	dark: {
		text: '#FFFFFF', // Texto blanco para el tema oscuro
		background: negroCarbon,
		tint: naranjaVital,
		icon: grisOscuro,
		tabIconDefault: grisOscuro,
		tabIconSelected: naranjaVital,
	},
	// Colores adicionales para uso específico
	accent: {
		green: verdeVital,
		red: rojoIntenso,
	},
};

export const Fonts = {
	title: 'BebasNeue-Regular',
	subtitle: 'Montserrat-ExtraBold',
	default: 'Montserrat-ExtraBold', // Usamos Montserrat como fuente por defecto para el resto del texto
};