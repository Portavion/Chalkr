import React from "react";
import { render, waitFor, screen } from "@testing-library/react-native";
import StyleDistribution from "@/components/workoutStats/StyleDistribution";

describe("<StyleDistribution />", () => {
  it("fetches and displays style distribution data correctly", async () => {
    render(<StyleDistribution id={1} />);

    await waitFor(() => {
      expect(screen.getByText("Styles")).toBeTruthy();

      expect(screen.getByText("Crimps: 10 climbs")).toBeTruthy();
      expect(screen.getByText("80%")).toBeTruthy();

      expect(screen.getByText("Slopers: 5 climbs")).toBeTruthy();
      expect(screen.getByText("60%")).toBeTruthy();

      expect(screen.getByText("Pinches: 12 climbs")).toBeTruthy();
      expect(screen.getByText("50%")).toBeTruthy();
    });
  });
});
