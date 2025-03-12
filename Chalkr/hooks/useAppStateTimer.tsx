import { useEffect, useRef } from "react";
import { differenceInSeconds } from "date-fns";
import { AppState, AppStateStatus } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function useAppStateTimer(
  dispatch: React.Dispatch<WorkoutAction>,
  isWorkoutStartedRef: React.MutableRefObject<boolean>,
  setSectionTimerAction: "SET_SECTION_TIMER",
  setWorkoutTimerAction: "SET_WORKOUT_TIMER",
) {
  const appState = useRef(AppState.currentState);

  const recordStartTime = async () => {
    try {
      const now = new Date();
      await AsyncStorage.setItem("@start_time", now.toISOString());
    } catch (err) {
      console.warn(err);
    }
  };

  const getElapsedTime = async () => {
    try {
      const startTime = await AsyncStorage.getItem("@start_time");
      const now = new Date();
      if (startTime) {
        return differenceInSeconds(now, Date.parse(startTime));
      } else {
        return 0;
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appState.current === "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      recordStartTime();
    }
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      const elapsed = await getElapsedTime();
      if (elapsed && isWorkoutStartedRef.current) {
        dispatch({ type: setSectionTimerAction, payload: elapsed });
        dispatch({ type: setWorkoutTimerAction, payload: elapsed });
      }
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, [
    dispatch,
    isWorkoutStartedRef,
    setSectionTimerAction,
    setWorkoutTimerAction,
  ]);
}

export default useAppStateTimer;
