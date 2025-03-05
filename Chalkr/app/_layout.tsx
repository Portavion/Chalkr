import { Stack } from "expo-router";
import "../global.css";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "#d6d3d1" },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            title: "Home",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="workoutDetails/[id]"
          options={{ title: "Workout Details" }}
        />
        <Stack.Screen
          name="routeView/routes"
          options={{ title: "All Routes" }}
        />
      </Stack>
    </UserProvider>
  );
}
