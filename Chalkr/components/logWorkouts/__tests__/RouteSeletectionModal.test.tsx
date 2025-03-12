import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react-native";
import RouteSelectionModal from "../RouteSelectionModal";

describe("<RouteSelectionModal />", () => {
  const setShowSelectionModal = jest.fn();
  const setRouteId = jest.fn();
  const setRouteImg = jest.fn();
  const setRouteThumbnail = jest.fn();
  const setGrade = jest.fn();
  const setStyle = jest.fn();
  const setSelectedHoldTypes = jest.fn();
  const setRouteColour = jest.fn();

  // Clean up after each test
  afterEach(() => {
    cleanup();
  });

  it("renders the modal and its components", async () => {
    render(
      <RouteSelectionModal
        showSelectionModal={true}
        setShowSelectionModal={setShowSelectionModal}
        setRouteId={setRouteId}
        setRouteImg={setRouteImg}
        setRouteThumbnail={setRouteThumbnail}
        setGrade={setGrade}
        setStyle={setStyle}
        setSelectedHoldTypes={setSelectedHoldTypes}
        routeColour="red"
        setRouteColour={setRouteColour}
      />,
    );
    expect(await screen.findByText("Select an existing route")).toBeTruthy();
    expect(await screen.findByTestId("cancel-button")).toBeTruthy();
  });

  it("fetches and renders routes correctly", async () => {
    render(
      <RouteSelectionModal
        showSelectionModal={true}
        setShowSelectionModal={setShowSelectionModal}
        setRouteId={setRouteId}
        setRouteImg={setRouteImg}
        setRouteThumbnail={setRouteThumbnail}
        setGrade={setGrade}
        setStyle={setStyle}
        setSelectedHoldTypes={setSelectedHoldTypes}
        routeColour="red"
        setRouteColour={setRouteColour}
      />,
    );

    expect(await screen.findByText("V5")).toBeTruthy();
    expect(await screen.findByText("V6")).toBeTruthy();
  });

  it("selects a route and updates state", async () => {
    render(
      <RouteSelectionModal
        showSelectionModal={true}
        setShowSelectionModal={setShowSelectionModal}
        setRouteId={setRouteId}
        setRouteImg={setRouteImg}
        setRouteThumbnail={setRouteThumbnail}
        setGrade={setGrade}
        setStyle={setStyle}
        setSelectedHoldTypes={setSelectedHoldTypes}
        routeColour="red"
        setRouteColour={setRouteColour}
      />,
    );
    const route1Grade = await screen.findByText("V5");
    fireEvent.press(route1Grade);

    expect(setRouteId).toHaveBeenCalledWith(1);
    expect(setRouteImg).toHaveBeenCalledWith("mockPhoto1.jpg");
    expect(setRouteThumbnail).toHaveBeenCalledWith("mockThumbnail1.jpg");
    expect(setGrade).toHaveBeenCalledWith(5);
    expect(setStyle).toHaveBeenCalledWith("Slab");
    expect(setSelectedHoldTypes).toHaveBeenCalledWith(["Crimp", "Sloper"]);
    expect(setRouteColour).toHaveBeenCalledWith("red");
    expect(setShowSelectionModal).toHaveBeenCalledWith(false);
  });

  it("closes the modal when 'Cancel' is pressed", async () => {
    render(
      <RouteSelectionModal
        showSelectionModal={true}
        setShowSelectionModal={setShowSelectionModal}
        setRouteId={setRouteId}
        setRouteImg={setRouteImg}
        setRouteThumbnail={setRouteThumbnail}
        setGrade={setGrade}
        setStyle={setStyle}
        setSelectedHoldTypes={setSelectedHoldTypes}
        routeColour="red"
        setRouteColour={setRouteColour}
      />,
    );
    const cancelButton = await screen.findByTestId("cancel-button");
    fireEvent.press(cancelButton);

    expect(setShowSelectionModal).toHaveBeenCalledWith(false);
  });
});
