import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import { drizzle } from "drizzle-orm/expo-sqlite";
import { ascentsTable, workoutAscentTable } from "../../db/schema";
import { openDatabaseSync } from "expo-sqlite";
import { and, count, eq, inArray } from "drizzle-orm";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

//TODO: change to useWorkoutData hook
export default function AscentStats({
  id,
  refresh = false,
  reset = false,
  size = "full",
}: {
  id: number;
  refresh?: boolean;
  reset?: boolean;
  size?: string;
}) {
  const [ascentCount, setAscentCount] = useState(0);
  const [ascentFailCount, setAscentFailCount] = useState(0);
  const [ascentSuccessCount, setAscentSuccessCount] = useState(0);

  const workoutId = id;

  useEffect(() => {
    const fetchAscentsStats = async () => {
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
      setAscentCount(countAscents[0]?.total);

      const countSuccessfulAscents = await db
        .select({ total: count(ascentsTable.id) })
        .from(ascentsTable)
        .where(
          and(
            inArray(ascentsTable.id, ascentsIds),
            eq(ascentsTable.isSuccess, true),
          ),
        );
      setAscentSuccessCount(countSuccessfulAscents[0]?.total);

      const countFailedAscent = await db
        .select({ total: count(ascentsTable.id) })
        .from(ascentsTable)
        .where(
          and(
            inArray(ascentsTable.id, ascentsIds),
            eq(ascentsTable.isSuccess, false),
          ),
        );
      setAscentFailCount(countFailedAscent[0]?.total);
    };

    if (reset) {
      setAscentCount(0);
      setAscentFailCount(0);
      setAscentSuccessCount(0);
    } else {
      fetchAscentsStats();
    }
  }, [refresh, reset]);

  return (
    <>
      <View className="flex flex-col justify-center ">
        {size === "full" && (
          <Text className="text-black font-bold pt-4 ml-7 text-xl ">
            Climbs
          </Text>
        )}
        <View className="text-black ">
          <View className="flex flex-row items-center mb-0.5">
            <Text className="text-black pl-10 w-60 text-lg">Total climbs</Text>
            <Text className="text-black  w-60 text-lg">{ascentCount}</Text>
          </View>
          <View className="flex flex-row items-center mb-0.5 text-lg">
            {/* Timing stats: avg rest and climbing time, ration climbing for resting */}
            <Text className="text-black  pl-10 w-60 text-lg">
              Completed climbs
            </Text>
            <Text className="text-black  w-60 text-lg">
              {ascentSuccessCount}
            </Text>
          </View>
          {size === "full" && (
            <>
              <View className="flex flex-row items-center mb-0.5">
                <Text className="text-black  pl-10 w-60 text-lg">
                  Failed Climbs
                </Text>
                <Text className="text-black  w-60 text-lg">
                  {ascentFailCount}
                </Text>
              </View>
              <View className="flex flex-row items-center mb-0.5">
                <Text className="text-black  pl-10 w-60 text-lg">
                  Send Rate
                </Text>
                <Text className="text-black  w-60 text-lg">
                  {ascentCount !== 0
                    ? Math.floor((100 * ascentSuccessCount) / ascentCount)
                    : 0}
                  %
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </>
  );
}
