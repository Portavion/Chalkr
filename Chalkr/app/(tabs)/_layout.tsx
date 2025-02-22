import { Tabs } from "expo-router";
import { useUser } from "../context/UserContext";

export default function TabLayout() {
  const { user, loading } = useUser();

  if (!user) {
    return (
      <Tabs>
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen
          name="workout"
          options={{ title: "Workout", href: null }}
        />
        <Tabs.Screen
          name="settings"
          options={{ title: "Settings", href: null }}
        />
      </Tabs>
    );
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#e17100",
        tabBarInactiveTintColor: "grey", // Inactive tab color
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="workout" options={{ title: "Workout" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
