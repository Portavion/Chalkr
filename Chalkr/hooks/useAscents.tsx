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
import { eq, inArray, and, count, min, sql } from "drizzle-orm";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import useRoutes from "./useRoutes";
cssInterop(Image, { className: "style" });

const useAscents = () => {
  const [lastAscentId, setLastAscentId] = useState<number>(0);
  const { logRoute } = useRoutes();

  const logAscent = async (
    workoutId: number,
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

  const fetchAscentsWithGrade = async (workoutId: number) => {
    try {
      const ascentsWithGrade = await db
        .select({
          ascentId: ascentsTable.id,
          routeId: ascentsTable.route_id,
          ascentTime: ascentsTable.ascentTime,
          restTime: ascentsTable.restTime,
          isSuccess: ascentsTable.isSuccess,
          name: routesTable.name,
          grade: routesTable.grade,
          area: routesTable.area,
          description: routesTable.description,
          photo_url: routesTable.photo_url,
          thumbnail_url: routesTable.thumbnail_url,
          style: routesTable.style,
          color: routesTable.color,
        })
        .from(ascentsTable)
        .innerJoin(routesTable, eq(ascentsTable.route_id, routesTable.id))
        .innerJoin(
          workoutAscentTable,
          eq(ascentsTable.id, workoutAscentTable.ascent_id),
        )
        .innerJoin(
          workoutsTable,
          eq(workoutAscentTable.workout_id, workoutsTable.id),
        )
        .where(eq(workoutsTable.id, workoutId));

      const ascentsWithHoldTypes = await Promise.all(
        ascentsWithGrade.map(async (ascent) => {
          const holdTypes = await db
            .select({ hold_type: routesHoldTypesTable.hold_type })
            .from(routesHoldTypesTable)
            .where(eq(routesHoldTypesTable.route_id, ascent.routeId));

          const holdTypeNames = holdTypes.map((ht) => ht.hold_type);

          return {
            ...ascent,
            hold_types: holdTypeNames,
          } as Ascent;
        }),
      );

      return ascentsWithHoldTypes;
    } catch (error) {
      console.log("error fetching ascents: " + error);
      return;
    }
  };

  const fetchAscentsStats = async (workoutId: number) => {
    const ascents = await db
      .selectDistinct({ id: workoutAscentTable.ascent_id })
      .from(workoutAscentTable)
      .where(eq(workoutAscentTable.workout_id, workoutId));
    const ascentsIds = ascents
      .map((ascent) => ascent?.id)
      .filter((id) => id !== null);

    const countAscents = await db
      .select({ total: count(ascentsTable.id) })
      .from(ascentsTable)
      .where(inArray(ascentsTable.id, ascentsIds));
    const ascentCount = countAscents[0]?.total;

    const countSuccessfulAscents = await db
      .select({ total: count(ascentsTable.id) })
      .from(ascentsTable)
      .where(
        and(
          inArray(ascentsTable.id, ascentsIds),
          eq(ascentsTable.isSuccess, true),
        ),
      );
    const ascentSuccessCount = countSuccessfulAscents[0]?.total;

    const countFailedAscent = await db
      .select({ total: count(ascentsTable.id) })
      .from(ascentsTable)
      .where(
        and(
          inArray(ascentsTable.id, ascentsIds),
          eq(ascentsTable.isSuccess, false),
        ),
      );
    const ascentFailCount = countFailedAscent[0]?.total;
    return {
      ascentCount: ascentCount,
      ascentSuccessCount: ascentSuccessCount,
      ascentFailCount: ascentFailCount,
    };
  };

  const fetchFlashStats = async () => {
    const firstAscentsSubquery = db
      .select({
        route_id: ascentsTable.route_id,
        first_ascent_id: sql`MIN(${ascentsTable.id})`.as("first_ascent_id"),
      })
      .from(ascentsTable)
      .groupBy(ascentsTable.route_id)
      .as("FirstAscents");

    const firstAscentDetailsSubquery = db
      .select({
        id: ascentsTable.id,
        route_id: ascentsTable.route_id,
        isSuccess: ascentsTable.isSuccess,
        grade: routesTable.grade,
      })
      .from(ascentsTable)
      .innerJoin(routesTable, eq(ascentsTable.route_id, routesTable.id))
      .where(
        sql`${ascentsTable.id} IN (SELECT ${firstAscentsSubquery.first_ascent_id} FROM ${firstAscentsSubquery})`,
      )
      .as("FirstAscentDetails");

    const flashRateQuery = db
      .select({
        grade: firstAscentDetailsSubquery.grade,
        total_first_ascents: sql`COUNT(*)`.as("total_first_ascents"),
        successful_flashes:
          sql`SUM(${firstAscentDetailsSubquery.isSuccess})`.as(
            "successful_flashes",
          ),
        flash_rate:
          sql`(SUM(${firstAscentDetailsSubquery.isSuccess}) * 1.0 / COUNT(*))`.as(
            "flash_rate",
          ),
      })
      .from(firstAscentDetailsSubquery)
      .groupBy(firstAscentDetailsSubquery.grade)
      .orderBy(firstAscentDetailsSubquery.grade);
    const result = await flashRateQuery.execute();
    return result as FlashRateData[];
  };
  return {
    fetchAscentsWithGrade,
    logAscent,
    updateAscentRestTime,
    fetchAscentsStats,
    fetchFlashStats,
  };
};
export default useAscents;
