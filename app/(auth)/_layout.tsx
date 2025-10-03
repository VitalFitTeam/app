// app/(auth)/_layout.tsx

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Crear Cuenta' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Recuperar Contraseña' }} />
      {/* Puedes agregar más pantallas aquí a medida que las crees */}
    </Stack>
  );
}