import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, TouchableOpacity } from "react-native";

import { drizzle } from "drizzle-orm/expo-sqlite";
import {
  ascentsTable,
  workoutAscentTable,
  workoutsTable,
} from "../../db/schema";
import { openDatabaseSync } from "expo-sqlite";
import { and, count, eq, inArray, sql } from "drizzle-orm";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

export default function AscentStats({
  id,
  refresh = false,
  reset = false,
}: {
  id: number;
  refresh?: boolean;
  reset?: boolean;
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
      <Text className="text-black font-semibold pt-4 pb-2 ml-7 ">Climbs</Text>
      <View className="text-black bg-amber-50">
        <View className="flex flex-row items-center mb-0.5">
          <Text className="text-black pl-10 w-60">Total climbs</Text>
          <Text>{ascentCount}</Text>
        </View>
        <View className="flex flex-row items-center mb-0.5">
          {/* Timing stats: avg rest and climbing time, ration climbing for resting */}
          <Text className="text-black  pl-10 w-60">Completed climbs</Text>
          <Text>{ascentSuccessCount}</Text>
        </View>
        <View className="flex flex-row items-center mb-0.5">
          <Text className="text-black  pl-10 w-60">Failed Climbs</Text>
          <Text>{ascentFailCount}</Text>
        </View>
        <View className="flex flex-row items-center mb-0.5">
          <Text className="text-black  pl-10 w-60">Send Rate</Text>
          <Text>
            {ascentCount !== 0
              ? Math.floor((100 * ascentSuccessCount) / ascentCount)
              : 0}
            %
          </Text>
        </View>
      </View>
    </>
  );
}
