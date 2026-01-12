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
    editEntry,
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
      className="py-6 lg:p-8 mx-auto space-y-3 lg:h-[calc(100vh)] flex flex-col"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          format="day"
        />
      </div>

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

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        <EntriesList
          entries={entries}
          removeEntry={removeEntry}
          isLoading={isLoading}
          onEdit={editEntry}
        />
        <AddDataSection
          addEntryFromFood={addEntryFromFood}
          addCustomEntry={addCustomEntry}
        />
      </div>
    </motion.div>
  );
}
