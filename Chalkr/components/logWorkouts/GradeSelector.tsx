import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { WorkoutContext } from "@/context/WorkoutContext";

export default function GradeSelector({}: {}) {
  let context = useContext(WorkoutContext);
  if (!context) {
    throw new Error(
      "GradeSelector must be used within a WorkoutContext Provider",
    );
  }
  const { state, dispatch } = context;

  return (
    <View className="flex flex-row justify-center items-center my-2">
      <Text className="mr-2 text-lg">Grade:</Text>
      <TouchableOpacity
        testID="decrement-button"
        onPress={() => {
          Haptics.selectionAsync();
          if (state.grade > 0) {
            dispatch({ type: "SET_GRADE", payload: state.grade - 1 });
          }
        }}
      >
        <Ionicons name="remove-circle-outline" size={26} className="mr-1" />
      </TouchableOpacity>
      <Text className=" text-lg">V{state.grade}</Text>
      <TouchableOpacity
        testID="increment-button"
        onPress={() => {
          Haptics.selectionAsync();
          dispatch({ type: "SET_GRADE", payload: state.grade + 1 });
        }}
      >
        <Ionicons name="add-circle-outline" size={26} className="ml-1" />
      </TouchableOpacity>
    </View>
  );
}
