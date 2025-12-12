import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DateSelector } from "../Calories/components/DateSelector";
import WorkoutList from "./components/WorkoutList/WorkoutList";
import NewWorkoutTabs from "./components/NewWorkout/NewWorkoutTabs";
import FitnessGoals from "./components/Goals/FitnessGoals";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import type { WorkoutEntry, Exercise } from "./types/types";

export default function Fitness() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadData() {
      if (!user) return;
      setIsLoading(true);

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("workout_logs")
        .select("*, exercise:exercises(*)")
        .eq("user_id", user.id)
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString())
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching workout logs", error);
      } else if (data) {
        setEntries(data);
      }
      setIsLoading(false);
    }

    loadData();
  }, [user, selectedDate]);

  const handleAddExercise = async (
    exercise: Exercise,
    sets: number,
    reps: number,
    weight: number
  ) => {
    if (!user) return;

    const newEntry = {
      user_id: user.id,
      exercise_id: exercise.id,
      sets,
      reps,
      weight_kg: weight,
      created_at: selectedDate.toISOString(),
    };

    const { data, error } = await supabase
      .from("workout_logs")
      .insert(newEntry)
      .select("*, exercise:exercises(*)")
      .single();

    if (error) {
      console.error("Error adding workout log", error);
    } else if (data) {
      setEntries((prev) => [data, ...prev]);
    }
  };

  const handleRemoveEntry = async (id: string) => {
    const { error } = await supabase.from("workout_logs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting workout log", error);
    } else {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-2 sm:py-4 lg:h-[calc(100vh)]"
    >
      <section className="flex lg:flex-row flex-col h-full gap-2">
        <div className="lg:w-1/3 w-full h-full gap-2 flex flex-col">
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          <WorkoutList
            entries={entries}
            onRemoveEntry={handleRemoveEntry}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:w-2/3 w-full gap-2 flex flex-col h-full">
          <FitnessGoals entries={entries} />
          <NewWorkoutTabs onAddExercise={handleAddExercise} />
        </div>
      </section>
    </motion.div>
  );
}
