// components/themed-text.tsx

import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts } from '@/constants/theme'; // Importa las fuentes
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
	lightColor?: string;
	darkColor?: string;
	type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
	style,
	lightColor,
	darkColor,
	type = 'default',
	...rest
}: ThemedTextProps) {
	const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

	// Determina la familia de fuente según el tipo
	const fontFamily =
		type === 'title'
			? Fonts.title
			: type === 'subtitle' || type === 'defaultSemiBold'
				? Fonts.subtitle
				: Fonts.default;

	return (
		<Text
			style={[
				{ color, fontFamily }, // Aplica el color y la fuente
				type === 'default' ? styles.default : undefined,
				type === 'title' ? styles.title : undefined,
				type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
				type === 'subtitle' ? styles.subtitle : undefined,
				type === 'link' ? styles.link : undefined,
				style,
			]}
			{...rest}
		/>
	);
}

const styles = StyleSheet.create({
	default: {
		fontSize: 16,
		lineHeight: 24,
	},
	defaultSemiBold: {
		fontSize: 16,
		lineHeight: 24,
	},
	title: {
		fontSize: 42, // Ajusta el tamaño para Bebas Neue
		lineHeight: 42,
	},
	subtitle: {
		fontSize: 20,
	},
	link: {
		lineHeight: 30,
		fontSize: 16,
		color: '#0a7ea4',
	},
});
