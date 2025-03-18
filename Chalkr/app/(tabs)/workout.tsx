import LoggingModal from "@/components/logWorkouts/LoggingModal";
import RecordWorkout from "@/components/logWorkouts/RecordWorkout";
import RouteAttributeSelectors from "@/components/logWorkouts/RouteAttributeSelectors";
import RoutePicture from "@/components/logWorkouts/RoutePicture";
import AscentStats from "@/components/workoutStats/AscentStats";
import initialWorkoutState from "@/constants/initialWorkoutState";
import { WorkoutContext } from "@/context/WorkoutContext";
import useAscents from "@/hooks/useAscents";
import { workoutReducer } from "@/reducers/WorkoutReducer";
import React, { useReducer, useState } from "react";
import { View } from "react-native";

export default function WorkoutScreen() {
  const [workoutState, dispatch] = useReducer(
    workoutReducer,
    initialWorkoutState,
  );

  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [lastTimer, setLastTimer] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const { logAscent } = useAscents();

  const handleAscentLog = async (isSuccess: boolean) => {
    setShowModal(false);

    dispatch({ type: "SET_REFRESH", payload: false });
    if (!workoutState.workoutId) {
      return;
    }

    const route = await logAscent(
      workoutState.workoutId,
      workoutState.routeId || 0,
      lastTimer,
      workoutState.grade,
      isSuccess,
      workoutState.selectedStyle,
      workoutState.selectHoldTypes,
      workoutState.routeColour,
      workoutState.routeImg,
      workoutState.routeThumbnail,
    );
    if (!route) {
      dispatch({ type: "SET_ROUTE_ID", payload: 0 });
    } else {
      dispatch({ type: "SET_ROUTE_ID", payload: route.id });
    }
    dispatch({ type: "SET_REFRESH", payload: true });
  };

  return (
    <WorkoutContext.Provider value={{ state: workoutState, dispatch }}>
      <View className="flex flex-auto pt-2 items-center bg-stone-300">
        <RoutePicture />

        <AscentStats
          id={workoutState.workoutId}
          refresh={workoutState.refresh}
          reset={!isWorkoutStarted}
          size={"small"}
        />

        <RouteAttributeSelectors />

        <RecordWorkout
          isWorkoutStarted={isWorkoutStarted}
          setIsWorkoutStarted={setIsWorkoutStarted}
          setShowModal={setShowModal}
          setLastTimer={setLastTimer}
        />

        {showModal && (
          <LoggingModal
            handleAscentLog={handleAscentLog}
            showModal={showModal}
          />
        )}
      </View>
    </WorkoutContext.Provider>
  );
}
