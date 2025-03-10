import React from "react";
import { Text, Dimensions } from "react-native";
import Svg, { Rect, Text as SVGText } from "react-native-svg";

export default function BarChart({ ascents }: { ascents: Ascent[] }) {
  // const BarChart = ({ ascents }: { ascents: Ascent[] }) => {
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
}
