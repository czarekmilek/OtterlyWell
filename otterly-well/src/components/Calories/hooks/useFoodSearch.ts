import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import type { FoodHit } from "../types/types";
import { useAuth } from "../../../context/AuthContext";

export function useFoodSearch(q: string, refreshTrigger: number = 0) {
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<FoodHit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRecent, setIsRecent] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    let abort = false;
    async function run() {
      if (!q || q.length < 2) {
        if (!user) {
          setHits([]);
          setIsRecent(true);
          return;
        }

        setLoading(true);
        setError(null);

        try {
          const { data, error } = await supabase
            .from("calorie_entries")
            .select("food:foods(*)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(50);

          if (error) throw error;

          const seenIds = new Set();
          const uniqueFoods: FoodHit[] = [];

          if (data) {
            data.forEach((entry: any) => {
              const f = entry.food;
              if (f && !seenIds.has(f.id)) {
                seenIds.add(f.id);
                uniqueFoods.push({
                  id: f.id,
                  name: f.name,
                  brand: f.brand,
                  kcalPer100g: f.kcal_per_100g,
                  proteinPer100g: f.protein_g_per_100g,
                  fatPer100g: f.fat_g_per_100g,
                  carbsPer100g: f.carbs_g_per_100g,
                  imageUrl: f.image_url,
                  sourceId: f.source_id,
                  servingSize: f.serving_size_g,
                  servingUnit: f.serving_unit,
                });
              }
            });
          }

          if (!abort) {
            setHits(uniqueFoods.slice(0, 10));
            setIsRecent(true);
          }
        } catch (e: any) {
          if (!abort) setError(e.message);
        } finally {
          if (!abort) setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);
      setIsRecent(false);

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
          servingSize: f.serving_size_g,
          servingUnit: f.serving_unit,
        }));

        // Update state with local results
        if (!abort) {
          setHits(localHits);
        }

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
          // Deduplicate results
          const localSourceIds = new Set(
            localHits.map((h) => h.sourceId).filter(Boolean),
          );

          const newOffHits = offHits.filter(
            (h) => !h.sourceId || !localSourceIds.has(h.sourceId),
          );

          setHits([...localHits, ...newOffHits]);
        }
      } catch (e: any) {
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
  }, [q, user, refreshTrigger]);

  return { loading, hits, error, isRecent };
}
