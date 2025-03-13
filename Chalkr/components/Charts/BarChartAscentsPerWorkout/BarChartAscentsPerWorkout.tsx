import React from "react";
import { Dimensions, View, Text } from "react-native";
import Svg, { Rect, Text as SvgText } from "react-native-svg";

export default function BarChartAscentsPerWorkout({
  workoutsWithAscents,
}: {
  workoutsWithAscents?: WorkoutWithAscents[];
}) {
  if (!workoutsWithAscents || workoutsWithAscents.length === 0) {
    return (
      <View className="p-5 items-center justify-center">
        <Text>No Data to display</Text>
      </View>
    );
  }
  const { width } = Dimensions.get("window");
  const chartWidth = width * 0.9;
  const chartHeight = 200;
  const padding = 20;

  const maxClimbs = Math.max(
    ...workoutsWithAscents.map((workout) => workout.totalClimbs),
  );

  const barWidth = chartWidth / workoutsWithAscents.length - 5;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <View className="p-4 items-center justify-center ">
      <Text className="text-xl font-semibold pb-4">Ascents per workout</Text>
      <Svg width={chartWidth} height={chartHeight + padding * 2}>
        {workoutsWithAscents.map((workout, index) => {
          const barHeightTotal =
            (workout.totalClimbs / maxClimbs) * chartHeight;
          const barHeightSuccessful =
            (workout.successfulClimbs / maxClimbs) * chartHeight;
          const x = index * (chartWidth / workoutsWithAscents.length);
          const yTotal = chartHeight - barHeightTotal;
          const ySuccessful = chartHeight - barHeightSuccessful;

          return (
            <React.Fragment key={workout.workoutId}>
              <Rect
                x={x + 2}
                y={yTotal}
                width={barWidth}
                height={barHeightTotal}
                fill="tomato"
              />
              <Rect
                x={x + 2}
                y={ySuccessful}
                width={barWidth}
                height={barHeightSuccessful}
                fill="#008000"
              />
              <SvgText
                x={x + barWidth / 2}
                y={chartHeight + padding}
                textAnchor="middle"
                fontSize="12"
              >
                {formatDate(workout.date || "")}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
