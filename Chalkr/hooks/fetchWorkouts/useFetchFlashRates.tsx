import { drizzle } from "drizzle-orm/expo-sqlite";
import { ascentsTable, routesTable } from "@/db/schema";
import { openDatabaseSync } from "expo-sqlite";
import { eq, sql } from "drizzle-orm";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);
import { useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";

const useAscents = () => {
  const [flashRateStats, setFlashRateStats] = useState<FlashRateData[]>();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

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

      const fetchFlashRates = async () => {
        try {
          const flashRates = await fetchFlashStats();
          if (isActive) {
            setFlashRateStats(flashRates);
          }
        } catch (error) {
          console.error("Error fetching workouts:", error);
        }
      };

      fetchFlashRates();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return {
    flashRateStats,
  };
};
export default useAscents;
