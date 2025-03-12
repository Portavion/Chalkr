// app/workoutDetails/[id]/graphs.tsx
import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import useWorkout from "@/hooks/useWorkout";
import useAscents from "@/hooks/useAscents";
import BarChart from "@/components/workoutCharts/BarChart";
import RestPieChart from "@/components/workoutCharts/PieChart";
import { useLocalSearchParams } from "expo-router";

export default function GraphsScreen() {
  const { id } = useLocalSearchParams();
  const workoutId = Number(id);
  const [ascents, setAscents] = useState<Ascent[]>();
  const [workout, setWorkout] = useState<ClimbingWorkout | undefined>();
  const { fetchUniqueWorkout } = useWorkout();
  const { fetchAscentsWithGrade } = useAscents();

  useEffect(() => {
    const loadAscents = async () => {
      try {
        const ascents = await fetchAscentsWithGrade(workoutId);
        if (!ascents) {
          console.log("error loading problems");
          return;
        }
        setAscents(ascents);
      } catch (error) {
        console.log("error loading routes: " + error);
      }
    };

    const loadWorkout = async () => {
      try {
        const workout = (await fetchUniqueWorkout(
          workoutId,
        )) as ClimbingWorkout[];
        if (!workout) {
          alert("error loading workout");
          return;
        }
        setWorkout(workout[0]);
      } catch (error) {
        console.log("error loading routes: " + error);
      }
    };

    loadAscents();
    loadWorkout();
  }, []);

  return (
    <View>
      <View className="mt-2 text-center">
        <Text className="text-xl font-semibold">Grade Progression</Text>
        {ascents && <BarChart ascents={ascents}></BarChart>}
      </View>
      <View className="mt-6 mb-2 text-center">
        <View>
          <Text className="text-xl font-semibold">
            Climbing vs Resting Time
          </Text>
        </View>
        <View className="">
          {workout && <RestPieChart workout={workout}></RestPieChart>}
        </View>
      </View>
    </View>
  );
}
