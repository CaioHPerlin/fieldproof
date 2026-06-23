import { Alert, Text, TouchableOpacity, View } from "react-native";
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
    <View>
      <Text>Tela de Login</Text>

      <TouchableOpacity onPress={handleLogin}>
        <Text>Lista de Inspeção</Text>
      </TouchableOpacity>
    </View>
  );
}
