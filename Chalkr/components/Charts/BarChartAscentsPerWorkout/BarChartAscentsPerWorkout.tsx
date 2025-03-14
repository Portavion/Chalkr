import React from "react";
import { Dimensions, View, Text } from "react-native";
import Svg, { Rect, Text as SvgText, Line, G } from "react-native-svg";

export default function BarChartAscentsPerWorkout({
  workoutsWithAscents,
}: {
  workoutsWithAscents?: DeepReadonly<WorkoutWithAscents[]>;
}) {
  if (!workoutsWithAscents || workoutsWithAscents.length === 0) {
    return (
      <View className="p-5 items-center justify-center">
        <Text>No Data to display</Text>
      </View>
    );
  }

  const { width } = Dimensions.get("window");
  const chartWidth = width * 0.8;
  const chartHeight = 200;
  const padding = 10;
  const sidePadding = 30;

  const maxClimbs = Math.max(
    ...workoutsWithAscents.map(
      (workout: WorkoutWithAscents) => workout.totalClimbs,
    ),
  );

  const barWidth = 20;

  const earliestDate = new Date(workoutsWithAscents[0].date).getTime();
  const latestDate = new Date(
    workoutsWithAscents[workoutsWithAscents.length - 1].date,
  ).getTime();
  const timeRange = latestDate - earliestDate;

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const yAxisValues = Array.from({ length: 5 }, (_, i) =>
    Math.round((maxClimbs / 4) * i),
  ); // 5 ticks on the y-axis

  return (
    <View className="p-4 items-center justify-center ">
      <Text className="text-xl font-semibold pb-4">Ascents per workout</Text>
      <Svg width={chartWidth} height={chartHeight + padding * 2}>
        {/* Y-axis */}
        <Line
          x1={sidePadding}
          y1={0}
          x2={sidePadding}
          y2={chartHeight}
          stroke="black"
          strokeWidth={1}
        />
        {/* X-axis */}
        <Line
          x1={sidePadding}
          y1={chartHeight}
          x2={chartWidth - sidePadding}
          y2={chartHeight}
          stroke="black"
          strokeWidth={1}
        />

        {/* Y-axis labels */}
        {yAxisValues.map((value, index) => {
          const y = chartHeight - (value / maxClimbs) * chartHeight;
          return (
            <G key={index}>
              <Line
                x1={sidePadding - 5} // Short tick line
                y1={y}
                x2={sidePadding}
                y2={y}
                stroke="black"
                strokeWidth={1}
              />
              <SvgText
                x={sidePadding - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="8"
              >
                {value}
              </SvgText>
            </G>
          );
        })}

        {/* Bars */}
        {workoutsWithAscents.map((workout: WorkoutWithAscents) => {
          const barHeightTotal =
            (workout.totalClimbs / maxClimbs) * chartHeight;
          const barHeightSuccessful =
            (workout.successfulClimbs / maxClimbs) * chartHeight;

          const workoutDate = new Date(workout.date).getTime();
          const x =
            sidePadding +
            10 +
            ((workoutDate - earliestDate) / timeRange) *
              (chartWidth - 2 * sidePadding - barWidth);

          const yTotal = chartHeight - barHeightTotal;
          const ySuccessful = chartHeight - barHeightSuccessful;

          return (
            <React.Fragment key={workout.workoutId}>
              <Rect
                x={x}
                y={yTotal}
                width={barWidth}
                height={barHeightTotal}
                fill="#c62828"
              />
              <Rect
                x={x}
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
