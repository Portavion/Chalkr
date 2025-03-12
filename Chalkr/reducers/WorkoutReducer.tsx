// workoutReducer.tsx
export interface WorkoutState {
  grade: number;
  workoutId: number | undefined;
  selectedStyle: ClimbingStyle;
  selectHoldTypes: HoldType[];
  isClimbing: boolean;
  routes: Route[] | undefined;
  routeThumbnail: string | null;
  routeColour: RouteColour;
  showModal: boolean;
  refresh: boolean;
  routeImg: string | null;
  routeId: number | undefined;
}

export const workoutReducer = (
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
    case "SET_WORKOUT_ID":
      return { ...state, workoutId: action.payload };
    default:
      return state;
  }
};
