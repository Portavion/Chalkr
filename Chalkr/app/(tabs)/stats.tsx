import { View } from "react-native";
import React, { useCallback, useState } from "react";
import useWorkout from "@/hooks/useWorkout";
import { useFocusEffect } from "expo-router";
import BarChartAscentsPerWorkout from "@/components/Charts/BarChartAscentsPerWorkout/BarChartAscentsPerWorkout";

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
      <View className=" m-4 p-2 text-center items-center border rounded-xl bg-gray-50 ">
        <BarChartAscentsPerWorkout workoutsWithAscents={workoutWithAscents} />
      </View>
    </View>
  );
}
