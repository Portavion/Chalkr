import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import RecordButton from "../RecordButton";

describe("<RecordButton />", () => {
  let getByText;
  beforeEach(() => {
    getByText = render(
      <RecordButton handleRecord={() => {}} isClimbing={false} />,
    ).getByText;
  });

  test("it renders the correct icon when isClimbing is false", () => {
    expect(screen.getByTestId("radio-button-on")).toBeTruthy();
  });

  test("it renders the correct icons when isClimbing is true", () => {
    render(<RecordButton handleRecord={() => {}} isClimbing={true} />);
    expect(screen.getByTestId("radio-button-off")).toBeTruthy();
    expect(screen.getByTestId("square-icon")).toBeTruthy();
  });

  test("it calls handleRecord when pressed", () => {
    const handleRecord = jest.fn();
    render(<RecordButton handleRecord={handleRecord} isClimbing={false} />);
    const button = screen.getByTestId("record-button");
    fireEvent.press(button);
    expect(handleRecord).toHaveBeenCalled();
  });
});
