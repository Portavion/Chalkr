import { render } from "@testing-library/react-native";

import Workout from "@/app/(tabs)/workout";

describe("Workout Recording", () => {
  test("Workout components render correctly", () => {
    const { getByText } = render(<Workout></Workout>);
    getByText("Select route");
    getByText("New route");
    getByText("Total climbs");
    getByText("Completed climbs");
    getByText("Grade:");
    getByText("Colour:");
    getByText("Style:");
    getByText("Holds: ");
    getByText("Total workout:");
    getByText("Resting:");
  });
});
