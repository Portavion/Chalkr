import { render, screen, fireEvent } from "@testing-library/react-native";
import ClimbingStyleSelector from "@/components/logWorkouts/ClimbingStyleSelector";
import * as Haptics from "expo-haptics";
import { WorkoutState, workoutReducer } from "@/reducers/WorkoutReducer";
import { useReducer } from "react";
import { ActionSheetIOS } from "react-native";
import { WorkoutContext } from "@/context/WorkoutContext";

describe("<ClimbingStyleSelector />", () => {
  beforeEach(() => {
    const initialState: WorkoutState = {
      grade: 0,
      workoutId: undefined,
      selectedStyle: "board",
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
        <WorkoutContext.Provider value={{ state, dispatch }}>
          <ClimbingStyleSelector />
        </WorkoutContext.Provider>
      );
    }
    render(<TestComponent />);
  });
  it("renders the style label and climbing style value", () => {
    screen.getByText("Style: ");
    screen.getByText("board");
  });

  it("opens the action sheet when the button is pressed", () => {
    const showActionSheetSpy = jest.spyOn(
      ActionSheetIOS,
      "showActionSheetWithOptions",
    );
    const climbingStyleButton = screen.getByTestId("climbing-style-button");
    fireEvent.press(climbingStyleButton);
    expect(showActionSheetSpy).toHaveBeenCalled();
    expect(Haptics.notificationAsync).toHaveBeenCalled();
  });

  it("calls setSelectedStyle with the correct style when an option is selected", () => {
    const showActionSheetSpy = jest.spyOn(
      ActionSheetIOS,
      "showActionSheetWithOptions",
    );
    showActionSheetSpy.mockImplementationOnce((options, callback) => {
      callback(2); // Simulate selecting "Dyno" (index 2)
    });

    const climbingStyleButton = screen.getByTestId("climbing-style-button");
    fireEvent.press(climbingStyleButton);
    screen.getByText("dyno");
  });

  it("calls setSelectedStyle with 'Other' when the last option is selected", () => {
    const showActionSheetSpy = jest.spyOn(
      ActionSheetIOS,
      "showActionSheetWithOptions",
    );

    showActionSheetSpy.mockImplementationOnce((options, callback) => {
      callback(6); // Simulate selecting "Dyno" (index 2)
    });
    const climbingStyleButton = screen.getByTestId("climbing-style-button");
    fireEvent.press(climbingStyleButton);
    screen.getByText("other");
  });
});
