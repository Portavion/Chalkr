import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import LoggingModal from "@/components/logWorkouts/LoggingModal";
import * as Haptics from "expo-haptics";

jest.mock("expo-haptics");

describe("<LoggingModal />", () => {
  const handleAscentLog = jest.fn();
  const setGrade = jest.fn();
  const setSelectedStyle = jest.fn();
  const setSelectedHoldTypes = jest.fn();
  const setRouteColour = jest.fn();
  const setRouteId = jest.fn();
  const setRouteImg = jest.fn();
  const setRouteThumbnail = jest.fn();
  const setRoutes = jest.fn();
  let getByText;

  beforeEach(() => {
    handleAscentLog.mockClear();
    setGrade.mockClear();
    setSelectedStyle.mockClear();
    setSelectedHoldTypes.mockClear();
    setRouteColour.mockClear();
    getByText = render(
      <LoggingModal
        handleAscentLog={handleAscentLog}
        showModal={true}
        routeId={1}
        routeImg="mockImage.jpg"
        routeThumbnail="mockThumbnail.jpg"
        grade={5}
        setGrade={setGrade}
        selectedStyle="Board"
        setSelectedStyle={setSelectedStyle}
        setRouteId={setRouteId}
        setRouteImg={setRouteImg}
        setRoutes={setRoutes}
        setRouteThumbnail={setRouteThumbnail}
        selectedHoldTypes={["Crimp"]}
        setSelectedHoldTypes={setSelectedHoldTypes}
        setRouteColour={setRouteColour}
        routeColour="red"
      />,
    );
  });

  test("renders the modal and its components", () => {
    expect(screen.getByText("New route")).toBeTruthy();
    expect(screen.getByText("Grade: ")).toBeTruthy();
    expect(screen.getByText("Colour: ")).toBeTruthy();
    expect(screen.getByText("Style: ")).toBeTruthy();
    expect(screen.getByText("Holds: ")).toBeTruthy();
    expect(screen.getByText("Was your attempt successful?")).toBeTruthy();
  });

  test("logs successful ascent", () => {
    const successButton = screen.getByTestId("successful-button");
    fireEvent.press(successButton);
    expect(Haptics.notificationAsync).toHaveBeenCalled();
    expect(handleAscentLog).toHaveBeenCalledWith(true);
  });

  test("logs unsuccessful ascent", () => {
    const failureButton = screen.getByTestId("unsuccessful-button");
    fireEvent.press(failureButton);
    expect(Haptics.notificationAsync).toHaveBeenCalled();
    expect(handleAscentLog).toHaveBeenCalledWith(false);
  });
});
