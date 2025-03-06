import { Tabs } from "expo-router";
import { useUser } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { AuthProvider } from "@/context/AuthContext";
export default function TabLayout() {
  const { user, loading } = useUser();

  if (!user) {
    return (
      <AuthProvider>
        <Tabs>
          <Tabs.Screen name="index" options={{ title: "Home" }} />
          <Tabs.Screen
            name="workout"
            options={{ title: "Workout", href: null }}
          />
          <Tabs.Screen name="stats" options={{ title: "Stats", href: null }} />
          <Tabs.Screen
            name="settings"
            options={{ title: "Settings", href: null }}
          />
        </Tabs>
      </AuthProvider>
    );
  }
  return (
    <AuthProvider>
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
          name="stats"
          options={{
            title: "Stats",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "stats-chart-sharp" : "stats-chart-outline"}
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
    </AuthProvider>
  );
}
