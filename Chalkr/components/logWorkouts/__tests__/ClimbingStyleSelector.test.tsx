import { render, screen, fireEvent } from "@testing-library/react-native";
import ClimbingStyleSelector from "@/components/logWorkouts/ClimbingStyleSelector";

import { ActionSheetIOS } from "react-native";
import * as Haptics from "expo-haptics";

describe("<ClimbingStyleSelector />", () => {
  test("it renders the style label and climbing style value", () => {
    const selectedStyle = "board";
    const setSelectedStyle = jest.fn();
    const { getByText } = render(
      <ClimbingStyleSelector
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
      />,
    );

    getByText("Style: ");
    getByText("board");
  });

  test("it opens the action sheet when the button is pressed", () => {
    const selectedStyle = "board";
    const setSelectedStyle = jest.fn();
    const showActionSheetSpy = jest.spyOn(
      ActionSheetIOS,
      "showActionSheetWithOptions",
    );

    render(
      <ClimbingStyleSelector
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
      />,
    );
    const climbingStyleButton = screen.getByTestId("climbing-style-button");
    fireEvent.press(climbingStyleButton);
    expect(showActionSheetSpy).toHaveBeenCalled();
    expect(Haptics.notificationAsync).toHaveBeenCalled();
  });

  test("calls setSelectedStyle with the correct style when an option is selected", () => {
    const selectedStyle = "Board";
    const setSelectedStyle = jest.fn();

    const showActionSheetSpy = jest.spyOn(
      ActionSheetIOS,
      "showActionSheetWithOptions",
    );

    showActionSheetSpy.mockImplementationOnce((options, callback) => {
      callback(2); // Simulate selecting "Dyno" (index 2)
    });

    render(
      <ClimbingStyleSelector
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
      />,
    );
    const climbingStyleButton = screen.getByTestId("climbing-style-button");
    fireEvent.press(climbingStyleButton);
    expect(setSelectedStyle).toHaveBeenCalledWith("Dyno");
  });

  test("calls setSelectedStyle with 'Other' when the last option is selected", () => {
    const selectedStyle = "Board";
    const setSelectedStyle = jest.fn();

    const showActionSheetSpy = jest.spyOn(
      ActionSheetIOS,
      "showActionSheetWithOptions",
    );

    showActionSheetSpy.mockImplementationOnce((options, callback) => {
      callback(6); // Simulate selecting "Dyno" (index 2)
    });

    render(
      <ClimbingStyleSelector
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
      />,
    );
    const climbingStyleButton = screen.getByTestId("climbing-style-button");
    fireEvent.press(climbingStyleButton);
    expect(setSelectedStyle).toHaveBeenCalledWith("Other");
  });
});
