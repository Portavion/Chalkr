import {
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import * as WebBrowser from "expo-web-browser";
import SignInScreen from "../screens/SignInScreen";

import { drizzle } from "drizzle-orm/expo-sqlite";
import { workoutsTable } from "../../db/schema";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../..//drizzle/migrations";
const expo = SQLite.openDatabaseSync("db.db");
const db = drizzle(expo);
import { useAuth } from "@/context/AuthContext";
import * as SQLite from "expo-sqlite";
import WorkoutCard from "@/components/WorkoutCard/WorkoutCard";

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [workoutList, setWorkoutList] = useState<
    ClimbingWorkout[] | undefined
  >();
  const { success, error } = useMigrations(db, migrations);
  const [expandedWorkouts, setExpandedWorkouts] = useState<{
    [workoutId: number]: boolean;
  }>({});

  const handlePress = (workoutId: number) => {
    setExpandedWorkouts({
      ...expandedWorkouts,
      [workoutId]: !expandedWorkouts[workoutId],
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      //TODO: add fetchWorkout hook to useWorkoutData
      const fetchWorkout = async () => {
        const fetchedWorkouts = (await db
          .select()
          .from(workoutsTable)) as ClimbingWorkout[];
        if (isActive) {
          setWorkoutList(fetchedWorkouts);
        }
      };
      fetchWorkout();
      return () => {
        isActive = false;
      };
    }, []),
  );

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (user && workoutList?.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No workouts</Text>
      </View>
    );
  }

  return user ? (
    <SafeAreaView className="flex-1">
      <ScrollView className="py-5 bg-stone-300">
        {workoutList &&
          workoutList.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              isExpanded={expandedWorkouts[workout.id] || false}
              handlePress={handlePress}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  ) : (
    <SignInScreen promptAsync={signInWithGoogle} />
  );
}
