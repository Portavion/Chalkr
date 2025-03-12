import React from "react";
import { render, screen } from "@testing-library/react-native";
import RestPieChart from "@/components/workoutCharts/PieChart";

jest.mock("react-native-svg", () => {
  const React = require("react");
  const MockSvg = ({ children, ...props }: { children: React.ReactNode }) => (
    <mock-svg testID="mock-svg" {...props}>
      {children}
    </mock-svg>
  );
  const MockCircle = ({ ...props }: any) => (
    <mock-circle testID="mock-circle" {...props} />
  );
  const MockText = ({ children, ...props }: { children: React.ReactNode }) => (
    <mock-text testID="mock-text" {...props}>
      {children}
    </mock-text>
  );

  return {
    __esModule: true,
    default: MockSvg,
    Circle: MockCircle,
    Text: MockText,
  };
});

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "mock-svg": any;
      "mock-circle": any;
      "mock-text": any;
    }
  }
}

describe("<RestPieChart />", () => {
  const workout: ClimbingWorkout = {
    id: 1,
    date: String(Date.now()),
    timestamp: "2023-10-01T12:00:00Z",
    climb_time: 3600, // 1 hour
    rest_time: 1800, // 30 minutes
    warmup_time: 0,
  };

  it("renders the pie chart and labels correctly", () => {
    render(<RestPieChart workout={workout} />);

    const circles = screen.getAllByTestId("mock-circle");
    const texts = screen.getAllByTestId("mock-text");

    expect(circles.length).toBe(2);
    expect(texts.length).toBe(2);

    expect(circles[0].props.stroke).toBe("#166534");
    expect(circles[1].props.stroke).toBe("#B45309");

    expect(texts[0].props.children).toEqual(["Rest:", " ", "33", "%"]);
    expect(texts[1].props.children).toEqual(["Climb:", " ", "67", "%"]);
  });

  it("renders 'No workout to display.' when workout is undefined", () => {
    render(<RestPieChart workout={undefined} />);
    expect(screen.getByText("No workout to display.")).toBeTruthy();
  });
});
