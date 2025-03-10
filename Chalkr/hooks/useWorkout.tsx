import { useCallback, useState } from "react";

import { drizzle } from "drizzle-orm/expo-sqlite";
import {
  ascentsTable,
  routesTable,
  workoutAscentTable,
  workoutsTable,
} from "@/db/schema";
import { openDatabaseSync } from "expo-sqlite";
import { eq, inArray, sum } from "drizzle-orm";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
cssInterop(Image, { className: "style" });

const useWorkout = () => {
  const [workoutId, setWorkoutId] = useState(0);

  const createNewWorkout = async () => {
    try {
      const newWorkout = await db
        .insert(workoutsTable)
        .values([{}])
        .returning();
      setWorkoutId(newWorkout[0].id);
      return newWorkout[0].id;
    } catch (error) {
      alert("Couldn't create workout");
      console.log(error);
    }
  };

  const updateWorkoutTimer = async () => {
    const workoutAscents = await db
      .selectDistinct({ id: workoutAscentTable.ascent_id })
      .from(workoutAscentTable)
      .where(eq(workoutAscentTable.workout_id, workoutId));

    const workoutAscentIds = workoutAscents
      .map((ascent) => ascent?.id)
      .filter((id): id is number => id !== null && id !== undefined);

    const sumClimbTime = await db
      .select({
        total: sum(ascentsTable.ascentTime),
      })
      .from(ascentsTable)
      .where(inArray(ascentsTable.id, workoutAscentIds));

    const sumRestTime = await db
      .select({
        total: sum(ascentsTable.restTime),
      })
      .from(ascentsTable)
      .where(inArray(ascentsTable.id, workoutAscentIds));

    const totalClimbTime = sumClimbTime[0]?.total || 0;
    const totalRestTime = sumRestTime[0]?.total || 0;

    await db
      .update(workoutsTable)
      .set({
        climb_time: Number(totalClimbTime),
        rest_time: Number(totalRestTime),
      })
      .where(eq(workoutsTable.id, workoutId));
  };

  const resetDb = async () => {
    await db.delete(workoutAscentTable);
    await db.delete(ascentsTable);
    await db.delete(routesTable);
    await db.delete(workoutsTable);
  };

  const fetchWorkout = async (workoutId: number) => {
    try {
      const workout = await db
        .select()
        .from(workoutsTable)
        .where(eq(workoutsTable.id, workoutId));
      return workout;
    } catch (error) {
      console.log("Error fetching workout: " + error);
    }
  };

  const fetchWorkoutsList = () => {
    const [workoutList, setWorkoutList] = useState<
      ClimbingWorkout[] | undefined
    >();

    // useFocusEffect necessary to re-render list once a new workout is logged / being logged
    useFocusEffect(
      useCallback(() => {
        let isActive = true;

        const fetchWorkout = async () => {
          try {
            const fetchedWorkouts = (await db
              .select()
              .from(workoutsTable)) as ClimbingWorkout[];

            if (isActive) {
              setWorkoutList(fetchedWorkouts);
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

    return workoutList;
  };

  const deleteWorkout = async (id: number) => {
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
  };

  return {
    workoutId,
    deleteWorkout,
    createNewWorkout,
    fetchWorkout,
    fetchWorkoutsList,
    updateWorkoutTimer,
    resetDb,
  };
};
export default useWorkout;
