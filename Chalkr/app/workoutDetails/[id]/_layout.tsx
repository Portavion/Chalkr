// app/workoutDetails/[id]/_layout.tsx
import { FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useLocalSearchParams } from "expo-router";

export default function WorkoutDetailsTabs() {
  const { id } = useLocalSearchParams();

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
          title: "Details",
          href: `/workoutDetails/${id}`,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "list-sharp" : "list-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="graphs"
        options={{
          title: "Graphs",
          href: `/workoutDetails/${id}/graphs`,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "bar-chart-sharp" : "bar-chart-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          title: "Routes",
          href: `/workoutDetails/${id}/lists`,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "images" : "image-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
