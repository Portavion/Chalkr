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

  it("renders the modal and its components", async () => {
    expect(await screen.findByText("New route")).toBeTruthy();
    expect(await screen.findByText("Grade: ")).toBeTruthy();
    expect(await screen.findByText("Colour: ")).toBeTruthy();
    expect(await screen.findByText("Style: ")).toBeTruthy();
    expect(await screen.findByText("Holds: ")).toBeTruthy();
    expect(
      await screen.findByText("Was your attempt successful?"),
    ).toBeTruthy();
  });

  it("logs successful ascent", async () => {
    const successButton = await screen.findByTestId("successful-button");
    fireEvent.press(successButton);
    expect(Haptics.notificationAsync).toHaveBeenCalled();
    expect(handleAscentLog).toHaveBeenCalledWith(true);
  });

  it("logs unsuccessful ascent", async () => {
    const failureButton = await screen.findByTestId("unsuccessful-button");
    fireEvent.press(failureButton);
    expect(Haptics.notificationAsync).toHaveBeenCalled();
    expect(handleAscentLog).toHaveBeenCalledWith(false);
  });
});
