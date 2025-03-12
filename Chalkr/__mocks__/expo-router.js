// __mocks__/expo-router.js
import React from "react";

export const useRouter = () => ({
  push: jest.fn(),
  back: jest.fn(),
  replace: jest.fn(),
  pathname: "/",
  query: {},
});

const MockLink = ({ children, href, asChild, ...props }) => {
  const router = useRouter();
  const handlePress = (event) => {
    if (props.onPress) {
      props.onPress(event);
    }
    if (href && !event.defaultPrevented) {
      router.push(href);
    }
  };

  if (asChild) {
    return React.cloneElement(children, { onPress: handlePress, ...props });
  }

  return (
    <a onClick={handlePress} href={href} {...props}>
      {children}
    </a>
  );
};

export const Link = MockLink;

export const useSearchParams = () => ({});
export const useSegments = () => [];
export const Redirect = ({ to }) => {
  const router = useRouter();
  router.replace(to);
  return null;
};
export const withLayoutContext = (Component) => {
  return (props) => <Component {...props} />;
};
