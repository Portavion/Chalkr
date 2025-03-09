// __mocks__/expo-router.js
import React from "react";

export const useRouter = () => ({
  push: jest.fn(),
  back: jest.fn(),
  replace: jest.fn(),
  pathname: "/", // Add a default pathname
  query: {}, // Add a default query object
});

const MockLink = ({ children, href, asChild, ...props }) => {
  const router = useRouter();
  const handlePress = (event) => {
    if (props.onPress) {
      props.onPress(event); // Call any existing onPress handler
    }
    if (href && !event.defaultPrevented) {
      // Check if default was prevented
      router.push(href);
    }
  };

  if (asChild) {
    // Handle the case where Link is used with asChild
    return React.cloneElement(children, { onPress: handlePress, ...props });
  }

  // If not asChild, render a regular <a> tag (for testing purposes)
  return (
    <a onClick={handlePress} href={href} {...props}>
      {children}
    </a>
  );
};

export const Link = MockLink;

// Mock other expo-router exports if you use them (e.g., useSearchParams, etc.):
export const useSearchParams = () => ({}); // Return an empty object or appropriate mock data
export const useSegments = () => []; // Return an empty array or mock segments
export const Redirect = ({ to }) => {
  // Mock the Redirect component
  const router = useRouter();
  router.replace(to);
  return null; // Redirect doesn't render anything
};
export const withLayoutContext = (Component) => {
  return (props) => <Component {...props} />; // No-op for withLayoutContext
};

// Add any other exports from expo-router that your components use.
