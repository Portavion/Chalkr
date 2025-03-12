import useAscents from "@/hooks/useAscents";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function AscentStats({
  id,
  refresh = false,
  reset = false,
  size = "full",
}: {
  id: number | undefined;
  refresh?: boolean;
  reset?: boolean;
  size?: string;
}) {
  const [ascentCount, setAscentCount] = useState(0);
  const [ascentFailCount, setAscentFailCount] = useState(0);
  const [ascentSuccessCount, setAscentSuccessCount] = useState(0);

  const { fetchAscentsStats } = useAscents();

  const workoutId = id;

  useEffect(() => {
    const loadStats = async () => {
      if (!workoutId) {
        return;
      }
      const ascentStats = await fetchAscentsStats(workoutId);
      setAscentCount(ascentStats.ascentCount);
      setAscentFailCount(ascentStats.ascentFailCount);
      setAscentSuccessCount(ascentStats.ascentSuccessCount);
    };
    if (reset) {
      setAscentCount(0);
      setAscentFailCount(0);
      setAscentSuccessCount(0);
    } else {
      loadStats();
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
