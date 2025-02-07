// jest.setup.js
// jest.mock("expo-font", () => ({
//   loadAsync: jest.fn(() => Promise.resolve()),
//   // ... other mocked functions
// }));

jest.mock("expo-font", () => {
  const module: typeof import("expo-font") = {
    ...jest.requireActual("expo-font"),
    isLoaded: jest.fn(() => true),
  };

  return module;
});
