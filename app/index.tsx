// app/index.tsx

import { Redirect } from 'expo-router';

export default function StartPage() {
  // Aquí tendrías la lógica para verificar si el usuario está autenticado.
  // Por ahora, simularemos que no lo está.
  const isAuthenticated = false; // Cambia a `true` para probar el flujo de usuario logueado

  if (isAuthenticated) {
    // Si está autenticado, lo enviamos al dashboard
    return <Redirect href="/(tabs)" />;
  } else {
    // Si no, lo enviamos a la pantalla de login
    return <Redirect href="/(auth)/login" />;
  }
}