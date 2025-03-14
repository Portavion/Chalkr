import { Tabs } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { View, Text, ActivityIndicator } from "react-native";
import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../../drizzle/migrations";
import SignInScreen from "../screens/SignInScreen";
import {
  IndexTabIcon,
  WorkoutTabIcon,
  StatsTabIcon,
  SettingsTabIcon,
} from "@/components/TabIcons/TabIcons";

export default function TabLayout() {
  const { user, loading, signInWithGoogle } = useAuth();
  const expo = SQLite.openDatabaseSync("db.db");
  const db = drizzle(expo);
  const { success, error } = useMigrations(db, migrations);

  if (!success || error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Migration is in progress...</Text>
        <ActivityIndicator testID="activity-indicator" size={"large"} />
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator testID="activity-indicator" size={"large"} />
      </View>
    );
  }

  if (!user) {
    return <SignInScreen promptAsync={signInWithGoogle} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffa000",
        tabBarInactiveTintColor: "grey",
        tabBarInactiveBackgroundColor: "#ffecb3",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: IndexTabIcon,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "Workout",
          tabBarIcon: WorkoutTabIcon,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: StatsTabIcon,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: SettingsTabIcon,
        }}
      />
    </Tabs>
  );
}
