import { render, screen, fireEvent } from "@testing-library/react-native";
import HoldTypeSelector from "@/components/logWorkouts/HoldTypeSelector";
import { WorkoutContext as WorkoutLogContext } from "@/app/(tabs)/workout";
import { useReducer } from "react";
import { WorkoutState, workoutReducer } from "@/reducers/WorkoutReducer";

describe("<HoldTypeSelector />", () => {
  beforeEach(() => {
    const initialState: WorkoutState = {
      grade: 0,
      workoutId: undefined,
      selectedStyle: "other",
      selectHoldTypes: ["Crimp", "Slopper", "Gaston"],
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
          <HoldTypeSelector contextType="workoutLog" />
        </WorkoutLogContext.Provider>
      );
    }
    render(<TestComponent />);
  });
  it("renders the hold type label, two hold values and ...", () => {
    screen.getByText("Holds: ");
    screen.getByText("Crimp, Slopper, ...");
  });

  it("opens and closes the modal when the button is pressed", () => {
    const holdButton = screen.getByTestId("hold-button");
    fireEvent.press(holdButton);
    screen.getByText("Hold Types");
    const updateButton = screen.getByText("Update");
    fireEvent.press(updateButton);
    expect(screen.queryByText("Hold Types")).toBeNull();
  });

  it("selects and deselects hold types", () => {
    const holdButton = screen.getByTestId("hold-button");
    fireEvent.press(holdButton);
    const crimpCheckbox = screen.getByTestId("checkbox-Crimp");
    fireEvent.press(crimpCheckbox);
    screen.getByText("Slopper, Gaston");
    const jugCheckbox = screen.getByTestId("checkbox-Jug");
    const gastonCheckbox = screen.getByTestId("checkbox-Gaston");
    fireEvent.press(jugCheckbox);
    fireEvent.press(gastonCheckbox);
    screen.getByText("Slopper, Jug");
  });
});
