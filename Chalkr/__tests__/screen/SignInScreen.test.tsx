import { render, screen, fireEvent } from "@testing-library/react-native";
import SignInScreen from "@/app/screens/SignInScreen";

describe("<SignInScreen />", () => {
  const mockPromptAsync = jest.fn();

  it("renders sign in elements", () => {
    render(<SignInScreen promptAsync={mockPromptAsync} />);
    expect(screen.getByText("Sign In")).toBeTruthy();
    expect(screen.getByText("Sign In with Google")).toBeTruthy();
  });

  it("calls promptAsync on button press", () => {
    render(<SignInScreen promptAsync={mockPromptAsync} />);
    fireEvent.press(screen.getByText("Sign In with Google"));
    expect(mockPromptAsync).toHaveBeenCalled();
  });
});
