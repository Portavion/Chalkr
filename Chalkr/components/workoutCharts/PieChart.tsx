import { Text, Dimensions } from "react-native";
import React from "react";
import Svg, { Circle, Text as SVGText } from "react-native-svg";

export default function RestPieChart({
  workout,
}: {
  workout: ClimbingWorkout | undefined;
}) {
  if (!workout) {
    return <Text>No workout to display.</Text>;
  }

  const screenWidth = Dimensions.get("window").width;
  const chartHeight = 200;
  const radius = 50;

  const climbDash =
    (workout.climb_time / (workout.climb_time + workout.rest_time)) *
    2 *
    Math.PI *
    radius;
  const restDash =
    (workout.rest_time / (workout.climb_time + workout.rest_time)) *
    2 *
    Math.PI *
    radius;

  const labelOffset = -25;
  const climbLabelX = screenWidth / 2 + labelOffset;
  const climbLabelY = chartHeight / 2 + 40;
  const restLabelX = screenWidth / 2 + labelOffset;
  const restLabelY = chartHeight / 2 - 40;

  return (
    <Svg width={screenWidth} height={chartHeight}>
      <Circle
        cy={chartHeight / 2}
        cx={screenWidth / 2}
        r={radius + 25}
        stroke="#166534"
        strokeWidth={radius}
        fill="#166534"
      />
      <Circle
        origin={`${screenWidth / 2}, ${chartHeight / 2}`}
        cy={chartHeight / 2}
        cx={screenWidth / 2}
        r={radius}
        stroke="#B45309"
        strokeWidth={radius + 50}
        fill="none"
        strokeDasharray={`${climbDash}, ${restDash}`}
      />
      <SVGText
        x={restLabelX}
        y={restLabelY}
        fontSize="16"
        fontWeight="bold"
        fill="black"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        Rest:{" "}
        {(
          (100 * workout.rest_time) /
          (workout.climb_time + workout.rest_time)
        ).toFixed(0)}
        %
      </SVGText>
      <SVGText
        x={climbLabelX}
        y={climbLabelY}
        fontSize="16"
        fontWeight="bold"
        fill="black"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        Climb:{" "}
        {(
          (100 * workout.climb_time) /
          (workout.climb_time + workout.rest_time)
        ).toFixed(0)}
        %
      </SVGText>
    </Svg>
  );
}
