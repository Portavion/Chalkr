import { useState } from "react";

import { drizzle } from "drizzle-orm/expo-sqlite";
import {
  ascentsTable,
  routesTable,
  workoutAscentTable,
  workoutsTable,
  routesHoldTypesTable,
} from "@/db/schema";
import { openDatabaseSync } from "expo-sqlite";
import { eq, inArray, sum, ne, and } from "drizzle-orm";
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

  const logRoute = async (
    id: number | undefined,
    grade: number,
    style: string,
    name: string = "",
    area: string = "",
    description: string = "",
    holdTypes: HoldType[],
    fullImageUri: null | string = null,
    thumbnailUri: null | string = null,
    color: string = "",
    isNew: boolean = false,
  ) => {
    try {
      if (id) {
        await db
          .delete(routesHoldTypesTable)
          .where(eq(routesHoldTypesTable.route_id, id));
        for (let hold of holdTypes) {
          await db
            .insert(routesHoldTypesTable)
            .values({ route_id: id, hold_type: hold })
            .returning();
        }
      }
    } catch (error) {
      console.log("Error setting up hold types: " + error);
    }

    if (isNew || !id) {
      try {
        const newRoute = await db
          .insert(routesTable)
          .values({
            name: name,
            grade: grade,
            area: area,
            description: description,
            photo_url: fullImageUri,
            thumbnail_url: thumbnailUri,
            style: style,
            color: color,
          })
          .returning();
        return newRoute[0];
      } catch (error) {
        console.log("error logging new route: " + error);
      }
    } else {
      try {
        const updatedRoute = await db
          .update(routesTable)
          .set({
            name: name,
            grade: grade,
            area: area,
            description: description,
            photo_url: fullImageUri,
            thumbnail_url: thumbnailUri,
            style: style,
            color: color,
          })
          .where(eq(routesTable.id, id))
          .returning();
        return updatedRoute[0];
      } catch (error) {
        console.log("error updating route: " + error);
      }
    }
  };

  const logAscent = async (
    routeId: number,
    timer: number,
    grade: number,
    isSuccess: boolean,
    style: string,
    holdTypes: HoldType[],
    color: string = "",
    photoUri: string | null = null,
    thumbnailUri: string | null = null,
  ) => {
    const route = await logRoute(
      routeId,
      grade,
      style,
      "",
      "",
      "",
      holdTypes,
      photoUri,
      thumbnailUri,
      color,
    );
    if (!route) {
      console.log("error processing route");
      return;
    }
    try {
      const addedAscent = await db
        .insert(ascentsTable)
        .values({
          route_id: route.id,
          ascentTime: timer,
          isSuccess: isSuccess,
        })
        .returning();

      await db.insert(workoutAscentTable).values({
        workout_id: workoutId,
        ascent_id: addedAscent[0].id,
      });
      setLastAscentId(addedAscent[0].id);
      return route;
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

  const deleteRoute = async (id: number) => {
    try {
      await db
        .update(routesTable)
        .set({
          name: "hidden",
        })
        .where(eq(routesTable.id, id))
        .returning();
    } catch (error) {
      alert("Error hidding ascent");
      console.log(error);
    }
  };

  const fetchAllRoutes = async () => {
    try {
      const routes = await db
        .select()
        .from(routesTable)
        .where(ne(routesTable.name, "hidden"));

      const routesWithHoldtypes = await Promise.all(
        routes.map(async (route) => {
          const holdTypes = await db
            .select({ hold_type: routesHoldTypesTable.hold_type })
            .from(routesHoldTypesTable)
            .where(eq(routesHoldTypesTable.route_id, route.id));

          const holdTypeNames = holdTypes
            .map((ht) => ht.hold_type)
            .filter((ht) => ht !== null) as string[];
          return {
            ...route,
            hold_types: holdTypeNames,
          };
        }),
      );

      return routesWithHoldtypes;
    } catch (error) {
      console.log("error fetching routes: " + error);
      return;
    }
  };

  const fetchWorkoutRoutes = async (workoutId: number) => {
    try {
      const routeIds = await db
        .selectDistinct({ route_id: routesTable.id })
        .from(routesTable)
        .innerJoin(ascentsTable, eq(routesTable.id, ascentsTable.route_id))
        .innerJoin(
          workoutAscentTable,
          eq(ascentsTable.id, workoutAscentTable.ascent_id),
        )
        .innerJoin(
          workoutsTable,
          eq(workoutAscentTable.workout_id, workoutsTable.id),
        )
        .where(eq(workoutsTable.id, workoutId));

      const routes = await Promise.all(
        routeIds.map(async (routeId) => {
          const route = await db
            .select()
            .from(routesTable)
            .where(eq(routesTable.id, routeId.route_id))
            .then((rows) => rows[0]);

          if (!route) {
            return null;
          }

          const holdTypes = await db
            .select({ hold_type: routesHoldTypesTable.hold_type })
            .from(routesHoldTypesTable)
            .where(eq(routesHoldTypesTable.route_id, route.id));

          const holdTypeNames = holdTypes
            .map((ht) => ht.hold_type)
            .filter((ht) => ht !== null) as string[];

          return {
            ...route,
            hold_types: holdTypeNames,
          };
        }),
      );

      return routes.filter((route) => route !== null);
    } catch (error) {
      console.log("error fetching routes: " + error);
      return;
    }
    // try {
    //   const routes = await db
    //     .selectDistinct(routesTable.id)
    //     .from(routesTable)
    //     .innerJoin(ascentsTable, eq(routesTable.id, ascentsTable.route_id))
    //     .innerJoin(
    //       workoutAscentTable,
    //       eq(ascentsTable.id, workoutAscentTable.ascent_id),
    //     )
    //     .innerJoin(
    //       workoutsTable,
    //       eq(workoutAscentTable.workout_id, workoutsTable.id),
    //     )
    //     .where(
    //       and(eq(workoutsTable.id, workoutId), ne(routesTable.name, "hidden")),
    //     )
    //     .then((rows) => rows.map((row) => row.routes_table));
    //
    //   console.log(routes);
    //
    //   const routesWithHoldtypes = await Promise.all(
    //     routes.map(async (route) => {
    //       const holdTypes = await db
    //         .select({ hold_type: routesHoldTypesTable.hold_type })
    //         .from(routesHoldTypesTable)
    //         .where(eq(routesHoldTypesTable.route_id, route.id));
    //
    //       const holdTypeNames = holdTypes
    //         .map((ht) => ht.hold_type)
    //         .filter((ht) => ht !== null) as string[];
    //
    //       return {
    //         ...route,
    //         hold_types: holdTypeNames,
    //       };
    //     }),
    //   );
    //
    //   return routesWithHoldtypes;
    // } catch (error) {
    //   console.log("error fetching routes: " + error);
    //   return;
    // }
  };

  return {
    workoutId,
    createNewWorkout,
    logAscent,
    updateAscentRestTime,
    updateWorkoutTimer,
    resetDb,
    deleteRoute,
    fetchRoutes: fetchAllRoutes,
    fetchWorkoutRoutes,
    logRoute,
  };
};
export default useWorkoutData;
