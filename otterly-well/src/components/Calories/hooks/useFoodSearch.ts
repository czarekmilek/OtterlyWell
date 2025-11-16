import { useEffect, useState } from "react";
import type { FoodHit } from "./types";

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
        const base = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
        const url = new URL(`${base}/v1/search-food`);
        url.searchParams.set("q", q);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        if (!abort) setHits(json.items ?? []);
      } catch (e: Error) {
        if (!abort) setError(e.message);
      } finally {
        if (!abort) setLoading(false);
      }
    }

    run();
    return () => {
      abort = true;
    };
  }, [q]);

  return { loading, hits, error };
}
