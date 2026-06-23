import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../App";
import { useAuth } from "../context/auth";

type Props = NativeStackScreenProps<RootStackParamList, "InspectionList">;

export function InspectionListScreen({ navigation }: Props) {
  const { logout } = useAuth();

  return (
    <View>
      <Text>Tela de Lista de Inspeção</Text>

      <TouchableOpacity onPress={logout}>
        <Text>Sair</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("InspectionDetail", { inspectionId: "1" })}
      >
        <Text>Detalhes da Inspeção 1</Text>
      </TouchableOpacity>
    </View>
  );
}
