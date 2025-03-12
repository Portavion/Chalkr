import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import AscentStats from "../AscentStats"; // Adjust path as necessary

describe("<AscentStats />", () => {
  const mockWorkoutId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with default size", async () => {
    render(<AscentStats id={mockWorkoutId} />);

    await waitFor(() => {
      expect(screen.getByText("Climbs"));
      expect(screen.getByText("Total climbs"));
      expect(screen.getByText("3"));
      expect(screen.getByText("Completed climbs"));
      expect(screen.getByText("1"));
      expect(screen.getByText("Failed Climbs"));
      expect(screen.getByText("2"));
      expect(screen.getByText("Send Rate"));
      expect(screen.getByText("33%"));
    });
  });

  test("renders correctly with size='small'", async () => {
    render(<AscentStats id={mockWorkoutId} size="small" />);

    await waitFor(() => {
      expect(screen.getByText("Total climbs"));
      expect(screen.getByText("3"));
      expect(screen.getByText("Completed climbs"));
      expect(screen.getByText("1"));
    });

    expect(screen.queryByText("Failed Climbs")).toBeNull();
    expect(screen.queryByText("Send Rate")).toBeNull();
  });

  test("resets statistics when reset prop is true", async () => {
    render(<AscentStats id={mockWorkoutId} reset={true} />);

    await waitFor(() => {
      const zeroElements = screen.getAllByText("0");
      expect(zeroElements).toHaveLength(3);
      expect(screen.getByText("0%"));
    });
  });
});
