// app/workoutDetails/[id]/graphs.tsx
import { View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { WorkoutContext } from "./_layout";
import useWorkout from "@/hooks/useWorkout";
import useAscents from "@/hooks/useAscents";
import BarChart from "@/components/workoutCharts/BarChart";
import RestPieChart from "@/components/workoutCharts/PieChart";

export default function GraphsScreen() {
  const id = useContext(WorkoutContext);
  const workoutId = Number(id);
  const [ascents, setAscents] = useState<Ascent[]>();
  const [workout, setWorkout] = useState<ClimbingWorkout | undefined>();
  const { fetchWorkout } = useWorkout();
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
        const workout = (await fetchWorkout(workoutId)) as ClimbingWorkout[];
        if (!workout) {
          console.log("error loading workout");
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
