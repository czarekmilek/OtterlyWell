import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabaseClient";
import type { WorkoutEntry, Exercise } from "../types/types";

export function useFitnessDaily(date: Date) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadData() {
      if (!user) return;
      setIsLoading(true);

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("workout_logs")
        .select("*, exercise:exercises(*)")
        .eq("user_id", user.id)
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString())
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching workout logs", error);
      } else if (data) {
        setEntries(data);
      }
      setIsLoading(false);
    }

    loadData();
  }, [user, date]);

  const addEntry = async (
    exercise: Exercise,
    inputData: {
      sets?: number;
      reps?: number;
      weight?: number;
      duration?: number;
      distance?: number;
    },
  ) => {
    if (!user) return;

    const newEntry = {
      user_id: user.id,
      exercise_id: exercise.id,
      sets: inputData.sets,
      reps: inputData.reps,
      weight_kg: inputData.weight,
      duration_min: inputData.duration,
      distance_km: inputData.distance,
      created_at: date.toISOString(),
    };

    const { data, error } = await supabase
      .from("workout_logs")
      .insert(newEntry)
      .select("*, exercise:exercises(*)")
      .single();

    if (error) {
      console.error("Error adding workout log", error);
    } else if (data) {
      setEntries((prev) => [...prev, data]);
    }
  };

  const removeEntry = async (id: string) => {
    const { error } = await supabase.from("workout_logs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting workout log", error);
    } else {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const editEntry = async (id: string, updates: Partial<WorkoutEntry>) => {
    const { error } = await supabase
      .from("workout_logs")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating workout log", error);
    } else {
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      );
    }
  };

  return { entries, isLoading, addEntry, removeEntry, editEntry };
}
