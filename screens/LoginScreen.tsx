import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as LocalAuthentication from "expo-local-authentication";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  async function authenticate() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Autentique-se apara acessar o FieldProof",
      cancelLabel: "Cancelar",
      disableDeviceFallback: true, // Desabilitando fallback para senha/pin, apenas biometria
    });

    return result.success;
  }

  async function handleLogin(): Promise<void> {
    const ok = await authenticate();
    if (!ok) {
      Alert.alert("Falha na autenticação", "Não foi possível autenticar seu dispositivo.");
      return;
    }
    navigation.replace("InspectionList");
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
