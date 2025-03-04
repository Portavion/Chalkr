// app/workoutDetails/[id]/lists.tsx
import { useContext } from "react";
import { View, Text, Button } from "react-native";
import { WorkoutContext } from "./_layout";

export default function ListsScreen() {
  const id = useContext(WorkoutContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Lists for Workout ID: {id}</Text>
      {/* Your list content here */}
    </View>
  );
}
