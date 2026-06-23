import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InspectionDetailScreen } from "./screens/InspectionDetailScreen";
import { InspectionListScreen } from "./screens/InspectionListScreen";
import { LoginScreen } from "./screens/LoginScreen";

export type RootStackParamList = {
  Login: undefined;
  InspectionList: undefined;
  InspectionDetail: { inspectionId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="InspectionList" component={InspectionListScreen} />
        <Stack.Screen name="InspectionDetail" component={InspectionDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
