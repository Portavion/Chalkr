import { useEffect } from "react";

function useWorkoutTimer(
  sectionTimer: number | undefined,
  setSectionTimer: React.Dispatch<React.SetStateAction<number | undefined>>,
  setWorkoutTimer: React.Dispatch<React.SetStateAction<number>>,
  isWorkoutStartedRef: React.MutableRefObject<boolean>,
) {
  useEffect(() => {
    if (isWorkoutStartedRef.current) {
      const id = setInterval(() => {
        setSectionTimer((c) => (c || 0) + 1);
        setWorkoutTimer((c) => c + 1);
      }, 1000);
      return () => {
        if (isWorkoutStartedRef.current) {
          clearInterval(id);
        }
      };
    }
  }, [sectionTimer]);
}

export default useWorkoutTimer;
