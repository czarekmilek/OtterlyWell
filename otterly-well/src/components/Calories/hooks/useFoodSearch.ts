import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import type { FoodHit } from "../types/types";

export function useFoodSearch(q: string) {
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<FoodHit[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let abort = false;
    async function run() {
      if (!q || q.length < 2) {
        setHits([]);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        // Search in 'foods' table
        const { data: localFoods, error: localError } = await supabase
          .from("foods")
          .select("*")
          .ilike("name", `%${q}%`)
          .limit(15);

        if (localError) throw localError;

        const localHits: FoodHit[] = (localFoods || []).map((f) => ({
          id: f.id,
          name: f.name,
          brand: f.brand,
          kcalPer100g: f.kcal_per_100g,
          proteinPer100g: f.protein_g_per_100g,
          fatPer100g: f.fat_g_per_100g,
          carbsPer100g: f.carbs_g_per_100g,
          imageUrl: f.image_url,
          sourceId: f.source_id,
        }));

        // Search in OpenFoodFacts
        const base = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
        const url = new URL(`${base}/v1/search-food`);
        url.searchParams.set("q", q);

        const res = await fetch(url);
        let offHits: FoodHit[] = [];
        if (res.ok) {
          const json = await res.json();
          offHits = json.items ?? [];
        } else {
          console.warn("OFF search failed", res.status);
        }

        if (!abort) {
          // Combine results, dispslay local ones first
          setHits([...localHits, ...offHits]);
        }
      } catch (e: Error) {
        if (!abort) setError(e.message);
      } finally {
        if (!abort) setLoading(false);
      }
    }

    const timer = setTimeout(run, 333);
    return () => {
      abort = true;
      clearTimeout(timer);
    };
  }, [q]);

  return { loading, hits, error };
}
