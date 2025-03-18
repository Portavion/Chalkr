import { View } from "react-native";
import React, { useState, useEffect, useRef, useReducer } from "react";
import GradeSelector from "@/components/logWorkouts/GradeSelector";
import * as Haptics from "expo-haptics";

import AscentStats from "@/components/workoutStats/AscentStats";
import useWorkout from "@/hooks/useWorkout";

import StopWorkoutButton from "@/components/logWorkouts/StopWorkoutButton";
import RoutePicture from "@/components/logWorkouts/RoutePicture";
import ClimbingStyleSelector from "@/components/logWorkouts/ClimbingStyleSelector";
import WorkoutTimer from "@/components/logWorkouts/WorkoutTimer";
import WorkoutSectionTimer from "@/components/logWorkouts/WorkoutSectionTimer";
import RecordButton from "@/components/logWorkouts/RecordButton";
import LoggingModal from "@/components/logWorkouts/LoggingModal";
import HoldTypeSelector from "@/components/logWorkouts/HoldTypeSelector";
import ColourSelector from "@/components/logWorkouts/ColourSelector";
import useAppStateTimer from "@/hooks/useAppStateTimer";
import useWorkoutTimer from "@/hooks/useWorkoutTimer";
import useAscents from "@/hooks/useAscents";
import { workoutReducer, WorkoutState } from "@/reducers/WorkoutReducer";
import initialWorkoutState from "@/constants/initialWorkoutState";
import { WorkoutContext } from "@/context/WorkoutContext";

export default function WorkoutScreen() {
  const [state, dispatch] = useReducer(workoutReducer, initialWorkoutState);

  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const isWorkoutStartedRef = useRef(isWorkoutStarted);
  const [sectionTimer, setSectionTimer] = useState<number>();
  const [lastTimer, setLastTimer] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const { createNewWorkout, updateWorkoutTimer } = useWorkout();
  const { logAscent, updateAscentRestTime } = useAscents();

  const handleRecord = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isWorkoutStarted) {
      setSectionTimer(0);
      setIsWorkoutStarted(true);
      const id = await createNewWorkout();
      dispatch({ type: "SET_WORKOUT_ID", payload: id });
    }
    if (state.isClimbing) {
      setShowModal(true);
    } else {
      updateAscentRestTime(sectionTimer || 0);
    }
    dispatch({ type: "SET_IS_CLIMBING", payload: !state.isClimbing });
    setLastTimer(sectionTimer || 0);
    setSectionTimer(0);
  };

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

  const handleStopWorkout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (state.isClimbing) {
      alert("finish logging the current climb first");
    } else {
      if (!state.workoutId) {
        return;
      }
      await updateAscentRestTime(sectionTimer || 0);
      await updateWorkoutTimer(state.workoutId);

      setIsWorkoutStarted(false);
      dispatch({ type: "SET_ROUTE_IMG", payload: null });
      setSectionTimer(undefined);
      setWorkoutTimer(0);
      dispatch({ type: "SET_IS_CLIMBING", payload: false });
      dispatch({ type: "SET_ROUTE_COLOUR", payload: "" });
    }
  };

  useEffect(() => {
    isWorkoutStartedRef.current = isWorkoutStarted;
  }, [isWorkoutStarted]);

  useAppStateTimer(setSectionTimer, setWorkoutTimer, isWorkoutStartedRef);
  useWorkoutTimer(
    sectionTimer,
    setSectionTimer,
    setWorkoutTimer,
    isWorkoutStartedRef,
  );

  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      <View className="flex flex-auto pt-2 items-center bg-stone-300">
        {isWorkoutStarted && (
          <StopWorkoutButton handleStopWorkout={handleStopWorkout} />
        )}

        <RoutePicture />

        <View className="translate-x-20">
          <AscentStats
            id={state.workoutId}
            refresh={state.refresh}
            reset={!isWorkoutStarted}
            size={"small"}
          />
        </View>

        <View className="flex flex-row gap-4 justify-center items-center">
          <GradeSelector />
          <ColourSelector />
        </View>

        <View className="flex flex-row gap-4 justify-center items-center">
          <ClimbingStyleSelector />
          <HoldTypeSelector />
        </View>

        <WorkoutSectionTimer
          isClimbing={state.isClimbing}
          sectionTimer={sectionTimer || 0}
        />

        <RecordButton
          handleRecord={handleRecord}
          isClimbing={state.isClimbing}
        />

        <WorkoutTimer workoutTimer={workoutTimer} />

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
