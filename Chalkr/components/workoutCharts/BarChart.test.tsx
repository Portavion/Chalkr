import React from "react";
import { render, screen } from "@testing-library/react-native";
import BarChart from "@/components/workoutCharts/BarChart";

jest.mock("react-native-svg", () => {
  const React = require("react");
  const MockSvg = ({ children, ...props }: { children: React.ReactNode }) => (
    <mock-svg testID="mock-svg" {...props}>
      {children}
    </mock-svg>
  );
  const MockRect = ({ ...props }: any) => (
    <mock-rect testID="mock-rect" {...props} />
  );
  const MockText = ({ children, ...props }: { children: React.ReactNode }) => (
    <mock-text testID="mock-text" {...props}>
      {children}
    </mock-text>
  );

  return {
    __esModule: true,
    default: MockSvg,
    Rect: MockRect,
    Text: MockText,
  };
});
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "mock-svg": any;
      "mock-rect": any;
      "mock-text": any;
    }
  }
}
describe("<BarChart />", () => {
  const ascents: Ascent[] = [
    {
      ascentId: 1,
      routeId: 1,
      ascentTime: 1,
      restTime: 1,
      isSuccess: true,
      name: null,
      grade: 1,
      area: null,
      description: null,
      style: "test",
      photo_url: "test",
      thumbnail_url: "test",
      color: null,
      hold_types: [],
    },
    {
      ascentId: 2,
      routeId: 2,
      ascentTime: 1,
      restTime: 1,
      isSuccess: true,
      name: null,
      grade: 3, // Changed to 3
      area: null,
      description: null,
      style: "test",
      photo_url: "test",
      thumbnail_url: "test",
      color: null,
      hold_types: [],
    },
    {
      ascentId: 3,
      routeId: 3,
      ascentTime: 1,
      restTime: 1,
      isSuccess: true,
      name: null,
      grade: 2, // Changed to 2
      area: null,
      description: null,
      style: "test",
      photo_url: "test",
      thumbnail_url: "test",
      color: null,
      hold_types: [],
    },
  ];

  it("renders bars and grade labels correctly", () => {
    render(<BarChart ascents={ascents} />);

    expect(screen.getAllByTestId("mock-rect").length).toBe(3);

    expect(screen.getAllByTestId("mock-text").length).toBe(3);

    const rects = screen.getAllByTestId("mock-rect");
    const texts = screen.getAllByTestId("mock-text");

    expect(rects[0].props.height).toBeGreaterThan(0);
    expect(texts[0].props.children).toStrictEqual(["V", "1"]);

    expect(rects[1].props.height).toBeGreaterThan(0);
    expect(texts[1].props.children).toStrictEqual(["V", "3"]);

    expect(rects[2].props.height).toBeGreaterThan(0);
    expect(texts[2].props.children).toStrictEqual(["V", "2"]);
  });

  it("renders 'No ascents to display.' when ascents is empty", () => {
    render(<BarChart ascents={[]} />);

    expect(screen.getByText("No ascents to display.")).toBeTruthy();
  });

  it("renders 'No ascents to display.' when ascents is null", () => {
    render(<BarChart ascents={[]} />);

    expect(screen.getByText("No ascents to display.")).toBeTruthy();
  });
});
