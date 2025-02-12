import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

export default function GradeSelector({
  grade,
  setGrade,
}: {
  grade: number;
  setGrade: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <View className="flex flex-row justify-center items-center mb-10">
      <Text className="mr-8">Grade: </Text>
      <TouchableOpacity
        testID="decrement-button"
        onPress={() => {
          if (grade > 0) {
            setGrade(grade - 1);
          }
        }}
      >
        <Ionicons name="remove-circle-outline" size={32} className="mr-3" />
      </TouchableOpacity>
      <Text className="">V{grade}</Text>
      <TouchableOpacity
        testID="increment-button"
        onPress={() => setGrade(grade + 1)}
      >
        <Ionicons name="add-circle-outline" size={32} className="ml-3" />
      </TouchableOpacity>
    </View>
  );
}
