import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import StopWorkoutButton from "../StopWorkoutButton";

describe("<StopWorkoutButton />", () => {
  const handleStopWorkoutMock = jest.fn();

  it("renders the button and text correctly", () => {
    render(<StopWorkoutButton handleStopWorkout={handleStopWorkoutMock} />);

    expect(screen.getByTestId("stop-button"));
    expect(screen.getByText("Stop the workout"));
  });

  it("calls handleStopWorkout when the button is pressed", () => {
    render(<StopWorkoutButton handleStopWorkout={handleStopWorkoutMock} />);
    const button = screen.getByTestId("stop-button");
    fireEvent.press(button);
    expect(handleStopWorkoutMock).toHaveBeenCalledTimes(1);
  });
});
