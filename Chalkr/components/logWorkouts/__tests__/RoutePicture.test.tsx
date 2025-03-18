import React, { act, useReducer } from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import RoutePicture from "../RoutePicture";
import { GradeColour, RouteColors } from "@/constants/Colors";
import { WorkoutState, workoutReducer } from "@/reducers/WorkoutReducer";
import { WorkoutContext } from "@/context/WorkoutContext";

describe("<RoutePicture />", () => {
  const mockRouteImg = "mockImage.jpg";
  const mockRouteThumbnail = "mockThumbnail.jpg";

  const mockPickPhotoAsync = jest.fn().mockResolvedValue({
    imageFullPath: "newImage.jpg",
    thumbnailFullPath: "newThumbnail.jpg",
  });

  jest.spyOn(require("@/hooks/usePhoto"), "default").mockReturnValue({
    pickPhotoAsync: mockPickPhotoAsync,
  });

  beforeEach(() => {
    const initialState: WorkoutState = {
      grade: 0,
      workoutId: undefined,
      selectedStyle: "board",
      selectHoldTypes: [],
      isClimbing: false,
      routes: undefined,
      routeThumbnail: mockRouteThumbnail,
      routeColour: "",
      showModal: false,
      refresh: false,
      routeImg: mockRouteImg,
      routeId: undefined,
    };

    function TestComponent() {
      const [state, dispatch] = useReducer(workoutReducer, initialState);
      return (
        <WorkoutContext.Provider value={{ state, dispatch }}>
          <RoutePicture canCreate={true} />
        </WorkoutContext.Provider>
      );
    }
    render(<TestComponent />);
  });

  it("renders the component with the correct image and buttons", () => {
    const image = screen.getByTestId("route-image");
    expect(image).toBeTruthy();
    expect(image.props.source).toStrictEqual([{ uri: mockRouteImg }]);

    expect(screen.getByTestId("select-route-button")).toBeTruthy();
    expect(screen.getByTestId("new-route-button")).toBeTruthy();
  });

  it("sets the correct border color based on grade", () => {
    const imageContainer = screen.getByTestId("route-image-container");
    expect(imageContainer.props.style.borderColor).toBe(GradeColour[0]);
  });

  it("sets the correct border color based on routeColour", () => {
    const initialState: WorkoutState = {
      grade: 0,
      workoutId: undefined,
      selectedStyle: "board",
      selectHoldTypes: [],
      isClimbing: false,
      routes: undefined,
      routeThumbnail: mockRouteThumbnail,
      routeColour: "red",
      showModal: false,
      refresh: false,
      routeImg: mockRouteImg,
      routeId: undefined,
    };

    function TestComponent() {
      const [state, dispatch] = useReducer(workoutReducer, initialState);
      return (
        <WorkoutContext.Provider value={{ state, dispatch }}>
          <RoutePicture canCreate={true} />
        </WorkoutContext.Provider>
      );
    }
    render(<TestComponent />);
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
    const image = screen.getByTestId("route-image");
    expect(image.props.source).toStrictEqual([{ uri: "newImage.jpg" }]);
  });

  it("calls handleTakePhoto when 'New photo' button is pressed (canCreate=false)", async () => {
    const initialState: WorkoutState = {
      grade: 0,
      workoutId: undefined,
      selectedStyle: "board",
      selectHoldTypes: [],
      isClimbing: false,
      routes: undefined,
      routeThumbnail: mockRouteThumbnail,
      routeColour: "red",
      showModal: false,
      refresh: false,
      routeImg: mockRouteImg,
      routeId: undefined,
    };
    function TestComponent() {
      const [state, dispatch] = useReducer(workoutReducer, initialState);
      return (
        <WorkoutContext.Provider value={{ state, dispatch }}>
          <RoutePicture canCreate={false} />
        </WorkoutContext.Provider>
      );
    }
    render(<TestComponent />);
    const newPhotoButton = screen.getByTestId("new-photo-button");

    await act(async () => {
      fireEvent.press(newPhotoButton);
    });

    expect(mockPickPhotoAsync).toHaveBeenCalled();
  });
});
