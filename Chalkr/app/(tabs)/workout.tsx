import { View } from "react-native";
import React, { useState, useReducer } from "react";

import AscentStats from "@/components/workoutStats/AscentStats";

import RoutePicture from "@/components/logWorkouts/RoutePicture";
import LoggingModal from "@/components/logWorkouts/LoggingModal";
import useAscents from "@/hooks/useAscents";
import { workoutReducer } from "@/reducers/WorkoutReducer";
import initialWorkoutState from "@/constants/initialWorkoutState";
import { WorkoutContext } from "@/context/WorkoutContext";
import RouteAttributeSelectors from "@/components/logWorkouts/RouteAttributeSelectors";
import RecordWorkout from "@/components/logWorkouts/RecordWorkout";

export default function WorkoutScreen() {
  const [state, dispatch] = useReducer(workoutReducer, initialWorkoutState);

  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [lastTimer, setLastTimer] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const { logAscent } = useAscents();

  const handleAscentLog = async (isSuccess: boolean) => {
    setShowModal(false);

    dispatch({ type: "SET_REFRESH", payload: false });
    if (!state.workoutId) {
      return;
    }

    const route = await logAscent(
      state.workoutId,
      state.routeId || 0,
      lastTimer,
      state.grade,
      isSuccess,
      state.selectedStyle,
      state.selectHoldTypes,
      state.routeColour,
      state.routeImg,
      state.routeThumbnail,
    );
    if (!route) {
      dispatch({ type: "SET_ROUTE_ID", payload: 0 });
    } else {
      dispatch({ type: "SET_ROUTE_ID", payload: route.id });
    }
    dispatch({ type: "SET_REFRESH", payload: true });
  };

  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      <View className="flex flex-auto pt-2 items-center bg-stone-300">
        <RoutePicture />

        <AscentStats
          id={state.workoutId}
          refresh={state.refresh}
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
