import { View } from "react-native";
import BarChartAscentsPerWorkout from "@/components/Charts/BarChartAscentsPerWorkout/BarChartAscentsPerWorkout";
import BarChartFlashRatePerGrade from "@/components/Charts/BarChartFlashRatePerGrade/BarChartFlashRatePerGrade";
import useFetchAllWorkouts from "@/hooks/fetchWorkouts/useFetchAllWorkouts";
import useFetchFlashRates from "@/hooks/fetchWorkouts/useFetchFlashRates";

export default function StatScreen() {
  const { workoutWithAscents } = useFetchAllWorkouts();
  const { flashRateStats } = useFetchFlashRates();

  return (
    <View className="flex-1">
      <View className=" m-4 p-2 text-center items-center border rounded-xl bg-gray-50 ">
        <BarChartAscentsPerWorkout workoutsWithAscents={workoutWithAscents} />
      </View>
      <View className=" m-4 p-2 text-center items-center border rounded-xl bg-gray-50 ">
        <BarChartFlashRatePerGrade data={flashRateStats} />
      </View>
    </View>
  );
}
