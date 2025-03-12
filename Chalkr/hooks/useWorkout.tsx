import { useCallback, useState } from "react";

import { drizzle } from "drizzle-orm/expo-sqlite";
import {
  ascentsTable,
  routesTable,
  workoutAscentTable,
  workoutsTable,
} from "@/db/schema";
import { openDatabaseSync } from "expo-sqlite";
import { count, eq, inArray, sql, sum } from "drizzle-orm";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
cssInterop(Image, { className: "style" });

const useWorkout = () => {
  const createNewWorkout = async () => {
    try {
      const newWorkout = await db
        .insert(workoutsTable)
        .values([{}])
        .returning();
      return newWorkout[0].id;
    } catch (error) {
      alert("Couldn't create workout");
      console.log(error);
    }
  };

  const updateWorkoutTimer = async (workoutId: number) => {
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

  const fetchUniqueWorkout = async (workoutId: number) => {
    try {
      const workout = await db
        .select()
        .from(workoutsTable)
        .where(eq(workoutsTable.id, workoutId));
      return workout as ClimbingWorkout[];
    } catch (error) {
      console.log("Error fetching workout: " + error);
    }
  };

  const fetchWorkoutsList = () => {
    const [workoutList, setWorkoutList] = useState<
      ClimbingWorkout[] | undefined
    >();

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

  const fetchWorkoutStyleDistribution = async (workoutId: number) => {
    const styleDistributionData = await db
      .select({
        style: routesTable.style,
        ascentCount: count(),
        successfulAttempts: count(
          sql`CASE WHEN ${ascentsTable.isSuccess} = 1 THEN 1 END`,
        ),
      })
      .from(ascentsTable)
      .innerJoin(
        workoutAscentTable,
        eq(ascentsTable.id, workoutAscentTable.ascent_id),
      )
      .innerJoin(routesTable, eq(ascentsTable.route_id, routesTable.id))
      .where(eq(workoutAscentTable.workout_id, workoutId))
      .groupBy(routesTable.style);

    return styleDistributionData;
  };

  const fetchWorkoutGradeDistribution = async (workoutId: number) => {
    const gradeDistributionData = await db
      .select({
        grade: routesTable.grade,
        ascentCount: count(),
        successfulAttempts: count(
          sql`CASE WHEN ${ascentsTable.isSuccess} = 1 THEN 1 END`,
        ),
      })
      .from(ascentsTable)
      .innerJoin(
        workoutAscentTable,
        eq(ascentsTable.id, workoutAscentTable.ascent_id),
      )
      .innerJoin(routesTable, eq(ascentsTable.route_id, routesTable.id))
      .where(eq(workoutAscentTable.workout_id, workoutId))
      .groupBy(routesTable.grade);

    return gradeDistributionData;
  };

  const fetchAllWorkoutWithAscents = async () => {
    const workoutsWithAscents = await db
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
      .leftJoin(ascentsTable, eq(workoutAscentTable.ascent_id, ascentsTable.id))
      .groupBy(workoutsTable.id, workoutsTable.date, workoutsTable.timestamp)
      .orderBy(workoutsTable.date);
    return workoutsWithAscents;
  };

  return {
    deleteWorkout,
    createNewWorkout,
    fetchUniqueWorkout,
    fetchAllWorkoutWithAscents,
    fetchWorkoutsList,
    updateWorkoutTimer,
    resetDb,
    fetchWorkoutStyleDistribution,
    fetchWorkoutGradeDistribution,
  };
};
export default useWorkout;
