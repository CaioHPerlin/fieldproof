import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/auth";

export function LoginScreen() {
  const { authenticate } = useAuth();

  async function handleLogin(): Promise<void> {
    const ok = await authenticate();
    if (!ok) {
      Alert.alert("Falha na autenticação", "Não foi possível autenticar seu dispositivo.");
      return;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FieldProof</Text>
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Acessar com Biometria</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 24, color: "#333" },
  button: {
    backgroundColor: "#007bff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
