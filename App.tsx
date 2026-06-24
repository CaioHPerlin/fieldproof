import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SQLiteProvider } from "expo-sqlite";
import { AuthProvider, useAuth } from "./context/auth";
import { init } from "./database/database";
import { HomeScreen } from "./screens/HomeScreen";
import { InspectionScreen } from "./screens/InspectionScreen";
import { LoginScreen } from "./screens/LoginScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Inspection: { inspectionId: string };
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
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Inspection" component={InspectionScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
