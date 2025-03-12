import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import Index from "@/app/(tabs)/index"; // Assuming your component is in index.tsx/js
import useWorkout from "@/hooks/useWorkout";

jest.mock("@/hooks/useWorkout", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/components/WorkoutCard/WorkoutCard", () => {
  const MockWorkoutCard = ({ workout, isExpanded, handlePress }: any) => (
    <mock-workout-card
      workout={workout}
      isExpanded={isExpanded}
      handlePress={() => handlePress(workout.id)}
      testID={`workout-card-${workout.id}`}
    />
  );
  return {
    __esModule: true,
    default: MockWorkoutCard,
  };
});

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "mock-workout-card": any;
    }
  }
}
describe("<Index />", () => {
  const mockWorkouts = [
    { id: 1, name: "Workout 1" },
    { id: 2, name: "Workout 2" },
  ];

  it("renders 'No workouts' when workoutList is null", async () => {
    (useWorkout as jest.Mock).mockReturnValue({
      fetchWorkoutsList: jest.fn().mockReturnValue(null),
    });

    render(<Index />);
    expect(await screen.findByText("No workouts")).toBeTruthy();
  });

  it("renders WorkoutCard components when workoutList is not null", async () => {
    (useWorkout as jest.Mock).mockReturnValue({
      fetchWorkoutsList: jest.fn().mockReturnValue(mockWorkouts),
    });

    render(<Index />);
    expect(await screen.findByTestId("workout-card-1")).toBeTruthy();
    expect(await screen.findByTestId("workout-card-2")).toBeTruthy();
  });
});
