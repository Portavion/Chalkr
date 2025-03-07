import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import useWorkoutData from "@/hooks/useWorkoutData";

export default function workoutStats({ id }: { id: number }) {
  //TODO: change to useWorkoutData hook
  const workoutId = id;
  const { deleteWorkout } = useWorkoutData();

  const handleDeleteWorkout = async (id: number) => {
    deleteWorkout(id);
    router.back();
  };

  return (
    <>
      <View className="mt-32 absolute -top-28 -right-40">
        <TouchableOpacity
          id={String(workoutId)}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            handleDeleteWorkout(workoutId);
          }}
          className="flex items-center mx-44 rounded-md border border-input bg-red-800 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        >
          <Text className="text-white">Delete</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
