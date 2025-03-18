import React, { useReducer } from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import LoggingModal from "@/components/logWorkouts/LoggingModal";
import * as Haptics from "expo-haptics";
import { WorkoutState, workoutReducer } from "@/reducers/WorkoutReducer";
import { WorkoutContext } from "@/context/WorkoutContext";

jest.mock("expo-haptics");

describe("<LoggingModal />", () => {
  const handleAscentLog = jest.fn();

  beforeEach(() => {
    handleAscentLog.mockClear();
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
        <WorkoutContext.Provider value={{ state, dispatch }}>
          <LoggingModal showModal={true} handleAscentLog={handleAscentLog} />
        </WorkoutContext.Provider>
      );
    }
    render(<TestComponent />);
  });

  it("renders the modal and its components", async () => {
    expect(await screen.findByText("New route")).toBeTruthy();
    expect(await screen.findByText("Grade: ")).toBeTruthy();
    expect(await screen.findByText("Colour: ")).toBeTruthy();
    expect(await screen.findByText("Style: ")).toBeTruthy();
    expect(await screen.findByText("Holds: ")).toBeTruthy();
    expect(
      await screen.findByText("Was your attempt successful?"),
    ).toBeTruthy();
  });

  it("logs successful ascent", async () => {
    const successButton = await screen.findByTestId("successful-button");
    fireEvent.press(successButton);
    expect(Haptics.notificationAsync).toHaveBeenCalled();
    expect(handleAscentLog).toHaveBeenCalledWith(true);
  });

  it("logs unsuccessful ascent", async () => {
    const failureButton = await screen.findByTestId("unsuccessful-button");
    fireEvent.press(failureButton);
    expect(Haptics.notificationAsync).toHaveBeenCalled();
    expect(handleAscentLog).toHaveBeenCalledWith(false);
  });
});
