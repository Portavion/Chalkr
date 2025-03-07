import { render, screen, fireEvent } from "@testing-library/react-native";
import HoldTypeSelector from "@/components/logWorkouts/HoldTypeSelector";

import { ActionSheetIOS, ActionSheetIOSOptions } from "react-native";
import { GetByQuery } from "@testing-library/react-native/build/queries/make-queries";
import {
  TextMatch,
  TextMatchOptions,
} from "@testing-library/react-native/build/matches";
import { CommonQueryOptions } from "@testing-library/react-native/build/queries/options";

describe("<HoldTypeSelector />", () => {
  let getByText: GetByQuery<TextMatch, CommonQueryOptions & TextMatchOptions>;
  let setHoldType: jest.Mock<any, any, any>;
  let showActionSheetSpy: jest.SpyInstance<
    void,
    [options: ActionSheetIOSOptions, callback: (buttonIndex: number) => void],
    any
  >;
  beforeEach(() => {
    const holdType: HoldType[] = ["Crimp", "Slopper", "Pocket"];
    setHoldType = jest.fn();
    showActionSheetSpy = jest.spyOn(
      ActionSheetIOS,
      "showActionSheetWithOptions",
    );
    getByText = render(
      <HoldTypeSelector
        setSelectedHoldTypes={setHoldType}
        selectedHoldTypes={holdType}
      />,
    ).getByText;
  });

  test("it renders the hold type label, two hold values and ...", () => {
    getByText("Holds: ");
    getByText("Crimp, Slopper, ...");
  });

  test("it opens and closes the modal when the button is pressed", () => {
    const holdButton = screen.getByTestId("hold-button");
    fireEvent.press(holdButton);
    getByText("Hold Types");
    const updateButton = screen.getByText("Update");
    fireEvent.press(updateButton);
    expect(screen.queryByText("Hold Types")).toBeNull();
  });

  test("it selects and deselects hold types", () => {
    const holdButton = screen.getByTestId("hold-button");
    fireEvent.press(holdButton);
    const crimpCheckbox = screen.getByTestId("checkbox-Crimp");
    fireEvent.press(crimpCheckbox);
    expect(setHoldType).toHaveBeenCalledWith(["Slopper", "Pocket"]);
    const jugCheckbox = screen.getByTestId("checkbox-Jug");
    fireEvent.press(jugCheckbox);
    expect(setHoldType).toHaveBeenCalledWith([
      "Crimp",
      "Slopper",
      "Pocket",
      "Jug",
    ]);
  });
});
