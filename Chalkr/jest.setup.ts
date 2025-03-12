// jest.setup.js
jest.mock("@/hooks/useRoutes", () => ({
  __esModule: true,
  default: () => ({
    fetchAllRoutes: jest.fn().mockResolvedValue([
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

jest.mock("@/hooks/useAscents", () => ({
  __esModule: true,
  default: () => ({
    fetchAscentsStats: jest.fn().mockResolvedValue({
      ascentCount: 3,
      ascentSuccessCount: 1,
      ascentFailCount: 2,
    }),
  }),
}));

jest.mock("@/hooks/useWorkout", () => ({
  __esModule: true,
  default: () => ({
    deleteWorkout: jest.fn().mockResolvedValue(true),
    fetchUniqueWorkout: jest.fn().mockResolvedValue([
      {
        timestamp: "2023-10-01T12:00:00Z",
        climb_time: 3600, // 1 hour
        rest_time: 1800, // 30 minutes
      },
    ]),
  }),
}));

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "Light",
    Heavy: "Heavy",
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

jest.mock("drizzle-orm/expo-sqlite", () => ({
  drizzle: jest.fn(() => ({
    selectDistinct: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    and: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    inArray: jest.fn().mockReturnThis(),
    count: jest.fn().mockReturnThis(),
  })),
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

jest.mock("expo-font", () => {
  const module: typeof import("expo-font") = {
    ...jest.requireActual("expo-font"),
    isLoaded: jest.fn(() => true),
  };

  return module;
});
