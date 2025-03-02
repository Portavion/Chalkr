import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import { drizzle } from "drizzle-orm/expo-sqlite";
import {
  ascentsTable,
  routesTable,
  workoutAscentTable,
  workoutsTable,
} from "../../db/schema";
import { openDatabaseSync } from "expo-sqlite";
import { count, eq, sql } from "drizzle-orm";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

export default function GradeDistribution({ id }: { id: number }) {
  const [gradeDistribution, setGradeDistribution] = useState<
    {
      grade: number | null;
      ascentCount: number;
      successfulAttempts: number;
    }[]
  >();

  const workoutId = id;
  //TODO: change to useWorkoutData hook

  useEffect(() => {
    const fetchAscentsStats = async () => {
      const gradeDistributionData = await db
        .select({
          grade: routesTable.grade,
          ascentCount: count(), // Count the number of ascents per grade
          successfulAttempts: count(
            sql`CASE WHEN ${ascentsTable.isSuccess} = 1 THEN 1 END`,
          ),
        })
        .from(ascentsTable)
        .innerJoin(
          workoutAscentTable,
          eq(ascentsTable.id, workoutAscentTable.ascent_id),
        )
        .innerJoin(
          // Add another inner join
          routesTable,
          eq(ascentsTable.route_id, routesTable.id), // Join based on the route_route_id
        )
        .where(eq(workoutAscentTable.workout_id, workoutId))
        .groupBy(routesTable.grade);

      console.log(gradeDistributionData);

      setGradeDistribution(gradeDistributionData);
    };

    fetchAscentsStats();
  }, [id]);

  return (
    <>
      <Text className="text-black font-bold pt-4 ml-7 text-xl ">Grades</Text>
      {gradeDistribution?.map((grade) => (
        <View key={String(grade.grade)}>
          <View>
            <View className="flex flex-row items-center mb-0.5">
              <Text className="text-black pl-10 w-60 text-lg">
                V{grade.grade}: {grade.ascentCount} climbs
              </Text>
              <Text className="text-black  w-60 text-lg">
                {Math.floor(
                  100 * (grade.successfulAttempts / grade.ascentCount),
                )}
                %
              </Text>
            </View>
          </View>
        </View>
      ))}
    </>
  );
}
