import React from "react";
import { render, screen } from "@testing-library/react-native";
import WorkoutSectionTimer from "../WorkoutSectionTimer";

describe("<WorkoutSectionTimer />", () => {
  test("it renders 'Resting' and timer correctly when isClimbing is false", () => {
    render(<WorkoutSectionTimer isClimbing={false} sectionTimer={125} />);
    expect(screen.getByText("Resting:"));
    expect(screen.getByText("02:05"));
  });

  test("it renders 'Climbing' and timer correctly when isClimbing is true", () => {
    render(<WorkoutSectionTimer isClimbing={true} sectionTimer={90} />);
    expect(screen.getByText("Climbing:"));
    expect(screen.getByText("01:30"));
  });

  test("renders timer correctly when over an hour", () => {
    render(<WorkoutSectionTimer isClimbing={true} sectionTimer={3661} />);
    expect(screen.getByText("61:01"));
  });

  test("it renders timer with leading zeros correctly", () => {
    render(<WorkoutSectionTimer isClimbing={true} sectionTimer={5} />);
    expect(screen.getByText("00:05"));
  });
});
