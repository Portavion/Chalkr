import { View } from "react-native";
import {
  useState,
  useEffect,
  useRef,
  useReducer,
  createContext,
  Dispatch,
} from "react";
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
import React from "react";
import HoldTypeSelector from "@/components/logWorkouts/HoldTypeSelector";
import ColourSelector from "@/components/logWorkouts/ColourSelector";
import useAppStateTimer from "@/hooks/useAppStateTimer";
import useWorkoutTimer from "@/hooks/useWorkoutTimer";
import useAscents from "@/hooks/useAscents";

interface WorkoutState {
  grade: number;
  selectedStyle: ClimbingStyle;
  selectHoldTypes: HoldType[];
  isClimbing: boolean;
  isWorkoutStarted: boolean;
  sectionTimer: number | undefined;
  lastTimer: number;
  workoutTimer: number;
  routes: Route[] | undefined;
  routeThumbnail: string | null;
  routeColour: RouteColour;
  showModal: boolean;
  refresh: boolean;
  routeImg: string | null;
  routeId: number | undefined;
}

const initialState: WorkoutState = {
  grade: 0,
  selectedStyle: "other",
  selectHoldTypes: [],
  isClimbing: false,
  isWorkoutStarted: false,
  sectionTimer: undefined,
  lastTimer: 0,
  workoutTimer: 0,
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

export default function WorkoutScreen() {
  const [state, dispatch] = useReducer(workoutReducer, initialState);
  const isWorkoutStartedRef = useRef(state.isWorkoutStarted);

  const { workoutId, createNewWorkout, updateWorkoutTimer } = useWorkout();
  const { logAscent, updateAscentRestTime } = useAscents();

  const [showModal, setShowModal] = useState(false);

  const handleRecord = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!state.isWorkoutStarted) {
      dispatch({ type: "SET_IS_WORKOUT_STARTED", payload: true });
      dispatch({ type: "SET_SECTION_TIMER", payload: 0 });

      await createNewWorkout();
    }
    if (state.isClimbing) {
      setShowModal(true);
    } else {
      updateAscentRestTime(state.sectionTimer || 0);
    }
    dispatch({ type: "SET_IS_CLIMBING", payload: !state.isClimbing });
    dispatch({ type: "SET_LAST_TIMER", payload: state.sectionTimer || 0 });
    dispatch({ type: "SET_SECTION_TIMER", payload: 0 });
  };

  const handleAscentLog = async (isSuccess: boolean) => {
    setShowModal(false);

    dispatch({ type: "SET_REFRESH", payload: false });

    const route = await logAscent(
      state.routeId || 0,
      state.lastTimer,
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
      await updateAscentRestTime(state.sectionTimer || 0);
      await updateWorkoutTimer();

      dispatch({ type: "SET_IS_WORKOUT_STARTED", payload: false });
      dispatch({ type: "SET_ROUTE_IMG", payload: null });
      dispatch({ type: "SET_SECTION_TIMER", payload: undefined });
      dispatch({ type: "SET_IS_CLIMBING", payload: false });
      dispatch({ type: "SET_WORKOUT_TIMER", payload: 0 });
      dispatch({ type: "SET_ROUTE_COLOUR", payload: "" });
    }
  };

  useEffect(() => {
    isWorkoutStartedRef.current = state.isWorkoutStarted;
  }, [state.isWorkoutStarted]);

  useAppStateTimer(
    dispatch,
    isWorkoutStartedRef,
    "SET_SECTION_TIMER",
    "SET_WORKOUT_TIMER",
  );

  useWorkoutTimer(
    dispatch,
    isWorkoutStartedRef,
    "SET_SECTION_TIMER",
    "SET_WORKOUT_TIMER",
  );

  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      <View className="flex flex-auto pt-2 items-center bg-stone-300">
        {state.isWorkoutStarted && (
          <StopWorkoutButton handleStopWorkout={handleStopWorkout} />
        )}

        <RoutePicture />

        <View className="translate-x-20">
          <AscentStats
            id={workoutId}
            refresh={state.refresh}
            reset={!state.isWorkoutStarted}
            size={"small"}
          />
        </View>

        <View className="flex flex-row gap-4 justify-center items-center">
          <GradeSelector grade={state.grade} />
          <ColourSelector routeColour={state.routeColour} />
        </View>

        <View className="flex flex-row gap-4 justify-center items-center">
          <ClimbingStyleSelector selectedStyle={state.selectedStyle} />

          <HoldTypeSelector selectedHoldTypes={state.selectHoldTypes} />
        </View>

        <WorkoutSectionTimer
          isClimbing={state.isClimbing}
          sectionTimer={state.sectionTimer || 0}
        />

        <RecordButton
          handleRecord={handleRecord}
          isClimbing={state.isClimbing}
        />

        <WorkoutTimer workoutTimer={state.workoutTimer} />

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

const workoutReducer = (
  state: WorkoutState,
  action: WorkoutAction,
): WorkoutState => {
  switch (action.type) {
    case "SET_GRADE":
      return { ...state, grade: action.payload };
    case "SET_SELECTED_STYLE":
      return { ...state, selectedStyle: action.payload };
    case "SET_SELECTED_HOLD_TYPES":
      return { ...state, selectHoldTypes: action.payload };
    case "SET_IS_CLIMBING":
      return { ...state, isClimbing: action.payload };
    case "SET_IS_WORKOUT_STARTED":
      return { ...state, isWorkoutStarted: action.payload };
    case "SET_SECTION_TIMER":
      return { ...state, sectionTimer: action.payload };
    case "SET_LAST_TIMER":
      return { ...state, lastTimer: action.payload };
    case "SET_WORKOUT_TIMER":
      return { ...state, workoutTimer: action.payload };
    case "SET_ROUTES":
      return { ...state, routes: action.payload };
    case "SET_ROUTE_THUMBNAIL":
      return { ...state, routeThumbnail: action.payload };
    case "SET_ROUTE_COLOUR":
      return { ...state, routeColour: action.payload };
    case "SET_SHOW_MODAL":
      return { ...state, showModal: action.payload };
    case "SET_REFRESH":
      return { ...state, refresh: action.payload };
    case "SET_ROUTE_IMG":
      return { ...state, routeImg: action.payload };
    case "SET_ROUTE_ID":
      return { ...state, routeId: action.payload };
    default:
      return state;
  }
};
