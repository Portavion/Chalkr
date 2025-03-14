import React from "react";
import { Dimensions, View, Text } from "react-native";
import Svg, { Rect, Text as SvgText, Line, G } from "react-native-svg";

export default function BarChartFlashRatePerGrade({
  data,
}: {
  data: Readonly<FlashRateData[] | undefined>;
}) {
  const { width } = Dimensions.get("window");
  const chartWidth = width * 0.8;
  const chartHeight = 200;
  const padding = 10;
  const sidePadding = 30;
  const maxYAxisValue = 110; // Set max Y-axis value to 125

  if (!data || data.length === 0) {
    return <Text>No data to display.</Text>;
  }

  const yAxisValues = [0, 25, 50, 75, 100]; // Fixed Y-axis ticks

  return (
    <View className="p-4 items-center justify-center ">
      <Text className="text-xl font-semibold pb-4">Flash rate per grade</Text>
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
          const y = chartHeight - (value / maxYAxisValue) * chartHeight;
          return (
            <G key={index}>
              <Line
                x1={sidePadding - 5}
                y1={y}
                x2={sidePadding}
                y2={y}
                stroke="black"
                strokeWidth={1}
              />
              <SvgText
                x={sidePadding - 10}
                y={y + 8}
                textAnchor="end"
                fontSize="8"
              >
                {value}
              </SvgText>
            </G>
          );
        })}

        {/* X-Axis Labels (Grades) */}
        {data.map((item, index) => {
          const x =
            sidePadding +
            ((index + 0.5) / data.length) * (chartWidth - 2 * sidePadding);

          return (
            <SvgText
              key={index}
              x={x}
              y={chartHeight + padding * 2}
              textAnchor="middle"
              fontSize="12"
            >
              {item.grade}
            </SvgText>
          );
        })}

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight =
            ((item.flash_rate * 100) / maxYAxisValue) * chartHeight;
          const x =
            sidePadding +
            ((index + 0.5) / data.length) * (chartWidth - 2 * sidePadding);
          const y = chartHeight - barHeight;
          const barWidth = ((chartWidth - 2 * sidePadding) / data.length) * 0.7;

          return (
            <React.Fragment key={index}>
              <Rect
                x={x - barWidth / 2}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.flash_rate >= 0.5 ? "#008000" : "#c62828"}
              />
              <SvgText x={x - 5} y={y - 5} textAnchor="middle" fontSize="8">
                {(item.flash_rate * 100).toFixed(0)}%
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
