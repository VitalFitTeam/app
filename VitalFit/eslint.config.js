// VitalFit/eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	// Alcance y entorno
	{
		files: ['**/*.{js,mjs,cjs,ts,tsx}'],
		ignores: ['node_modules', 'dist', 'build'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},

	// Base recomendada de ESLint
	js.configs.recommended,

	// Reglas recomendadas de TypeScript
	...tseslint.configs.recommended,

	// Reglas personalizadas (ajústalas a tu gusto)
	{
		rules: {
			// Buenas prácticas
			eqeqeq: ['error', 'always'],
			'no-console': 'warn',
			'no-debugger': 'error',
			curly: ['error', 'all'],

			// Estilo
			quotes: ['error', 'double', { avoidEscape: true }],
			semi: ['error', 'always'],
			indent: ['error', 2],
			'comma-dangle': ['error', 'always-multiline'],

			// TypeScript
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
		},
	},
];
