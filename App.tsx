import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SQLiteProvider } from "expo-sqlite";
import { AuthProvider, useAuth } from "./context/auth";
import { init } from "./database/database";
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
    <SQLiteProvider databaseName="app.db" onInit={init}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </SQLiteProvider>
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
