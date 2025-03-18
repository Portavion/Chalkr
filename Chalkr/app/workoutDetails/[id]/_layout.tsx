// app/workoutDetails/[id]/_layout.tsx
import {
  WorkoutListTabIcon,
  GraphsTabIcon,
  ListsTabIcon,
} from "@/components/TabIcons/TabIcons";
import { Tabs, useLocalSearchParams } from "expo-router";
import React from "react";

export default function WorkoutDetailsTabs() {
  const { id } = useLocalSearchParams();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffa000",
        tabBarInactiveTintColor: "grey",
        tabBarInactiveBackgroundColor: "#ffecb3",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Details",
          href: `/workoutDetails/${id}`,
          tabBarIcon: WorkoutListTabIcon,
        }}
      />
      <Tabs.Screen
        name="graphs"
        options={{
          title: "Graphs",
          href: `/workoutDetails/${id}/graphs`,
          tabBarIcon: GraphsTabIcon,
        }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          title: "Routes",
          href: `/workoutDetails/${id}/lists`,
          tabBarIcon: ListsTabIcon,
        }}
      />
    </Tabs>
  );
}
