import { WorkoutState } from "@/reducers/WorkoutReducer";

const initialState: WorkoutState = {
  grade: 0,
  workoutId: undefined,
  selectedStyle: "other",
  selectHoldTypes: [],
  isClimbing: false,
  routes: undefined,
  routeThumbnail: null,
  routeColour: "",
  showModal: false,
  refresh: false,
  routeImg: null,
  routeId: undefined,
};

export default initialState;
