import React from "react";
import { render, screen } from "@testing-library/react-native";
import WorkoutDetailsScreen from "@/app/workoutDetails/[id]/index";
import { WorkoutContext } from "@/app/workoutDetails/[id]/_layout";
import AscentStats from "@/components/workoutStats/AscentStats";
import GradeDistribution from "@/components/workoutStats/GradeDistribution";
import StyleDistribution from "@/components/workoutStats/StyleDistribution";
import TimingStats from "@/components/workoutStats/TimingStats";
import DeleteWorkoutButton from "@/components/workoutStats/DeleteWorkoutButton";

jest.mock("@/components/workoutStats/AscentStats", () =>
  jest.fn(() => <mock-ascent-stats testId={"mock-ascent-stats"} />),
);
jest.mock("@/components/workoutStats/GradeDistribution", () =>
  jest.fn(() => <mock-grade-distribution testId={"mock-grade-distribution"} />),
);
jest.mock("@/components/workoutStats/StyleDistribution", () =>
  jest.fn(() => <mock-style-distribution testId={"mock-style-distribution"} />),
);
jest.mock("@/components/workoutStats/TimingStats", () =>
  jest.fn(() => <mock-timing-stats testId={"mock-timing-stats"} />),
);
jest.mock("@/components/workoutStats/DeleteWorkoutButton", () =>
  jest.fn(() => <mock-delete-button testId={"mock-delete-button"} />),
);
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "mock-ascent-stats": any;
      "mock-grade-distribution": any;
      "mock-style-distribution": any;
      "mock-timing-stats": any;
      "mock-delete-button": any;
      "mock-bar-chart": any;
      "mock-pie-chart": any;
    }
  }
}

describe("WorkoutDetailsScreen", () => {
  const mockWorkoutId = 123;

  it("renders the workout ID and all child components", () => {
    render(
      <WorkoutContext.Provider value={mockWorkoutId}>
        <WorkoutDetailsScreen />
      </WorkoutContext.Provider>,
    );

    expect(screen.findByText(`Workout ${mockWorkoutId}`)).toBeTruthy();
    expect(screen.findByTestId("<mock-timing-stats />")).toBeTruthy();
    expect(screen.findByTestId("<mock-ascent-stats />")).toBeTruthy();
    expect(screen.findByTestId("<mock-grade-distribution />")).toBeTruthy();
    expect(screen.findByTestId("<mock-style-distribution />")).toBeTruthy();
    expect(screen.findByTestId("<mock-delete-button />")).toBeTruthy();

    expect(TimingStats).toHaveBeenCalledWith({ id: 123 }, {});
    expect(AscentStats).toHaveBeenCalledWith({ id: 123 }, {});
    expect(GradeDistribution).toHaveBeenCalledWith({ id: 123 }, {});
    expect(StyleDistribution).toHaveBeenCalledWith({ id: 123 }, {});
    expect(DeleteWorkoutButton).toHaveBeenCalledWith({ id: 123 }, {});
  });
});
