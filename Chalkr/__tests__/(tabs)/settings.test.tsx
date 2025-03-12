import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import AboutScreen from "@/app/(tabs)/settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import useWorkout from "@/hooks/useWorkout";
import * as Haptics from "expo-haptics";

jest.mock("@react-native-async-storage/async-storage", () => ({
  removeItem: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  signOut: jest.fn(),
  FIREBASE_AUTH: {},
}));

jest.mock("@/hooks/useWorkout", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("expo-haptics", () => ({
  selectionAsync: jest.fn(),
}));

jest.mock("expo-router", () => ({
  Link: ({ children, ...props }: any) => (
    <mock-link {...props}>{children}</mock-link>
  ),
}));
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "mock-link": any;
    }
  }
}
describe("<AboutScreen />", () => {
  const mockResetDb = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useWorkout as jest.Mock).mockReturnValue({
      resetDb: mockResetDb,
    });
  });

  it("renders settings screen elements", () => {
    render(<AboutScreen />);
    expect(screen.getByText("Settings screen")).toBeTruthy();
    expect(screen.getByText("Sign Out")).toBeTruthy();
    expect(screen.getByText("Reset DB")).toBeTruthy();
    expect(screen.getByText("View all routes")).toBeTruthy();
  });

  it("calls signOut and AsyncStorage.removeItem on sign out button press", async () => {
    render(<AboutScreen />);
    fireEvent.press(screen.getByText("Sign Out"));

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@user");
      expect(signOut).toHaveBeenCalledWith(FIREBASE_AUTH);
    });
  });

  it("calls resetDb on reset DB button press", () => {
    render(<AboutScreen />);
    fireEvent.press(screen.getByText("Reset DB"));
    expect(mockResetDb).toHaveBeenCalled();
  });

  it("calls Haptics.selectionAsync on TouchableOpacity press", () => {
    render(<AboutScreen />);
    fireEvent.press(screen.getByText("View all routes"));
    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });
});
