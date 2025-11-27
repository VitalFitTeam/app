import { ThemedView } from '@/components/themed-view';
import { StyleSheet, Text } from 'react-native';

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      {/* Aquí irá el contenido del perfil */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
