// __mocks__/@rneui/themed.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const mockListItem = {
  Accordion: ({ children, content, isExpanded, onPress, icon }) => (
    <TouchableOpacity onPress={onPress} testID="accordion">
      <View>
        {React.isValidElement(content) ? content : <>{content}</>}
        {icon}
      </View>
      {isExpanded && <View>{children}</View>}
    </TouchableOpacity>
  ),
};

const mockIcon = ({ name, type }) => (
  <Text testID="accordion-icon">{name}</Text>
);

const mockDivider = () => <View testID="divider" />;

module.exports = {
  ListItem: mockListItem,
  Icon: mockIcon,
  Divider: mockDivider,
};
