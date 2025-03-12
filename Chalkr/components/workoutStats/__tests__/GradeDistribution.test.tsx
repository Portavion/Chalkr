import React from "react";
import { render, waitFor, screen } from "@testing-library/react-native";
import GradeDistribution from "@/components/workoutStats/GradeDistribution";

describe("<GradeDistribution />", () => {
  it("fetches and displays grade distribution data correctly", async () => {
    render(<GradeDistribution id={1} />);

    await waitFor(() => {
      expect(screen.getByText("Grades")).toBeTruthy();

      expect(screen.getByText("V0: 10 climbs")).toBeTruthy();
      expect(screen.getByText("80%")).toBeTruthy();

      expect(screen.getByText("V1: 5 climbs")).toBeTruthy();
      expect(screen.getByText("60%")).toBeTruthy();

      expect(screen.getByText("V2: 12 climbs")).toBeTruthy();
      expect(screen.getByText("50%")).toBeTruthy();
    });
  });
});
