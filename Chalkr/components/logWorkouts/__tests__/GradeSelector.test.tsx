import { render, screen, fireEvent } from "@testing-library/react-native";

import GradeSelector from "@/components/logWorkouts/GradeSelector";

describe("<GradeSelector />", () => {
  test("renders the Grade: label and grade value", () => {
    const setGrade = jest.fn();
    const grade = 2;
    const { getByText } = render(
      <GradeSelector grade={grade} setGrade={setGrade} />,
    );

    getByText("V2");
    getByText("Grade: ");
  });
  test(`increments the grade when the increment button is pressed`, () => {
    const grade = 2;
    const setGrade = jest.fn();

    render(<GradeSelector grade={grade} setGrade={setGrade} />);

    const incrementButton = screen.getByTestId("increment-button");
    fireEvent.press(incrementButton);

    expect(setGrade).toHaveBeenCalledWith(3);
  });
  test(`decrements the grade when the decrement button is pressed`, () => {
    const grade = 2;
    const setGrade = jest.fn();

    render(<GradeSelector grade={grade} setGrade={setGrade} />);

    const decrementButton = screen.getByTestId("decrement-button");
    fireEvent.press(decrementButton);
    expect(setGrade).toHaveBeenCalledWith(1);
  });
  test("doesn't decrement the grade when the grade is 0", () => {
    const grade = 0;
    const setGrade = jest.fn();

    render(<GradeSelector grade={grade} setGrade={setGrade} />);

    const decrementButton = screen.getByTestId("decrement-button");
    fireEvent.press(decrementButton);
    expect(setGrade).not.toHaveBeenCalled();
  });
});
