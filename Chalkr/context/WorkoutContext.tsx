import { WorkoutState } from "@/reducers/WorkoutReducer";
import { Dispatch, createContext } from "react";

interface WorkoutContextType {
  state: WorkoutState;
  dispatch: Dispatch<WorkoutAction>;
}
export const WorkoutContext = createContext<WorkoutContextType | undefined>(
  undefined,
);
