import { render, screen, fireEvent } from "@testing-library/react-native";
import GradeSelector from "@/components/logWorkouts/GradeSelector";
import { workoutReducer, WorkoutState } from "@/reducers/WorkoutReducer";
import { WorkoutContext as WorkoutLogContext } from "@/app/(tabs)/workout";
import { useReducer } from "react";

describe("<GradeSelector />", () => {
  beforeEach(() => {
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

    function TestComponent() {
      const [state, dispatch] = useReducer(workoutReducer, initialState);
      return (
        <WorkoutLogContext.Provider value={{ state, dispatch }}>
          <GradeSelector contextType="workoutLog" />
        </WorkoutLogContext.Provider>
      );
    }
    render(<TestComponent />);
  });

  it("renders the Grade: label and grade value", () => {
    screen.getByText("V0");
    screen.getByText("Grade: ");
  });

  it(`increments the grade when the increment button is pressed`, () => {
    const incrementButton = screen.getByTestId("increment-button");
    fireEvent.press(incrementButton);
    screen.getByText("V1");
  });

  it(`decrements the grade when the decrement button is pressed`, () => {
    const incrementButton = screen.getByTestId("increment-button");
    fireEvent.press(incrementButton);
    const decrementButton = screen.getByTestId("decrement-button");
    fireEvent.press(decrementButton);
    screen.getByText("V0");
  });

  it("doesn't decrement the grade when the grade is 0", () => {
    const decrementButton = screen.getByTestId("decrement-button");
    fireEvent.press(decrementButton);
    screen.getByText("V0");
  });
});
