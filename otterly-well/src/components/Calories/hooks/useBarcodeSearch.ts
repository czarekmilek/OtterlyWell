import { useState, useEffect } from "react";

export function useBarcodeSearch(barcode: string) {
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<FoodHit[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let abort = false;
    async function run() {
      if (!barcode) {
        setHits([]);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const base = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
        const url = new URL(`${base}/v1/get-food-by-barcode`);
        url.searchParams.set("barcode", barcode);

        const res = await fetch(url.toString());
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || `HTTP ${res.status}`);
        }

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
  }, [barcode]);

  return { loading, hits, error, setHits };
}
