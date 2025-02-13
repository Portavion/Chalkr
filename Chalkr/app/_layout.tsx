import { Stack } from "expo-router";
import "../global.css";
import { UserProvider } from "./context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ title: "Home", headerShown: false }}
        />
        <Stack.Screen
          name="workoutDetails/[id]"
          options={{ title: "Workout Details" }}
        />
      </Stack>
    </UserProvider>
  );
}
