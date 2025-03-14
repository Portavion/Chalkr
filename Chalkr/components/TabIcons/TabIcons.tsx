import { Ionicons } from "@expo/vector-icons";

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

export { IndexTabIcon, WorkoutTabIcon, StatsTabIcon, SettingsTabIcon };
