//TODO: move record / stop record buttons into their own components
import useAppStateTimer from "@/hooks/useAppStateTimer";
import useWorkout from "@/hooks/useWorkout";
import useWorkoutTimer from "@/hooks/useWorkoutTimer";
import React, { useContext, useEffect, useRef, useState } from "react";
import RecordButton from "./RecordButton";
import StopWorkoutButton from "./StopWorkoutButton";
import WorkoutSectionTimer from "./WorkoutSectionTimer";
import WorkoutTimer from "./WorkoutTimer";
import * as Haptics from "expo-haptics";
import { WorkoutContext } from "@/context/WorkoutContext";

export default function RecordWorkout({
  isWorkoutStarted,
  setIsWorkoutStarted,
  setShowModal,
  setLastTimer,
  updateAscentRestTime,
}: {
  isWorkoutStarted: boolean;
  setIsWorkoutStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setLastTimer: React.Dispatch<React.SetStateAction<number>>;
  updateAscentRestTime: any;
}) {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error(
      "RoutePicture must be used within a WorkoutContext Provider",
    );
  }
  const isWorkoutStartedRef = useRef(isWorkoutStarted);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [sectionTimer, setSectionTimer] = useState<number>();
  const { createNewWorkout, updateWorkoutTimer } = useWorkout();
  const { state, dispatch } = context;

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
    <>
      <WorkoutSectionTimer
        isClimbing={state.isClimbing}
        sectionTimer={sectionTimer || 0}
      />

      <RecordButton handleRecord={handleRecord} isClimbing={state.isClimbing} />

      {isWorkoutStarted && (
        <StopWorkoutButton handleStopWorkout={handleStopWorkout} />
      )}
      <WorkoutTimer workoutTimer={workoutTimer} />
    </>
  );
}
