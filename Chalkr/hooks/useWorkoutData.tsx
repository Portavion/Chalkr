import { useState } from "react";

import { drizzle } from "drizzle-orm/expo-sqlite";
import {
  ascentsTable,
  boulderProblemsTable,
  workoutAscentTable,
  workoutsTable,
} from "@/db/schema";
import { openDatabaseSync } from "expo-sqlite";
import { eq, inArray, sum } from "drizzle-orm";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });

const useWorkoutData = () => {
  const [workoutId, setWorkoutId] = useState(0);
  const [lastAscentId, setLastAscentId] = useState<number>(0);

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

  const logProblem = async (
    id: number | undefined,
    grade: number,
    style: string,
    name: string = "",
    area: string = "",
    description: string = "",
    photoUri: string = "",
    isNew: boolean = false,
  ) => {
    if (isNew || !id) {
      try {
        const newProblem = await db
          .insert(boulderProblemsTable)
          .values({
            name: name,
            grade: grade,
            area: area,
            description: description,
            photo_url: photoUri,
            style: style,
          })
          .returning();
        return newProblem[0];
      } catch (error) {
        console.log("error logging new boulder: " + error);
      }
    } else {
      try {
        const updatedProblem = await db
          .update(boulderProblemsTable)
          .set({
            name: name,
            grade: grade,
            area: area,
            description: description,
            photo_url: photoUri,
            style: style,
          })
          .where(eq(boulderProblemsTable.id, id))
          .returning();
        return updatedProblem[0];
      } catch (error) {
        console.log("error updating problem: " + error);
      }
    }
  };

  const logAscent = async (
    boulderId: number,
    timer: number,
    grade: number,
    isSuccess: boolean,
    style: string,
    photoUri: string | undefined,
  ) => {
    //TODO: check if boulderId exists and if not create a new one
    //TODO: add a button to select an existing boulder
    //TODO: make a page or modal to list all boulder problems
    // const existingProblem = await retrieveProblem(boulderId);
    const problem = await logProblem(boulderId, grade, style, photoUri);
    if (!problem) {
      console.log("error processing problem");
      return;
    }
    try {
      const addedAscent = await db
        .insert(ascentsTable)
        .values({
          boulder_id: problem.id,
          ascentTime: timer,
          isSuccess: isSuccess,
        })
        .returning();

      await db.insert(workoutAscentTable).values({
        workout_id: workoutId,
        ascent_id: addedAscent[0].id,
      });
      setLastAscentId(addedAscent[0].id);
      return problem;
    } catch (error) {
      alert("Error logging ascent");
      console.log(error);
      return undefined;
    }
  };

  const updateAscentRestTime = async (restTime: number) => {
    await db
      .update(ascentsTable)
      .set({ restTime: restTime })
      .where(eq(ascentsTable.id, lastAscentId))
      .returning();
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
        //TODO: sum the total rest time and ascending time
        rest_time: Number(totalRestTime),
      })
      .where(eq(workoutsTable.id, workoutId));
  };

  const resetDb = async () => {
    await db.delete(workoutAscentTable);
    await db.delete(ascentsTable);
    await db.delete(boulderProblemsTable);
    await db.delete(workoutsTable);
  };

  return {
    workoutId,
    createNewWorkout,
    logAscent,
    updateAscentRestTime,
    updateWorkoutTimer,
    resetDb,
  };
};
export default useWorkoutData;
