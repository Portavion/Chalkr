import { Tabs } from "expo-router";
import { useUser } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";

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
        tabBarActiveTintColor: "#ffa000",
        tabBarInactiveTintColor: "grey", // Inactive tab color
        tabBarInactiveBackgroundColor: "#ffecb3",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "Workout",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "barbell-sharp" : "barbell-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings-sharp" : "settings-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
