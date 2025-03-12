import { render, screen, fireEvent } from "@testing-library/react-native";
import ColourSelector from "@/components/logWorkouts/ColourSelector";

import { ActionSheetIOS, ActionSheetIOSOptions } from "react-native";
import * as Haptics from "expo-haptics";
import { GetByQuery } from "@testing-library/react-native/build/queries/make-queries";
import {
  TextMatch,
  TextMatchOptions,
} from "@testing-library/react-native/build/matches";
import { CommonQueryOptions } from "@testing-library/react-native/build/queries/options";

describe("<ClimbingStyleSelector />", () => {
  let getByText: GetByQuery<TextMatch, CommonQueryOptions & TextMatchOptions>;
  let setRouteColour: jest.Mock<any, any, any>;
  let showActionSheetSpy: jest.SpyInstance<
    void,
    [options: ActionSheetIOSOptions, callback: (buttonIndex: number) => void],
    any
  >;
  beforeEach(() => {
    const routeColour = "red";
    setRouteColour = jest.fn();
    showActionSheetSpy = jest.spyOn(
      ActionSheetIOS,
      "showActionSheetWithOptions",
    );
    getByText = render(
      <ColourSelector
        setRouteColour={setRouteColour}
        routeColour={routeColour}
      />,
    ).getByText;
  });

  test("renders the colour label and colour value", () => {
    getByText("Colour: ");
    getByText("red");
  });

  test("opens the action sheet when the button is pressed", () => {
    const colourButton = screen.getByTestId("colour-button");
    fireEvent.press(colourButton);
    expect(showActionSheetSpy).toHaveBeenCalled();
    expect(Haptics.notificationAsync).toHaveBeenCalled();
  });

  test("calls setRouteColour with the correct colour when an option is selected", () => {
    showActionSheetSpy.mockImplementationOnce((options, callback) => {
      callback(3);
    });

    const colourButton = screen.getByTestId("colour-button");
    fireEvent.press(colourButton);
    expect(setRouteColour).toHaveBeenCalledWith("green");
  });

  test("calls setRouteColour with '' when the last option is selected", () => {
    showActionSheetSpy.mockImplementationOnce((options, callback) => {
      callback(11); // Simulate selecting "Dyno" (index 2)
    });

    const colourButton = screen.getByTestId("colour-button");
    fireEvent.press(colourButton);
    expect(setRouteColour).toHaveBeenCalledWith("");
  });
});
