import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import Routes from "@/app/routeView/routes";
import useRoutes from "@/hooks/useRoutes";
import * as Haptics from "expo-haptics";

jest.mock("@/hooks/useRoutes", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("expo-image", () => ({
  Image: ({ source, style, ...props }: any) => (
    <mock-image source={source} style={style} {...props} />
  ),
}));

jest.mock("expo-blur", () => ({
  BlurView: ({ children, ...props }: any) => (
    <mock-blurview {...props}>{children}</mock-blurview>
  ),
}));

jest.mock("@/components/logWorkouts/GradeSelector", () => ({
  __esModule: true,
  default: ({ grade, setGrade }: any) => (
    <mock-grade-selector grade={grade} setGrade={setGrade} />
  ),
}));

jest.mock("@/components/logWorkouts/ColourSelector", () => ({
  __esModule: true,
  default: ({ routeColour, setRouteColour }: any) => (
    <mock-colour-selector
      routeColour={routeColour}
      setRouteColour={setRouteColour}
    />
  ),
}));

jest.mock("@/components/logWorkouts/ClimbingStyleSelector", () => ({
  __esModule: true,
  default: ({ selectedStyle, setSelectedStyle }: any) => (
    <mock-climbing-style-selector
      selectedStyle={selectedStyle}
      setSelectedStyle={setSelectedStyle}
    />
  ),
}));

jest.mock("@/components/logWorkouts/HoldTypeSelector", () => ({
  __esModule: true,
  default: ({ selectedHoldTypes, setSelectedHoldTypes }: any) => (
    <mock-hold-type-selector
      selectedHoldTypes={selectedHoldTypes}
      setSelectedHoldTypes={setSelectedHoldTypes}
    />
  ),
}));

jest.mock("@/components/logWorkouts/RoutePicture", () => ({
  __esModule: true,
  default: ({
    routeImg,
    routeThumbnail,
    routeId,
    setRouteId,
    setRouteImg,
    setRoutes,
    setRouteThumbnail,
    setGrade,
    setStyle,
    setSelectedHoldTypes,
    grade,
    routeColour,
    setRouteColour,
    canCreate,
  }: any) => (
    <mock-route-picture
      routeImg={routeImg}
      routeThumbnail={routeThumbnail}
      routeId={routeId}
      setRouteId={setRouteId}
      setRouteImg={setRouteImg}
      setRoutes={setRoutes}
      setRouteThumbnail={setRouteThumbnail}
      setGrade={setGrade}
      setStyle={setStyle}
      setSelectedHoldTypes={setSelectedHoldTypes}
      grade={grade}
      routeColour={routeColour}
      setRouteColour={setRouteColour}
      canCreate={canCreate}
    />
  ),
}));

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "mock-image": any;
      "mock-blurview": any;
      "mock-grade-selector": any;
      "mock-colour-selector": any;
      "mock-climbing-style-selector": any;
      "mock-hold-type-selector": any;
      "mock-route-picture": any;
    }
  }
}

describe("<Routes />", () => {
  const mockRoutes = [
    {
      id: 1,
      grade: 3,
      color: "red",
      thumbnail_url: "url1",
      photo_url: "photo1",
      hold_types: ["crimp"],
      style: "sport",
    },
    {
      id: 2,
      grade: 5,
      color: "blue",
      thumbnail_url: "url2",
      photo_url: "photo2",
      hold_types: ["sloper"],
      style: "trad",
    },
  ];

  const mockFetchAllRoutes = jest.fn();
  const mockLogRoute = jest.fn();
  const mockDeleteRoute = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchAllRoutes.mockResolvedValue(mockRoutes);
    (useRoutes as jest.Mock).mockReturnValue({
      fetchAllRoutes: mockFetchAllRoutes,
      logRoute: mockLogRoute,
      deleteRoute: mockDeleteRoute,
    });
  });

  it("renders routes from fetchAllRoutes", async () => {
    render(<Routes />);
    expect(mockFetchAllRoutes).toHaveBeenCalled();
    expect(screen.findByText("V3")).toBeTruthy();
    expect(screen.findByText("V5")).toBeTruthy();
  });

  it("opens modal on route press", async () => {
    render(<Routes />);
    await waitFor(() => {
      fireEvent.press(screen.getByText("V3"));
    });
    expect(screen.findByTestId("dialog")).toBeTruthy();
  });

  it("updates route and closes modal on update press", async () => {
    render(<Routes />);
    await waitFor(() => {
      fireEvent.press(screen.getByText("V3"));
      fireEvent.press(screen.getByText("Update"));
      expect(mockLogRoute).toHaveBeenCalled();
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("deletes route and closes modal on delete press", async () => {
    render(<Routes />);
    await waitFor(() => {
      fireEvent.press(screen.getByText("V3"));
      fireEvent.press(screen.getByText("Delete"));
      expect(mockDeleteRoute).toHaveBeenCalled();
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("calls Haptics.notificationAsync on route press", async () => {
    render(<Routes />);
    await waitFor(() => {
      fireEvent.press(screen.getByText("V3"));
      expect(Haptics.notificationAsync).toHaveBeenCalled();
    });
  });

  it("calls Haptics.notificationAsync on update press", async () => {
    render(<Routes />);
    await waitFor(() => {
      fireEvent.press(screen.getByText("V3"));
      fireEvent.press(screen.getByText("Update"));
      expect(Haptics.notificationAsync).toHaveBeenCalledTimes(2);
    });
  });

  it("calls Haptics.notificationAsync on delete press", async () => {
    render(<Routes />);
    await waitFor(() => {
      fireEvent.press(screen.getByText("V3"));
      fireEvent.press(screen.getByText("Delete"));
      expect(Haptics.notificationAsync).toHaveBeenCalledTimes(2);
    });
  });
});
