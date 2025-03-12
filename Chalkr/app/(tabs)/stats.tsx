import { View, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import GradeClimbedOverTime from "@/components/Charts/GradeClimnedOverTime/GradeClimbedOverTime";
import useWorkout from "@/hooks/useWorkout";
import { useFocusEffect } from "expo-router";

export default function StatScreen() {
  const [workoutWithAscents, setWorkoutWithAscents] =
    useState<WorkoutWithAscents[]>();

  const { fetchAllWorkoutWithAscents } = useWorkout();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchWorkout = async () => {
        try {
          const workoutAscents = await fetchAllWorkoutWithAscents();
          if (isActive) {
            setWorkoutWithAscents(workoutAscents);
          }
        } catch (error) {
          console.error("Error fetching workouts:", error);
        }
      };

      fetchWorkout();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <View className="flex-1">
      <View className="mt-2 text-center items-center">
        <Text className="text-xl font-semibold">Climbing Stats</Text>
        <GradeClimbedOverTime data={workoutWithAscents} />
      </View>
    </View>
  );
}
