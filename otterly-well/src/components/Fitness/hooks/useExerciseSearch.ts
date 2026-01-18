import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import type { Exercise } from "../types/types";

export function useExerciseSearch(query: string, refreshTrigger: number = 0) {
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
        if (!query || query.length < 2) {
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
          const { data, error } = await supabase
            .from("exercises")
            .select("*")
            .ilike("name", `%${query}%`)
            .limit(20);

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
  }, [query, user, refreshTrigger]);

  return { loading, hits, error, isRecent };
}
