import { render } from "@testing-library/react-native";

import SignInScreen from "../app/screens/SignInScreen";

describe("<Sign-In Screen />", () => {
  it("Text renders correctly on Sign-in screen", () => {
    const mockPromptAsync = jest.fn();
    const { getByText } = render(
      <SignInScreen promptAsync={mockPromptAsync} />,
    );

    getByText("Sign In with Google");
  });
});
