import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import StopWorkoutButton from "../StopWorkoutButton";

describe("<StopWorkoutButton />", () => {
  const handleStopWorkoutMock = jest.fn();

  test("it renders the button and text correctly", () => {
    render(<StopWorkoutButton handleStopWorkout={handleStopWorkoutMock} />);

    expect(screen.getByTestId("stop-button"));
    expect(screen.getByText("Stop the workout"));
  });

  test("it calls handleStopWorkout when the button is pressed", () => {
    render(<StopWorkoutButton handleStopWorkout={handleStopWorkoutMock} />);
    const button = screen.getByTestId("stop-button");
    fireEvent.press(button);
    expect(handleStopWorkoutMock).toHaveBeenCalledTimes(1);
  });
});
