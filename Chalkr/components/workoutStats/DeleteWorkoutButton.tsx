import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { drizzle } from "drizzle-orm/expo-sqlite";
import {
  ascentsTable,
  workoutAscentTable,
  workoutsTable,
} from "../../db/schema";
import { openDatabaseSync } from "expo-sqlite";
import { eq } from "drizzle-orm";

const expo = openDatabaseSync("db.db");
const db = drizzle(expo);
export default function workoutStats({ id }: { id: number }) {
  const workoutId = id;
  const handleDeleteWorkout = async (id: number) => {
    const deletedWorkout = await db
      .delete(workoutsTable)
      .where(eq(workoutsTable.id, id))
      .returning();

    const deletedAscentsWorkoutMatch = await db
      .delete(workoutAscentTable)
      .where(eq(workoutAscentTable.workout_id, deletedWorkout[0].id))
      .returning();

    for (let ascent of deletedAscentsWorkoutMatch) {
      if (ascent.ascent_id) {
        await db
          .delete(ascentsTable)
          .where(eq(ascentsTable.id, ascent.ascent_id));
      }
    }
    router.back();
  };

  return (
    <>
      <View className="mt-32">
        <TouchableOpacity
          id={String(workoutId)}
          onPress={() => {
            handleDeleteWorkout(workoutId);
          }}
          className="flex items-center mx-44 rounded-md border border-input bg-red-800 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        >
          <Text className="text-white">Delete workout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
