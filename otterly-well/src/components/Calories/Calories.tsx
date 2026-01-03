import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useCaloriesData } from "./hooks/useCaloriesData";
import { Goals, EntriesList, DateSelector } from "./components";
import { AddDataSection } from "./components/AddDataSection";

export default function Calories() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    entries,
    isLoading,
    goals,
    totalCalories,
    addEntryFromFood,
    addCustomEntry,
    removeEntry,
    updateGoal,
  } = useCaloriesData(user, selectedDate);

  const handleSetGoalCalories = (value: number) =>
    updateGoal("calories", value);
  const handleSetGoalProtein = (value: number) => updateGoal("protein", value);
  const handleSetGoalFat = (value: number) => updateGoal("fat", value);
  const handleSetGoalCarbs = (value: number) => updateGoal("carbs", value);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-2 sm:py-4 lg:h-[calc(100vh)]"
    >
      <section className="flex lg:flex-row flex-col h-full gap-6">
        <div className="lg:w-1/3 w-full h-full gap-4 flex flex-col">
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            format="day"
          />
          <EntriesList
            entries={entries}
            removeEntry={removeEntry}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:w-2/3 w-full gap-4 flex flex-col h-full">
          <Goals
            goalCalories={goals.calories}
            totalCalories={totalCalories}
            goalProtein={goals.protein}
            goalFat={goals.fat}
            goalCarbs={goals.carbs}
            setGoalCalories={handleSetGoalCalories}
            setGoalProtein={handleSetGoalProtein}
            setGoalFat={handleSetGoalFat}
            setGoalCarbs={handleSetGoalCarbs}
            isLoading={isLoading}
          />
          <AddDataSection
            addEntryFromFood={addEntryFromFood}
            addCustomEntry={addCustomEntry}
          />
        </div>
      </section>
    </motion.div>
  );
}
