import React from "react";
import { render, screen } from "@testing-library/react-native";
import WorkoutSectionTimer from "../WorkoutTimer";

describe("<WorkoutSectionTimer />", () => {
  test("renders 'Total workout' and timer correctly", () => {
    render(
      <WorkoutSectionTimer workoutTimer={3661} />, // 1 hour, 1 minute, 1 second
    );
    expect(screen.getByText("Total workout:"));
    expect(screen.getByText("01:01:01"));
  });

  test("renders timer with leading zeros correctly", () => {
    render(
      <WorkoutSectionTimer workoutTimer={65} />, // 1 minute, 5 seconds
    );
    expect(screen.getByText("00:01:05"));
  });

  test("renders timer correctly for 0 seconds", () => {
    render(
      <WorkoutSectionTimer workoutTimer={0} />, // 0 seconds
    );
    expect(screen.getByText("00:00:00"));
  });

  test("renders timer correctly for large values", () => {
    render(
      <WorkoutSectionTimer workoutTimer={45296} />, // 12 hours, 34 minutes, 56 seconds
    );
    expect(screen.getByText("12:34:56"));
  });
});
