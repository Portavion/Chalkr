import { Stack } from "expo-router";
import "../global.css";
import { UserProvider } from "./context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ title: "Signup" }} />
      </Stack>
    </UserProvider>
  );
}
