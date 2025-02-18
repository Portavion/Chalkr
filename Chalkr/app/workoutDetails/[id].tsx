import { useLocalSearchParams } from "expo-router";
import React from "react";
import { SafeAreaView, Text } from "react-native";

import AscentStats from "@/components/workoutStats/AscentStats";
import GradeDistribution from "@/components/workoutStats/GradeDistribution";
import StyleDistribution from "@/components/workoutStats/StyleDistribution";
import TimingStats from "@/components/workoutStats/TimingStats";
import DeleteWorkoutButton from "@/components/workoutStats/DeleteWorkoutButton";

const WorkoutDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const workoutId = id.length > 0 ? Number(id) : Number(id);

  return (
    <SafeAreaView className="flex flex-col content-center justify-around">
      <Text className="my-2 text-xl font-bold ml-5">Workout {workoutId}</Text>
      <TimingStats id={workoutId} />
      <AscentStats id={workoutId} />
      <GradeDistribution id={workoutId} />
      <StyleDistribution id={workoutId} />
      <DeleteWorkoutButton id={workoutId} />
    </SafeAreaView>
  );
};

export default WorkoutDetailsScreen;
