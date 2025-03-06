// app/workoutDetails/[id]/graphs.tsx
import { View, Text, Dimensions, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { WorkoutContext } from "./_layout";
import Svg, { Circle, Rect, Text as SVGText } from "react-native-svg";
import useWorkoutData from "@/hooks/useWorkoutData";

export default function GraphsScreen() {
  const id = useContext(WorkoutContext);
  const workoutId = Number(id);
  const [ascents, setAscents] = useState<Ascent[]>();
  const [workout, setWorkout] = useState<ClimbingWorkout | undefined>();
  const { fetchAscentsWithGrade, fetchWorkout } = useWorkoutData();

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
    const loadWorkout = async () => {
      try {
        const workout = (await fetchWorkout(workoutId)) as ClimbingWorkout[];
        if (!workout) {
          console.log("error loading workout");
          return;
        }
        setWorkout(workout[0]);
      } catch (error) {
        console.log("error loading routes: " + error);
      }
    };

    loadRoutes();
    loadWorkout();
  }, []);

  //TODO: refactor in component file
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
                V{ascent.grade !== null ? ascent.grade.toString() : "N/A"}
              </SVGText>
            </React.Fragment>
          );
        })}
      </Svg>
    );
  };

  const RestPieChart = ({ workout }: { workout: ClimbingWorkout }) => {
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

    const labelOffset = -25; // How far from the center to place the labels
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
          // rotation="-90"
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
  };
  return (
    <View>
      <View className="mt-2 text-center">
        <Text className="text-xl font-semibold">Grade Progression</Text>
        {ascents && <BarChart ascents={ascents}></BarChart>}
      </View>
      <View className="mt-6 mb-2 text-center">
        <View>
          <Text className="text-xl font-semibold">
            Climbing vs Resting Time
          </Text>
        </View>
        <View className="">
          {workout && <RestPieChart workout={workout}></RestPieChart>}
        </View>
      </View>
    </View>
  );
}
