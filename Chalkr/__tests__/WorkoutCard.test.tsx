import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import WorkoutCard from "@/components/WorkoutCard/WorkoutCard";
import { ListItem } from "@rneui/themed";
import { View } from "react-native";

// Mock workout data
const mockWorkout: ClimbingWorkout = {
  id: 1,
  date: "2023-10-01",
  timestamp: "2025-03-04 17:22:31",
  climb_time: 300,
  rest_time: 120,
  warmup_time: 0,
};
// Mock onPress function
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

    // Check if the timestamp is rendered correctly
    expect(getByText("2023-10-01,")).toBeTruthy();
    expect(getByText("12:00:00Z")).toBeTruthy();

    // Check if the accordion icon is rendered
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

    // Initially, the details should not be visible
    expect(queryByText("Total time")).toBeNull();

    // Simulate a press on the accordion
    const accordion = getByTestId("accordion");
    fireEvent.press(accordion);

    // Check if the onPress function was called
    expect(mockOnPress).toHaveBeenCalledWith(mockWorkout.id);

    // Re-render with isExpanded set to true
    const { getByText } = render(
      <WorkoutCard
        workout={mockWorkout}
        isExpanded={true}
        handlePress={mockOnPress}
      />,
    );

    // Check if the details are now visible
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

    // Check if the details button is rendered
    const detailsButton = getByText("details");
    expect(detailsButton).toBeTruthy();
  });
});
