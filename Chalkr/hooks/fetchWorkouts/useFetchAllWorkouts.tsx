import { useCallback, useState } from "react";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { ascentsTable, workoutAscentTable, workoutsTable } from "@/db/schema";
import { openDatabaseSync } from "expo-sqlite";
import { count, eq, sql, isNotNull } from "drizzle-orm";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

import { useFocusEffect } from "expo-router";

const useFetchAllWorkouts = () => {
  const [workoutWithAscents, setWorkoutWithAscents] =
    useState<WorkoutWithAscents[]>();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchWorkout = async () => {
        let fetchedWorkoutsWithAscents: WorkoutWithAscents[];
        try {
          fetchedWorkoutsWithAscents = (await db
            .select({
              workoutId: workoutsTable.id,
              date: workoutsTable.date,
              timestamp: workoutsTable.timestamp,
              totalClimbs: count(ascentsTable.id),
              successfulClimbs: sql<number>`CAST(SUM(CASE WHEN ${ascentsTable.isSuccess} = 1 THEN 1 ELSE 0 END) AS INTEGER)`,
              failedClimbs: sql<number>`CAST(SUM(CASE WHEN ${ascentsTable.isSuccess} = 0 THEN 1 ELSE 0 END) AS INTEGER)`,
            })
            .from(workoutsTable)
            .leftJoin(
              workoutAscentTable,
              eq(workoutsTable.id, workoutAscentTable.workout_id),
            )
            .leftJoin(
              ascentsTable,
              eq(workoutAscentTable.ascent_id, ascentsTable.id),
            )
            .where(isNotNull(workoutsTable.date))
            .groupBy(
              workoutsTable.id,
              workoutsTable.date,
              workoutsTable.timestamp,
            )
            .orderBy(workoutsTable.date)) as WorkoutWithAscents[];

          if (isActive) {
            setWorkoutWithAscents(fetchedWorkoutsWithAscents);
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

  return { workoutWithAscents };
};
export default useFetchAllWorkouts;
