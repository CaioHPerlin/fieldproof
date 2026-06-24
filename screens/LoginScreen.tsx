import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/auth";
import { colors, radius, spacing } from "../theme";

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
    backgroundColor: colors.background,
  },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: spacing.lg, color: colors.text.primary },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  buttonText: { color: colors.text.white, fontSize: 16, fontWeight: "600" },
});
