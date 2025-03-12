import { Text, View, SafeAreaView, ScrollView } from "react-native";
import React, { useState } from "react";
import WorkoutCard from "@/components/WorkoutCard/WorkoutCard";
import useWorkout from "@/hooks/useWorkout";

export default function Index() {
  const [expandedWorkouts, setExpandedWorkouts] = useState<{
    [workoutId: number]: boolean;
  }>({});

  const { fetchWorkoutsList } = useWorkout();
  const workoutList = fetchWorkoutsList();

  const handlePress = (workoutId: number) => {
    setExpandedWorkouts({
      ...expandedWorkouts,
      [workoutId]: !expandedWorkouts[workoutId],
    });
  };

  if (!workoutList) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No workouts</Text>
      </View>
    );
  }

  return (
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
  );
}
