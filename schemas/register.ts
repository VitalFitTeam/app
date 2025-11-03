// schemas/register.ts
import { z } from 'zod';

// Esquema para el Paso 1: Género
export const Step1Schema = z.object({
	gender: z.enum(['female', 'male', 'prefer-not-to-say'], {
		errorMap: () => ({ message: 'Por favor, selecciona un género.' }),
	}),
});

// Esquema para el Paso 2: Credenciales
export const Step2Schema = z
	.object({
		email: z.string().email('El correo no es válido.'),
		password: z
			.string()
			.min(8, 'La contraseña debe tener al menos 8 caracteres.')
			.regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula.')
			.regex(/[a-z]/, 'La contraseña debe tener al menos una minúscula.')
			.regex(/[0-9]/, 'La contraseña debe tener al menos un número.')
			.regex(/[^a-zA-Z0-9]/, 'La contraseña debe tener al menos un caracter especial.'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Las contraseñas no coinciden.',
		path: ['confirmPassword'],
	});

// Esquema completo para el registro
export const RegisterSchema = z
	.object({
		gender: z.enum(['female', 'male', 'prefer-not-to-say'], {
			errorMap: () => ({ message: 'Por favor, selecciona un género.' }),
		}),
		email: z.string().email('El correo no es válido.'),
		password: z
			.string()
			.min(8, 'La contraseña debe tener al menos 8 caracteres.')
			.regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula.')
			.regex(/[a-z]/, 'La contraseña debe tener al menos una minúscula.')
			.regex(/[0-9]/, 'La contraseña debe tener al menos un número.')
			.regex(/[^a-zA-Z0-9]/, 'La contraseña debe tener al menos un caracter especial.'),
		confirmPassword: z.string(),
		name: z
			.string()
			.min(1, 'El nombre es requerido.')
			.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El nombre solo puede contener letras.'),
		lastName: z
			.string()
			.min(1, 'El apellido es requerido.')
			.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El apellido solo puede contener letras.'),
		documentId: z.string().min(1, 'El documento es requerido.'),
		birthDate: z.string().min(1, 'La fecha de nacimiento es requerida.'),
		phone: z.string().min(1, 'El teléfono es requerido.').optional().nullable(),
		acceptTerms: z.boolean().refine((val) => val === true, {
			message: 'Debes aceptar los términos y condiciones.',
		}),
		profile_picture_url: z.string().optional().nullable(),
		role_name: z.string().optional().nullable(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Las contraseñas no coinciden.',
		path: ['confirmPassword'],
	});

export type RegisterData = z.infer<typeof RegisterSchema>;
