import { Stack } from "expo-router";
import "../global.css";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from "@/context/AuthContext";
import { workoutReducer } from "@/reducers/WorkoutReducer";
import { useReducer } from "react";

import initialWorkoutState from "@/constants/initialWorkoutState";
import { WorkoutContext } from "@/context/WorkoutContext";

export default function RootLayout() {
  const [state, dispatch] = useReducer(workoutReducer, initialWorkoutState);
  return (
    <UserProvider>
      <AuthProvider>
        <WorkoutContext.Provider value={{ state, dispatch }}>
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: "#d6d3d1" },
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{
                title: "Home",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="workoutDetails/[id]"
              options={{ title: "Workout Details" }}
            />
            <Stack.Screen
              name="routeView/routes"
              options={{ title: "All Routes" }}
            />
          </Stack>
        </WorkoutContext.Provider>
      </AuthProvider>
    </UserProvider>
  );
}
