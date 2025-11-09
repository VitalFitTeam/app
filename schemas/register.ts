import { z } from 'zod';

export const Step1Schema = z.object({
	gender: z.enum(['female', 'male', 'prefer-not-to-say'], {
		errorMap: () => ({ message: 'Por favor, selecciona un género.' }),
	}),
});

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

export const RegisterSchema = z
	.object({
		gender: z.enum(['female', 'male', 'prefer-not-to-say'], {
			errorMap: () => ({ message: 'Por favor, selecciona un género.' }),
		}),
		email: z.string().email('El correo electrónico no tiene un formato válido.'),
		password: z
			.string()
			.min(8, 'La contraseña debe tener al menos 8 caracteres.')
			.regex(/[A-Z]/, 'Debe contener al menos una mayúscula.')
			.regex(/[a-z]/, 'Debe contener al menos una minúscula.')
			.regex(/[0-9]/, 'Debe contener al menos un número.')
			.regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un caracter especial.'),
		confirmPassword: z.string(),
		name: z
			.string()
			.min(1, 'El nombre es requerido.')
			.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El nombre solo puede contener letras.'),
		lastName: z
			.string()
			.min(1, 'El apellido es requerido.')
			.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El apellido solo puede contener letras.'),
		documentId: z
			.string()
			.min(6, 'El documento debe tener al menos 6 dígitos.')
			.regex(/^[0-9]+$/, 'El documento solo puede contener números.'),
		birthDate: z
			.string()
			.min(1, 'La fecha de nacimiento es requerida.')
			.refine(
				(date) => {
					const birthDate = new Date(date);
					const today = new Date();
					let age = today.getFullYear() - birthDate.getFullYear();
					const m = today.getMonth() - birthDate.getMonth();
					if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
						age--;
					}
					return age >= 18;
				},
				{ message: 'Debes ser mayor de 18 años.' },
			),
		phone: z
			.string()
			.optional()
			.nullable()
			.refine(
				(phone) => {
					if (!phone) return true; // Permite que el campo esté vacío
					const numericPhone = phone.replace(/\D/g, ''); // Elimina todo lo que no sea dígito
					return numericPhone.length >= 10 && numericPhone.length <= 15;
				},
				{ message: 'El número de teléfono debe tener entre 10 y 15 dígitos.' },
			),
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
