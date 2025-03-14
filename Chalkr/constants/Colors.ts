/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const GradeColour: { [key: number]: string } = {
  0: "black",
  1: "#0084d1",
  2: "#0a6227",
  3: "#c800de",
  4: "ghostwhite",
  5: "#6eb9bf",
  6: "#6eb9bf",
  7: "#6eb9bf",
};

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const RouteColors: Record<RouteColour, string> = {
  VB: "#FCEC45", // Example: Yellow-ish
  pink: "#FF69B4", // Pink
  blue: "#0084d1", // Blue
  green: "#008000", // Green
  purple: "#c800de", // Purple
  white: "ghostwhite", // White
  teal: "#6eb9bf", // Teal
  black: "#000000", // Black
  red: "tomato", // Red
  yellow: "#FFFF00", // Yellow
  orange: "#FFA500", // Orange
  "": "",
};
