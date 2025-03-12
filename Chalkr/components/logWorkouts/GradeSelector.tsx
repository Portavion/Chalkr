import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { WorkoutContext } from "@/app/(tabs)/workout";

export default function GradeSelector({ grade }: { grade: number }) {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error(
      "RoutePicture must be used within a WorkoutContext Provider",
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
          if (grade > 0) {
            dispatch({ type: "SET_GRADE", payload: state.grade - 1 });
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
          dispatch({ type: "SET_GRADE", payload: state.grade + 1 });
        }}
      >
        <Ionicons name="add-circle-outline" size={26} className="ml-1" />
      </TouchableOpacity>
    </View>
  );
}
