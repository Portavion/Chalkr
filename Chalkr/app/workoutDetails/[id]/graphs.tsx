// app/workoutDetails/[id]/graphs.tsx
import { View, Text } from "react-native";
import { useContext } from "react";
import { WorkoutContext } from "./_layout";

export default function GraphsScreen() {
  const id = useContext(WorkoutContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Graphs for Workout ID: {id}</Text>
      {/* graph content here */}
    </View>
  );
}
