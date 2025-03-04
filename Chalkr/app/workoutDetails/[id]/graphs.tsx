// app/workoutDetails/[id]/graphs.tsx
import { View, Text, Dimensions, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { WorkoutContext } from "./_layout";
import Svg, { Rect, Text as SVGText } from "react-native-svg";
import useWorkoutData from "@/hooks/useWorkoutData";

export default function GraphsScreen() {
  const id = useContext(WorkoutContext);
  const workoutId = Number(id);
  const [ascents, setAscents] = useState<Ascent[]>();
  const { fetchAscentsWithGrade } = useWorkoutData();

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const ascents = await fetchAscentsWithGrade(workoutId);
        if (!ascents) {
          console.log("error loading problems");
          return;
        }
        setAscents(ascents);
      } catch (error) {
        console.log("error loading routes: " + error);
      }
    };

    loadRoutes();
  }, []);

  const BarChart = ({ ascents }: { ascents: Ascent[] }) => {
    if (!ascents || ascents.length === 0) {
      return <Text>No ascents to display.</Text>;
    }

    const screenWidth = Dimensions.get("window").width;
    const chartHeight = 200;

    const maxGrade = Math.max(...ascents.map((ascent) => ascent.grade || 0));

    const totalSpacing = 20;
    const availableWidth = screenWidth - totalSpacing;
    const barWidth = (availableWidth / ascents.length) * 0.8;
    const barSpacing = (availableWidth / ascents.length) * 0.2;

    return (
      <Svg width={screenWidth} height={chartHeight}>
        {ascents.map((ascent, index) => {
          const barHeight = ascent.grade
            ? (ascent.grade / maxGrade) * (chartHeight - 30)
            : 0;
          const x = index * (barWidth + barSpacing) + barSpacing / 2;
          const y = chartHeight - barHeight - 20;

          return (
            <React.Fragment key={ascent.ascentId}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={ascent.isSuccess ? "#2e7d32" : "#c62828"}
              />
              <SVGText
                x={x + barWidth / 2}
                y={chartHeight - 5}
                textAnchor="middle"
                fontSize="10"
              >
                {ascent.grade !== null ? ascent.grade.toString() : "N/A"}
              </SVGText>
            </React.Fragment>
          );
        })}
      </Svg>
    );
  };

  return (
    <View>
      <View className="mt-2 text-center">
        <Text className="text-xl font-semibold">Grade Progression</Text>
        {ascents && <BarChart ascents={ascents}></BarChart>}
      </View>
    </View>
  );
}
