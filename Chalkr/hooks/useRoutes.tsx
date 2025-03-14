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
import { eq, ne } from "drizzle-orm";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

import { cssInterop } from "nativewind";
import { Image } from "expo-image";
cssInterop(Image, { className: "style" });

const useRoutes = () => {
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

      return routesWithHoldtypes as Route[];
    } catch (error) {
      console.log("error fetching routes: " + error);
      return;
    }
  };

  const fetchWorkoutRoutes = async (workoutId: number) => {
    try {
      const routeIds = await db
        .select({ route_id: routesTable.id })
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
  };

  const fetchUniqueWorkoutRoutes = async (workoutId: number) => {
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
  };

  return {
    deleteRoute,
    fetchAllRoutes,
    fetchUniqueWorkoutRoutes,
    fetchWorkoutRoutes,
    logRoute,
  };
};
export default useRoutes;
