import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";

export default function GradeSelector({
  grade,
  setGrade,
}: {
  grade: number;
  setGrade: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <View className="flex flex-row justify-center items-center my-2">
      <Text className="mr-2 text-lg">Grade:</Text>
      <TouchableOpacity
        testID="decrement-button"
        onPress={() => {
          Haptics.selectionAsync();
          if (grade > 0) {
            setGrade(grade - 1);
          }
        }}
      >
        <Ionicons name="remove-circle-outline" size={26} className="mr-1" />
      </TouchableOpacity>
      <Text className=" text-lg">V{grade}</Text>
      <TouchableOpacity
        testID="increment-button"
        onPress={() => {
          Haptics.selectionAsync();
          setGrade(grade + 1);
        }}
      >
        <Ionicons name="add-circle-outline" size={26} className="ml-1" />
      </TouchableOpacity>
    </View>
  );
}
