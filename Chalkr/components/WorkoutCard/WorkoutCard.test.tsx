import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
jest.mock("expo-router");
import WorkoutCard from "@/components/WorkoutCard/WorkoutCard";

const mockWorkout: ClimbingWorkout = {
  id: 1,
  date: "2023-10-01",
  timestamp: "2025-03-04 17:22:31",
  climb_time: 300,
  rest_time: 120,
  warmup_time: 0,
};

const mockOnPress = jest.fn();

describe("WorkoutCard Component", () => {
  it("renders correctly", () => {
    const { getByText, getByTestId } = render(
      <WorkoutCard
        workout={mockWorkout}
        isExpanded={false}
        handlePress={mockOnPress}
      />,
    );

    expect(getByText("2025-03-04, 17:22:31")).toBeTruthy();

    const accordionIcon = getByTestId("accordion-icon");
    expect(accordionIcon).toBeTruthy();
  });

  it("expands and collapses when pressed", () => {
    const { getByTestId, queryByText } = render(
      <WorkoutCard
        workout={mockWorkout}
        isExpanded={false}
        handlePress={mockOnPress}
      />,
    );

    expect(queryByText("Total time")).toBeNull();

    const accordion = getByTestId("accordion");
    fireEvent.press(accordion);

    expect(mockOnPress).toHaveBeenCalledWith(mockWorkout.id);

    const { getByText } = render(
      <WorkoutCard
        workout={mockWorkout}
        isExpanded={true}
        handlePress={mockOnPress}
      />,
    );

    expect(getByText("Total time")).toBeTruthy();
    expect(getByText("05:00")).toBeTruthy(); // Climb time
    expect(getByText("02:00")).toBeTruthy(); // Rest time
  });

  it("displays the details button", () => {
    const { getByText } = render(
      <WorkoutCard
        workout={mockWorkout}
        isExpanded={true}
        handlePress={mockOnPress}
      />,
    );

    const detailsButton = getByText("details");
    expect(detailsButton).toBeTruthy();
  });
});
