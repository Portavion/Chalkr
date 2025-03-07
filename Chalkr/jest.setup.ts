// jest.setup.js
jest.mock("@/hooks/useWorkoutData", () => ({
  __esModule: true,
  default: () => ({
    fetchRoutes: jest.fn().mockResolvedValue([
      {
        id: 1,
        name: "Route 1",
        photo_url: "mockPhoto1.jpg",
        thumbnail_url: "mockThumbnail1.jpg",
        grade: 5,
        style: "Slab",
        hold_types: ["Crimp", "Sloper"],
        color: "red",
      },
      {
        id: 2,
        name: "Route 2",
        photo_url: "mockPhoto2.jpg",
        thumbnail_url: "mockThumbnail2.jpg",
        grade: 6,
        style: "Overhang",
        hold_types: ["Pinch", "Jug"],
        color: "blue",
      },
    ]),
  }),
}));
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "Light",
  },
  selectionAsync: jest.fn(),
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
}));

jest.mock(
  "react-native/Libraries/ActionSheetIOS/NativeActionSheetManager",
  () => ({
    showActionSheetWithOptions: jest.fn(),
  }),
);

jest.mock("@/hooks/usePhoto", () => ({
  __esModule: true, // Add this line
  default: () => ({
    pickPhotoAsync: jest.fn(),
  }),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("expo-sqlite", () => ({
  openDatabaseSync: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signInWithCredential: jest.fn(),
  signOut: jest.fn(),
}));
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

jest.mock("firebase/analytics", () => ({
  getAnalytics: jest.fn(),
}));

jest.mock("@rneui/themed", () => ({
  Button: jest.fn(),
}));

jest.mock("expo-font", () => {
  const module: typeof import("expo-font") = {
    ...jest.requireActual("expo-font"),
    isLoaded: jest.fn(() => true),
  };

  return module;
});
