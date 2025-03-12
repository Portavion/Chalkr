// @ts-ignore
/// <reference types="nativewind/types" />
declare module "*.png";
type ContextType = "workoutLog" | "workoutStats";

type WorkoutAction =
  | { type: "SET_GRADE"; payload: number }
  | { type: "SET_SELECTED_STYLE"; payload: ClimbingStyle }
  | { type: "SET_SELECTED_HOLD_TYPES"; payload: HoldType[] }
  | { type: "SET_IS_CLIMBING"; payload: boolean }
  | { type: "SET_IS_WORKOUT_STARTED"; payload: boolean }
  | { type: "SET_SECTION_TIMER"; payload: number | undefined }
  | { type: "SET_LAST_TIMER"; payload: number }
  | { type: "SET_WORKOUT_TIMER"; payload: number }
  | { type: "SET_ROUTES"; payload: Route[] | undefined }
  | { type: "SET_ROUTE_THUMBNAIL"; payload: string | null }
  | { type: "SET_ROUTE_COLOUR"; payload: RouteColour }
  | { type: "SET_SHOW_MODAL"; payload: boolean }
  | { type: "SET_REFRESH"; payload: boolean }
  | { type: "SET_ROUTE_IMG"; payload: string | null }
  | { type: "SET_ROUTE_ID"; payload: number | undefined }
  | { type: "SET_WORKOUT_ID"; payload: number | undefined };
type HoldType =
  | "Crimp"
  | "Jug"
  | "Slopper"
  | "Pocket"
  | "Pinch"
  | "Sidepull"
  | "Gaston"
  | "Undercling";
type ClimbingStyle =
  | "board"
  | "cave"
  | "dyno"
  | "overhang"
  | "slab"
  | "traverse"
  | "other";
type ClimbAttempt = {
  ascentTime: number;
  isSent: boolean;
  grade: number;
  id: number;
  style: ClimbingStyle;
};
type ClimbingWorkout = {
  id: number;
  date: string;
  timestamp: string;
  climb_time: number;
  rest_time: number;
  warmup_time: number;
};
type Ascent = {
  ascentId: number;
  routeId: number;
  ascentTime: number;
  restTime: number;
  isSuccess: boolean;
  name: string | null;
  grade: number | null;
  area: string | null;
  description: string | null;
  photo_url: string | null;
  thumbnail_url: string | null;
  style: string | null;
  color: string;
  hold_types: HoldType[];
};
type Route = {
  id: number;
  name: string | null;
  grade: number | null;
  area: string | null;
  description: string | null;
  photo_url: string | null;
  thumbnail_url: string | null;
  style: ClimbingStyle | null;
  color: RouteColour;
  hold_types: HoldType[];
};
type RouteColour =
  | "VB"
  | "pink"
  | "blue"
  | "green"
  | "purple"
  | "white"
  | "teal"
  | "black"
  | "red"
  | "yellow"
  | "orange"
  | "";
