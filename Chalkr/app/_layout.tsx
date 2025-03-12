import { Stack } from "expo-router";
import "../global.css";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from "@/context/AuthContext";
import { workoutReducer, WorkoutState } from "@/reducers/WorkoutReducer";
import { Dispatch, createContext, useReducer } from "react";

const initialState: WorkoutState = {
  grade: 0,
  workoutId: undefined,
  selectedStyle: "other",
  selectHoldTypes: [],
  isClimbing: false,
  routes: undefined,
  routeThumbnail: null,
  routeColour: "",
  showModal: false,
  refresh: false,
  routeImg: null,
  routeId: undefined,
};

interface WorkoutContextType {
  state: WorkoutState;
  dispatch: Dispatch<WorkoutAction>;
}
export const WorkoutContext = createContext<WorkoutContextType | undefined>(
  undefined,
);
export default function RootLayout() {
  const [state, dispatch] = useReducer(workoutReducer, initialState);
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
