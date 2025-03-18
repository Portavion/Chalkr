import React from "react";
import { View } from "react-native";
import ClimbingStyleSelector from "./ClimbingStyleSelector";
import ColourSelector from "./ColourSelector";
import GradeSelector from "./GradeSelector";
import HoldTypeSelector from "./HoldTypeSelector";

export default function RouteAttributeSelectors() {
  return (
    <>
      <View className="flex flex-row gap-4 justify-center items-center">
        <GradeSelector />
        <ColourSelector />
      </View>
      <View className="flex flex-row gap-4 justify-center items-center">
        <ClimbingStyleSelector />
        <HoldTypeSelector />
      </View>
    </>
  );
}
