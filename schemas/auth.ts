import { z } from 'zod';

// Definimos el esquema de validación para el login
export const LoginSchema = z.object({
	email: z.string().email({ message: 'Por favor, introduce un correo válido.' }),
	password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

// También puedes inferir el tipo de TypeScript directamente del esquema
export type LoginData = z.infer<typeof LoginSchema>;
