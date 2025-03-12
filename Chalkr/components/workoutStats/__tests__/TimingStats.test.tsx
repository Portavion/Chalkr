import React from "react";
import { render, waitFor, screen } from "@testing-library/react-native";
import TimingStats from "@/components/workoutStats/TimingStats";
import * as useWorkoutModule from "@/hooks/useWorkout";

describe("<TimingStats />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    render(<TimingStats id={1} />);

    await waitFor(() => {
      expect(screen.getByText("Error Loading Workout")).toBeTruthy();
    });
  });

  it("fetches and displays workout data correctly", async () => {
    render(<TimingStats id={1} />);

    await waitFor(() => {
      expect(screen.getByText("2023-10-01T12:00:00Z")).toBeTruthy();
      expect(screen.getByText("Climb time")).toBeTruthy();
      expect(screen.getByText("01:00:00")).toBeTruthy();
      expect(screen.getByText("Rest time")).toBeTruthy();
      expect(screen.getByText("30:00")).toBeTruthy();
      expect(screen.getByText("Total time")).toBeTruthy();
      expect(screen.getByText("01:30:00")).toBeTruthy();
    });
  });

  it("displays an error message if fetching workout fails", async () => {
    jest.mock("@/hooks/useWorkout", () => ({
      __esModule: true,
      default: () => ({
        fetchWorkout: jest.fn().mockResolvedValue(null),
      }),
    }));
    render(<TimingStats id={1} />);
    await waitFor(() => {
      expect(screen.getByText("Error Loading Workout")).toBeTruthy();
    });
  });

  it("formats time correctly for values less than an hour", async () => {
    const useWorkoutSpy = jest.spyOn(useWorkoutModule, "default"); // Spy on the default export
    useWorkoutSpy.mockReturnValue({
      workoutId: 1, // Add the workoutId property
      deleteWorkout: jest.fn(), // Add the deleteWorkout property
      createNewWorkout: jest.fn().mockResolvedValue(1), // Add createNewWorkout
      fetchWorkoutsList: jest.fn(), // add fetchWorkoutsList
      fetchUniqueWorkout: jest.fn().mockResolvedValue([
        {
          timestamp: "2023-10-01T12:00:00Z",
          climb_time: 1500,
          rest_time: 300,
        },
      ]),
      fetchWorkoutStyleDistribution: jest.fn(),
      fetchWorkoutGradeDistribution: jest.fn(), //add fetchWorkoutGradeDistribution
      updateWorkoutTimer: jest.fn(),
      resetDb: jest.fn(),
    });
    render(<TimingStats id={1} />);

    await waitFor(() => {
      expect(screen.getByText("25:00")).toBeTruthy();
      expect(screen.getByText("05:00")).toBeTruthy();
      expect(screen.getByText("30:00")).toBeTruthy();
    });
  });
});
