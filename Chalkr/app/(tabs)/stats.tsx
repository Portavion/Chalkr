import { View } from "react-native";
import React, { useCallback, useState } from "react";
import useWorkout from "@/hooks/useWorkout";
import { useFocusEffect } from "expo-router";
import BarChartAscentsPerWorkout from "@/components/Charts/BarChartAscentsPerWorkout/BarChartAscentsPerWorkout";
import useAscents from "@/hooks/useAscents";
import BarChartFlashRatePerGrade from "@/components/Charts/BarChartFlashRatePerGrade/BarChartFlashRatePerGrade";

export default function StatScreen() {
  const [workoutWithAscents, setWorkoutWithAscents] =
    useState<WorkoutWithAscents[]>();

  const [flashRateData, setFlashRateData] = useState<FlashRateData[]>();
  const { fetchAllWorkoutWithAscents } = useWorkout();
  const { fetchFlashStats } = useAscents();

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

      const fetchFlashRates = async () => {
        try {
          const flashRates = await fetchFlashStats();
          if (isActive) {
            setFlashRateData(flashRates);
          }
        } catch (error) {
          console.error("Error fetching workouts:", error);
        }
      };
      fetchWorkout();
      fetchFlashRates();

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
      <View className=" m-4 p-2 text-center items-center border rounded-xl bg-gray-50 ">
        <BarChartFlashRatePerGrade data={flashRateData} />
      </View>
    </View>
  );
}
