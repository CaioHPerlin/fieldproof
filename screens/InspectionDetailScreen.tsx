import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "InspectionDetail">;

export function InspectionDetailScreen({ route }: Props) {
  const { inspectionId } = route.params;

  return (
    <View>
      <Text>Tela de Detalhes da Inspeção {inspectionId}</Text>
    </View>
  );
}
