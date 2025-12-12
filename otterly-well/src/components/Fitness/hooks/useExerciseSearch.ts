import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import type { Exercise } from "../types/types";

export function useExerciseSearch(query: string) {
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setHits([]);
      return;
    }

    const fetchExercises = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("exercises")
          .select("*")
          .ilike("name", `%${query}%`)
          .limit(20);

        if (error) throw error;
        setHits(data || []);
      } catch (err: any) {
        console.error("Error searching exercises:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchExercises, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return { loading, hits, error };
}
