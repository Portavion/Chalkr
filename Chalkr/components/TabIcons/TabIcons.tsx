import { Ionicons } from "@expo/vector-icons";

type TabIconProps = {
  color: string;
  focused: boolean;
  focusedIconName: keyof typeof Ionicons.glyphMap;
  unfocusedIconName: keyof typeof Ionicons.glyphMap;
};

const TabIcon = ({
  color,
  focused,
  focusedIconName,
  unfocusedIconName,
}: TabIconProps) => (
  <Ionicons
    name={focused ? focusedIconName : unfocusedIconName}
    color={color}
    size={24}
  />
);

const IndexTabIconWrapper = (props: any) => (
  <TabIcon
    {...props}
    focusedIconName="home-sharp"
    unfocusedIconName="home-outline"
  />
);

const WorkoutTabIconWrapper = (props: any) => (
  <TabIcon
    {...props}
    focusedIconName="barbell-sharp"
    unfocusedIconName="barbell-outline"
  />
);

const StatsTabIconWrapper = (props: any) => (
  <TabIcon
    {...props}
    focusedIconName="stats-chart-sharp"
    unfocusedIconName="stats-chart-outline"
  />
);

const SettingsTabIconWrapper = (props: any) => (
  <TabIcon
    {...props}
    focusedIconName="settings-sharp"
    unfocusedIconName="settings-outline"
  />
);

const WorkoutListTabIconWrapper = (props: any) => (
  <TabIcon
    {...props}
    focusedIconName="list-sharp"
    unfocusedIconName="list-outline"
  />
);

const GraphsTabIconWrapper = (props: any) => (
  <TabIcon
    {...props}
    focusedIconName="bar-chart-sharp"
    unfocusedIconName="bar-chart-outline"
  />
);

const ListsTabIconWrapper = (props: any) => (
  <TabIcon
    {...props}
    focusedIconName="images"
    unfocusedIconName="image-outline"
  />
);

export {
  IndexTabIconWrapper as IndexTabIcon,
  WorkoutTabIconWrapper as WorkoutTabIcon,
  StatsTabIconWrapper as StatsTabIcon,
  SettingsTabIconWrapper as SettingsTabIcon,
  WorkoutListTabIconWrapper as WorkoutListTabIcon,
  GraphsTabIconWrapper as GraphsTabIcon,
  ListsTabIconWrapper as ListsTabIcon,
};
