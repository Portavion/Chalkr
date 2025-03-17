import { render, screen, fireEvent } from "@testing-library/react-native";
import ColourSelector from "@/components/logWorkouts/ColourSelector";

import { WorkoutContext as WorkoutLogContext } from "@/app/(tabs)/workout";
import * as Haptics from "expo-haptics";
import { WorkoutState, workoutReducer } from "@/reducers/WorkoutReducer";
import { useReducer } from "react";
import { ActionSheetIOS } from "react-native";

describe("<ClimbingStyleSelector />", () => {
  beforeEach(() => {
    const initialState: WorkoutState = {
      grade: 0,
      workoutId: undefined,
      selectedStyle: "other",
      selectHoldTypes: [],
      isClimbing: false,
      routes: undefined,
      routeThumbnail: null,
      routeColour: "red",
      showModal: false,
      refresh: false,
      routeImg: null,
      routeId: undefined,
    };

    function TestComponent() {
      const [state, dispatch] = useReducer(workoutReducer, initialState);
      return (
        <WorkoutLogContext.Provider value={{ state, dispatch }}>
          <ColourSelector contextType="workoutLog" />
        </WorkoutLogContext.Provider>
      );
    }
    render(<TestComponent />);
  });
  it("renders the colour label and colour value", () => {
    screen.getByText("Colour: ");
    screen.getByText("red");
  });

  it("opens the action sheet when the button is pressed", () => {
    const showActionSheetSpy = jest.spyOn(
      ActionSheetIOS,
      "showActionSheetWithOptions",
    );
    const colourButton = screen.getByTestId("colour-button");
    fireEvent.press(colourButton);
    expect(showActionSheetSpy).toHaveBeenCalled();
    expect(Haptics.notificationAsync).toHaveBeenCalled();
  });

  it("calls setRouteColour with the correct colour when an option is selected", () => {
    const showActionSheetSpy = jest.spyOn(
      ActionSheetIOS,
      "showActionSheetWithOptions",
    );
    showActionSheetSpy.mockImplementationOnce((options, callback) => {
      callback(3);
    });

    const colourButton = screen.getByTestId("colour-button");
    fireEvent.press(colourButton);
    screen.getByText("green");
    // expect(setRouteColour).toHaveBeenCalledWith("green");
  });

  it("calls setRouteColour with '' when the last option is selected", () => {
    const showActionSheetSpy = jest.spyOn(
      ActionSheetIOS,
      "showActionSheetWithOptions",
    );
    showActionSheetSpy.mockImplementationOnce((options, callback) => {
      callback(11); // Simulate selecting "Dyno" (index 2)
    });

    const colourButton = screen.getByTestId("colour-button");
    fireEvent.press(colourButton);
    screen.getByText("");
    // expect(setRouteColour).toHaveBeenCalledWith("");
  });
});
