import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import { drizzle } from "drizzle-orm/expo-sqlite";
import { ascentsTable, workoutAscentTable } from "../../db/schema";
import { openDatabaseSync } from "expo-sqlite";
import { count, eq, sql } from "drizzle-orm";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

export default function StyleDistribution({ id }: { id: number }) {
  const [styleDistribution, setStyleDistribution] = useState<
    {
      style: string | null;
      ascentCount: number;
      successfulAttempts: number;
    }[]
  >();

  const workoutId = id;

  useEffect(() => {
    const fetchAscentsStats = async () => {
      const styleDistributionData = await db
        .select({
          style: ascentsTable.style,
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
        .where(eq(workoutAscentTable.workout_id, workoutId))
        .groupBy(ascentsTable.style);

      setStyleDistribution(styleDistributionData);
    };

    fetchAscentsStats();
  }, [id]);

  return (
    <>
      <Text className="text-black font-semibold pt-4 pb-2 ml-7  ">Styles</Text>
      {styleDistribution?.map((style) => (
        <View key={String(style.style)}>
          <View className="bg-amber-50">
            <View className="flex flex-row items-center mb-0.5">
              <Text className="text-black pl-10 w-60">
                {style.style}: {style.ascentCount} climbs
              </Text>
              <Text>
                {Math.floor(
                  100 * (style.successfulAttempts / style.ascentCount),
                )}
                % success
              </Text>
            </View>
          </View>
        </View>
      ))}
    </>
  );
}
