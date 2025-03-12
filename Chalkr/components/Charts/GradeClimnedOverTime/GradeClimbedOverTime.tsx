import React from "react";
import { Dimensions, View, Text, StyleSheet } from "react-native";
import Svg, { Path, Text as SvgText, Line } from "react-native-svg";

const { width } = Dimensions.get("window");

interface WorkoutWithAscents {
  date: string;
  totalClimbs: number;
}

interface GradeClimbedOverTimeProps {
  data: WorkoutWithAscents[] | undefined;
}

export default function GradeClimbedOverTime({
  data,
}: GradeClimbedOverTimeProps) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const dates = data.map((item) => item.date);
  const totalAscents = data.map((item) => item.totalClimbs);
  const maxAscents = Math.max(...totalAscents);

  const graphWidth = width * 0.9;
  const graphHeight = 200;
  const padding = 30;

  const getTotalPoints = (counts: number[]) => {
    return counts
      .map((count, index) => {
        const x =
          (index / (counts.length - 1)) * (graphWidth - 2 * padding) + padding;
        const y =
          graphHeight -
          (count / maxAscents) * (graphHeight - 2 * padding) -
          padding;
        return `${x},${y}`;
      })
      .join(" ");
  };

  const totalPath = `M${getTotalPoints(totalAscents)}`;

  const xAxisLabel = "Date";
  const yAxisLabel = "Nb ascents";

  return (
    <View style={styles.container}>
      <Svg width={graphWidth} height={graphHeight + 30}>
        <Path d={totalPath} stroke="black" strokeWidth="2" fill="none" />

        {/* Y-axis labels */}
        <SvgText x={10} y={padding} textAnchor="start" fontSize="12">
          {maxAscents}
        </SvgText>
        <SvgText
          x={10}
          y={graphHeight - padding}
          textAnchor="start"
          fontSize="12"
        >
          0
        </SvgText>

        {/* X-axis labels */}
        {dates.map((date, index) => {
          if (
            index % Math.floor(dates.length / 4) === 0 ||
            index === dates.length - 1
          ) {
            const x =
              (index / (dates.length - 1)) * (graphWidth - 2 * padding) +
              padding;
            return (
              <SvgText
                key={index}
                x={x}
                y={graphHeight - 5}
                textAnchor="middle"
                fontSize="10"
              >
                {date.split("-").slice(1).join("/")}
              </SvgText>
            );
          }
          return null;
        })}

        {/* X-axis line */}
        <Line
          x1={padding}
          y1={graphHeight - padding}
          x2={graphWidth - padding}
          y2={graphHeight - padding}
          stroke="black"
          strokeWidth="1"
        />

        {/* Y-axis line */}
        <Line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={graphHeight - padding}
          stroke="black"
          strokeWidth="1"
        />

        {/* Axis Labels */}
        <SvgText
          x={graphWidth / 2}
          y={graphHeight + 20}
          textAnchor="middle"
          fontSize="14"
        >
          {xAxisLabel}
        </SvgText>
        <SvgText
          x={15}
          y={graphHeight / 2}
          textAnchor="middle"
          fontSize="14"
          transform={`rotate(-90 ${15} ${graphHeight / 2})`}
        >
          {yAxisLabel}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
