import { useEffect } from "react";

function useWorkoutTimer(
  dispatch: React.Dispatch<WorkoutAction>,
  isWorkoutStartedRef: React.MutableRefObject<boolean>,
  setSectionTimerAction: "SET_SECTION_TIMER", // Action type for section timer
  setWorkoutTimerAction: "SET_WORKOUT_TIMER", // Action type for workout timer
) {
  useEffect(() => {
    if (isWorkoutStartedRef.current) {
      const id = setInterval(() => {
        dispatch({ type: setSectionTimerAction, payload: 1 });
        dispatch({ type: setWorkoutTimerAction, payload: 1 });
      }, 1000);
      return () => {
        if (isWorkoutStartedRef.current) {
          clearInterval(id);
        }
      };
    }
  }, [
    dispatch,
    isWorkoutStartedRef,
    setSectionTimerAction,
    setWorkoutTimerAction,
  ]);
}

export default useWorkoutTimer;
