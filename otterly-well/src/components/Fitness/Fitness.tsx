import { useState } from "react";
import { motion } from "framer-motion";
import { DateSelector } from "../UI/DateSelector";
import WorkoutList from "./components/WorkoutList/WorkoutList";
import NewWorkoutTabs from "./components/NewWorkout/NewWorkoutTabs";
import FitnessGoals from "./components/Goals/FitnessGoals";
import { useAuth } from "../../context/AuthContext";
import { useFitnessDaily } from "./hooks/useFitnessDaily";
import type { Exercise } from "./types/types";
import type { ExerciseInputData } from "./components/NewWorkout/AddExerciseToList";

export default function Fitness() {
  useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { entries, isLoading, addEntry, removeEntry, editEntry } =
    useFitnessDaily(selectedDate);

  const handleAddExercise = async (
    exercise: Exercise,
    inputData: ExerciseInputData
  ) => {
    await addEntry(exercise, inputData);
  };

  const handleRemoveEntry = async (id: string) => {
    await removeEntry(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col lg:flex-row gap-6 py-2 sm:py-4 h-full lg:h-[calc(100vh-1rem)] w-full overflow-hidden"
    >
      <div className="lg:w-1/3 w-full h-full flex flex-col gap-4 overflow-hidden order-1">
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          format="day"
        />
        <WorkoutList
          entries={entries}
          onRemoveEntry={handleRemoveEntry}
          isLoading={isLoading}
          onEdit={editEntry}
        />
      </div>
      <div className="lg:w-2/3 w-full h-full flex flex-col gap-4 overflow-hidden order-1 lg:order-2">
        <FitnessGoals entries={entries} selectedDate={selectedDate} />
        <NewWorkoutTabs onAddExercise={handleAddExercise} />
      </div>
    </motion.div>
  );
}
