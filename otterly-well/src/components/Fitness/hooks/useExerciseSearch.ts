import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import type { Exercise } from "../types/types";

export type ExerciseFilter =
  | "strength"
  | "cardio"
  | "stretching"
  | "all"
  | null;

export function useExerciseSearch(
  query: string,
  refreshTrigger: number = 0,
  filter: ExerciseFilter = null,
) {
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRecent, setIsRecent] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setError(null);
      try {
        if ((!query || query.length < 2) && filter === null) {
          if (!user) {
            setHits([]);
            setIsRecent(true);
            return;
          }

          const { data, error } = await supabase
            .from("workout_logs")
            .select("exercise:exercises(*)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(50);

          if (error) throw error;

          const seenIds = new Set();
          const uniqueExercises: Exercise[] = [];

          data?.forEach((entry: any) => {
            if (entry.exercise && !seenIds.has(entry.exercise.id)) {
              seenIds.add(entry.exercise.id);
              uniqueExercises.push(entry.exercise);
            }
          });

          setHits(uniqueExercises.slice(0, 7));
          setIsRecent(true);
        } else {
          let queryBuilder = supabase
            .from("exercises")
            .select("*")
            .or(`created_by.is.null,created_by.eq.${user?.id}`);
          if (filter && filter !== "all") {
            queryBuilder = queryBuilder.eq("type", filter);
          }

          if (query && query.length >= 2) {
            queryBuilder = queryBuilder.ilike("name", `%${query}%`);
          }
          const limit = query ? 20 : 50;

          const { data, error } = await queryBuilder.limit(limit);

          if (error) throw error;
          setHits(data || []);
          setIsRecent(false);
        }
      } catch (err: any) {
        console.error("Error searching exercises:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchExercises, 300);
    return () => clearTimeout(debounce);
  }, [query, user, refreshTrigger, filter]);

  return { loading, hits, error, isRecent };
}
