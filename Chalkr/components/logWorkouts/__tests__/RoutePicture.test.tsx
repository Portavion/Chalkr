import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import RoutePicture from "../RoutePicture";
import { GradeColour, RouteColors } from "@/constants/Colors";

describe("<RoutePicture />", () => {
  const mockRouteId = 1;
  const mockRouteImg = "mockImage.jpg";
  const mockRouteThumbnail = "mockThumbnail.jpg";
  const setRouteId = jest.fn();
  const setRouteImg = jest.fn();
  const setRouteThumbnail = jest.fn();
  const setRoutes = jest.fn();
  const setStyle = jest.fn();
  const setGrade = jest.fn();
  const setSelectedHoldTypes = jest.fn();
  const setRouteColour = jest.fn();

  const mockPickPhotoAsync = jest.fn().mockResolvedValue({
    imageFullPath: "newImage.jpg",
    thumbnailFullPath: "newThumbnail.jpg",
  });

  jest.spyOn(require("@/hooks/usePhoto"), "default").mockReturnValue({
    pickPhotoAsync: mockPickPhotoAsync,
  });

  beforeEach(() => {
    try {
      render(
        <RoutePicture
          routeId={mockRouteId}
          setRouteId={setRouteId}
          routeImg={mockRouteImg}
          setRouteImg={setRouteImg}
          routeThumbnail={mockRouteThumbnail}
          setRouteThumbnail={setRouteThumbnail}
          setRoutes={setRoutes}
          setStyle={setStyle}
          setGrade={setGrade}
          grade={5}
          setSelectedHoldTypes={setSelectedHoldTypes}
          canCreate={true}
          routeColour="red"
          setRouteColour={setRouteColour}
        />,
      );
    } catch (error) {
      console.error("Error rendering RoutePicture:", error);
    }
  });

  it("renders the component with the correct image and buttons", () => {
    const image = screen.getByTestId("route-image");
    expect(image).toBeTruthy();
    expect(image.props.source).toStrictEqual([{ uri: mockRouteImg }]);

    expect(screen.getByTestId("select-route-button")).toBeTruthy();
    expect(screen.getByTestId("new-route-button")).toBeTruthy();
  });

  it("sets the correct border color based on grade", () => {
    render(
      <RoutePicture
        routeId={mockRouteId}
        setRouteId={setRouteId}
        routeImg={mockRouteImg}
        setRouteImg={setRouteImg}
        routeThumbnail={mockRouteThumbnail}
        setRouteThumbnail={setRouteThumbnail}
        setRoutes={setRoutes}
        setStyle={setStyle}
        setGrade={setGrade}
        grade={2}
        setSelectedHoldTypes={setSelectedHoldTypes}
        canCreate={true}
        routeColour=""
        setRouteColour={setRouteColour}
      />,
    ).getByText;

    const imageContainer = screen.getByTestId("route-image-container");
    expect(imageContainer.props.style.borderColor).toBe(GradeColour[2]);
  });

  it("sets the correct border color based on routeColour", () => {
    const imageContainer = screen.getByTestId("route-image-container");
    expect(imageContainer.props.style.borderColor).toBe(RouteColors["red"]);
  });

  it("opens the route selection modal", async () => {
    const selectRouteButton = screen.getByTestId("select-route-button");
    await act(async () => {
      fireEvent.press(selectRouteButton);
    });

    expect(screen.getByText("Select an existing route"));
  });

  it("calls handleTakePhoto and updates state when 'New route' button is pressed", async () => {
    const newRouteButton = screen.getByTestId("new-route-button");
    await act(async () => {
      fireEvent.press(newRouteButton);
    });

    expect(mockPickPhotoAsync).toHaveBeenCalled();
    expect(setRouteId).toHaveBeenCalledWith(0);
    expect(setRouteImg).toHaveBeenCalledWith("newImage.jpg");
    expect(setRouteThumbnail).toHaveBeenCalledWith("newThumbnail.jpg");
  });

  it("calls handleTakePhoto when 'New photo' button is pressed (canCreate=false)", async () => {
    render(
      <RoutePicture
        routeId={mockRouteId}
        setRouteId={setRouteId}
        routeImg={mockRouteImg}
        setRouteImg={setRouteImg}
        routeThumbnail={mockRouteThumbnail}
        setRouteThumbnail={setRouteThumbnail}
        setRoutes={setRoutes}
        setStyle={setStyle}
        setGrade={setGrade}
        grade={5}
        setSelectedHoldTypes={setSelectedHoldTypes}
        canCreate={false}
        routeColour="red"
        setRouteColour={setRouteColour}
      />,
    );

    const newPhotoButton = screen.getByTestId("new-photo-button");

    await act(async () => {
      fireEvent.press(newPhotoButton);
    });

    expect(mockPickPhotoAsync).toHaveBeenCalled();
  });
});
