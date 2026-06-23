import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./context/auth";
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
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

function InnerApp() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="InspectionList" component={InspectionListScreen} />
            <Stack.Screen name="InspectionDetail" component={InspectionDetailScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
