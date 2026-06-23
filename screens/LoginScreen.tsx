import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  return (
    <View>
      <Text>Tela de Login</Text>

      <TouchableOpacity onPress={() => navigation.navigate("InspectionList")}>
        <Text>Lista de Inspeção</Text>
      </TouchableOpacity>
    </View>
  );
}
