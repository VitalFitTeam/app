// eslint.config.mts
import js from '@eslint/js';
import prettier from 'eslint-config-prettier'; // flat-config compatible
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	// Base JS
	js.configs.recommended,

	// TypeScript (flat configs ya traen parser y reglas base)
	...tseslint.configs.recommended,

	// React
	react.configs.flat.recommended,

	// Detectar versión de React
	{ settings: { react: { version: 'detect' } } },

	// TS y TSX (código de app)
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
		plugins: {
			'react-hooks': reactHooks, // <-- registrar plugin
		},
		rules: {
			'react/react-in-jsx-scope': 'off',
			// En RN se usa `require()` para imágenes
			'@typescript-eslint/no-require-imports': 'off',
			// Reglas de hooks
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
		},
	},

	// JS de Node / Metro / scripts: permitir require y console
	{
		files: ['*.js', 'metro.config.js', 'remove_console.js', 'scripts/**/*.js'],
		languageOptions: {
			sourceType: 'commonjs',
			globals: { ...globals.node },
		},
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-var-requires': 'off',
			'no-console': 'off',
		},
	},

	// Ignorados
	{
		ignores: ['node_modules', 'dist', 'build', 'android', 'ios', '.expo', '.prettierrc.js'],
	},

	// Siempre al final: desactiva reglas que choquen con Prettier
	prettier,
]);
