import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import type { ExerciseSet } from "../types/types";
import { useAuth } from "../../../context/AuthContext";

export function useWorkoutSets(query: string, refreshTrigger: number = 0) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sets, setSets] = useState<ExerciseSet[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchSets = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      let queryBuilder = supabase
        .from("workout_sets")
        .select(
          `
          *,
          items:workout_set_items (
            *,
            exercise:exercises (*)
          )
        `,
        )
        .order("created_at", { ascending: false });
      ``;

      if (query) {
        queryBuilder = queryBuilder.ilike("name", `%${query}%`);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      setSets(data || []);
    } catch (err: any) {
      console.error("Error searching sets:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchSets, 300);
    return () => clearTimeout(debounce);
  }, [query, user, refreshTrigger]);

  const refreshSets = () => {
    fetchSets();
  };

  const createSet = async (name: string, description: string, items: any[]) => {
    if (!user) throw new Error("Użytkownik nie jest zalogowany"); // in polish, since app displays this

    const { data: set, error: setError } = await supabase
      .from("workout_sets")
      .insert({
        name,
        description,
        created_by: user.id,
      })
      .select()
      .single();

    if (setError) throw setError;

    if (items.length > 0) {
      const setItems = items.map((item, index) => ({
        set_id: set.id,
        exercise_id: item.exercise.id,
        order_index: index,
        sets: item.sets,
        reps: item.reps,
        weight_kg: item.weight,
        duration_min: item.duration,
      }));

      const { error: itemsError } = await supabase
        .from("workout_set_items")
        .insert(setItems);

      if (itemsError) throw itemsError;
    }

    refreshSets();
    return set;
  };

  const deleteSet = async (setId: string) => {
    const { error } = await supabase
      .from("workout_sets")
      .delete()
      .eq("id", setId);
    if (error) throw error;
    refreshSets();
  };

  const updateSet = async (
    setId: string,
    name: string,
    description: string,
    items: any[],
  ) => {
    if (!user) throw new Error("Użytkownik nie jest zalogowany");

    const { error: setError } = await supabase
      .from("workout_sets")
      .update({
        name,
        description,
      })
      .eq("id", setId);

    if (setError) throw setError;

    const { error: deleteError } = await supabase
      .from("workout_set_items")
      .delete()
      .eq("set_id", setId);

    if (deleteError) throw deleteError;

    if (items.length > 0) {
      const setItems = items.map((item, index) => ({
        set_id: setId,
        exercise_id: item.exercise.id,
        order_index: index,
        sets: item.sets,
        reps: item.reps,
        weight_kg: item.weight,
        duration_min: item.duration,
      }));

      const { error: itemsError } = await supabase
        .from("workout_set_items")
        .insert(setItems);

      if (itemsError) throw itemsError;
    }

    refreshSets();
  };

  return { loading, sets, error, refreshSets, createSet, deleteSet, updateSet };
}
