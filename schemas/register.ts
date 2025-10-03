// schemas/register.ts
import { z } from 'zod';

export const RegisterSchema = z.object({
  gender: z.enum(['Mujer', 'Hombre', 'Otro'], {
    errorMap: () => ({ message: 'Por favor, selecciona un género.' }),
  }),
  email: z.string().email('El correo no es válido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
  confirmPassword: z.string(),
  name: z.string().min(1, 'El nombre es requerido.'),
  lastName: z.string().min(1, 'El apellido es requerido.'),
  documentId: z.string().min(1, 'El documento es requerido.'),
  birthDate: z.string().min(1, 'La fecha de nacimiento es requerida.'),
  phone: z.string().min(1, 'El teléfono es requerido.'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden.',
  path: ['confirmPassword'],
});


export type RegisterData = z.infer<typeof RegisterSchema>;