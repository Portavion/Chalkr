import React, { act, useReducer } from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import RouteSelectionModal from "../RouteSelectionModal";
import { WorkoutState, workoutReducer } from "@/reducers/WorkoutReducer";
import { WorkoutContext } from "@/context/WorkoutContext";

describe("<RouteSelectionModal />", () => {
  const setShowSelectionModal = jest.fn();
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
        <WorkoutContext.Provider value={{ state, dispatch }}>
          <RouteSelectionModal
            showSelectionModal={true}
            setShowSelectionModal={setShowSelectionModal}
          />
        </WorkoutContext.Provider>
      );
    }
    render(<TestComponent />);
  });

  it("renders the modal and its components", () => {
    screen.findByText("Select an existing route");
    screen.findByTestId("cancel-button");
  });

  it("fetches and renders routes correctly", () => {
    screen.findByText("V5");
    screen.findByText("V6");
  });

  it("selects a route and updates state", async () => {
    const route1Grade = await screen.findByTestId("route-id-1");
    fireEvent.press(route1Grade);
    screen.findByText("V5");
    expect(setShowSelectionModal).toHaveBeenCalledWith(false);
  });

  it("closes the modal when 'Cancel' is pressed", async () => {
    const cancelButton = await screen.findByTestId("cancel-button");

    fireEvent.press(cancelButton);
    screen.findByText("V5");
    expect(setShowSelectionModal).toHaveBeenCalledWith(false);
  });
});
