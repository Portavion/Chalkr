import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import DeleteWorkoutButton from "../DeleteWorkoutButton";
import { router } from "expo-router";

describe("<DeleteWorkoutButton />", () => {
  const mockDeleteWorkout = jest.fn();
  const mockWorkoutId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(require("@/hooks/useWorkoutData"), "default").mockReturnValue({
      deleteWorkout: mockDeleteWorkout,
    });
  });

  test("it renders correctly", () => {
    render(<DeleteWorkoutButton id={mockWorkoutId} />);

    expect(screen.getByText("Delete")).toBeTruthy();
  });

  test("it calls deleteWorkout when the 'Delete' button is pressed", async () => {
    render(<DeleteWorkoutButton id={mockWorkoutId} />);
    const { getByTestId } = render(<DeleteWorkoutButton id={mockWorkoutId} />);

    fireEvent.press(getByTestId("delete-button"));
    await waitFor(() => {
      expect(mockDeleteWorkout).toHaveBeenCalledWith(mockWorkoutId);
    });
  });

  test("it calls router.back when the delete button is pressed", async () => {
    render(<DeleteWorkoutButton id={mockWorkoutId} />);
    const { getByTestId } = screen;
    fireEvent.press(getByTestId("delete-button"));

    await waitFor(() => {
      expect(router.back).toHaveBeenCalled();
    });
  });
});
