import { Ionicons } from "@expo/vector-icons";

//TODO: refactor in single component pass name of icon as prop?
const IndexTabIcon = ({
  color,
  focused,
}: {
  color: string;
  focused: boolean;
}) => (
  <Ionicons
    name={focused ? "home-sharp" : "home-outline"}
    color={color}
    size={24}
  />
);
const WorkoutTabIcon = ({
  color,
  focused,
}: {
  color: string;
  focused: boolean;
}) => (
  <Ionicons
    name={focused ? "barbell-sharp" : "barbell-outline"}
    color={color}
    size={24}
  />
);

const StatsTabIcon = ({
  color,
  focused,
}: {
  color: string;
  focused: boolean;
}) => (
  <Ionicons
    name={focused ? "stats-chart-sharp" : "stats-chart-outline"}
    color={color}
    size={24}
  />
);
const SettingsTabIcon = ({
  color,
  focused,
}: {
  color: string;
  focused: boolean;
}) => (
  <Ionicons
    name={focused ? "settings-sharp" : "settings-outline"}
    color={color}
    size={24}
  />
);

const WorkoutListTabIcon = ({
  color,
  focused,
}: {
  color: string;
  focused: boolean;
}) => (
  <Ionicons
    name={focused ? "list-sharp" : "list-outline"}
    color={color}
    size={24}
  />
);
const GraphsTabIcon = ({
  color,
  focused,
}: {
  color: string;
  focused: boolean;
}) => (
  <Ionicons
    name={focused ? "bar-chart-sharp" : "bar-chart-outline"}
    color={color}
    size={24}
  />
);
const ListsTabIcon = ({
  color,
  focused,
}: {
  color: string;
  focused: boolean;
}) => (
  <Ionicons
    name={focused ? "images" : "image-outline"}
    color={color}
    size={24}
  />
);
export {
  IndexTabIcon,
  WorkoutTabIcon,
  StatsTabIcon,
  SettingsTabIcon,
  WorkoutListTabIcon,
  GraphsTabIcon,
  ListsTabIcon,
};
