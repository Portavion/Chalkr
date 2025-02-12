import { render, screen, fireEvent } from "@testing-library/react-native";

import GradeSelector from "../logWorkouts/GradeSelector/GradeSelector";

describe("<GradeSelector />", () => {
  test("Text renders correctly on grade selector", () => {
    const setGrade = jest.fn();
    const grade = 2;
    const { getByText } = render(
      <GradeSelector grade={grade} setGrade={setGrade} />,
    );

    getByText("V2");
  });
  test(`it increments the grade`, () => {
    const grade = 2;
    const setGrade = jest.fn();

    render(<GradeSelector grade={grade} setGrade={setGrade} />);

    const incrementButton = screen.getByTestId("increment-button"); //More flexible query
    fireEvent.press(incrementButton);

    expect(setGrade).toHaveBeenCalledWith(3);
  });
  test(`it decrements the grade`, () => {
    const grade = 2;
    const setGrade = jest.fn();

    render(<GradeSelector grade={grade} setGrade={setGrade} />);

    const incrementButton = screen.getByTestId("increment-button"); //More flexible query
    fireEvent.press(incrementButton);

    expect(setGrade).toHaveBeenCalledWith(3);
  });
});
