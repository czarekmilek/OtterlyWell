import { serve } from "https://deno.land/std/http/server.ts";

type FoodItem = {
  name: string;
  brand?: string;
  kcalPer100g?: number;
  proteinPer100g?: number;
  fatPer100g?: number;
  carbsPer100g?: number;
  imageUrl?: string;
  source: "openfoodfacts";
  sourceId?: string; // barcode
};

serve(async (req: { url: string | URL; method: string }) => {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim();
  if (!q) {
    return new Response(JSON.stringify({ error: "Missing q" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    // OpenFoodFacts search
    const offUrl = new URL("https://world.openfoodfacts.org/cgi/search.pl");
    offUrl.searchParams.set("search_terms", q);
    offUrl.searchParams.set("search_simple", "1");
    offUrl.searchParams.set("json", "1");
    offUrl.searchParams.set("page_size", "20");

    const r = await fetch(offUrl.toString(), {
      headers: { "User-Agent": "otterly-well/1.0" },
    });
    const data = await r.json();

    const items: FoodItem[] = (data.products ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((p: any) => {
        const n = p.nutriments ?? {};
        return {
          name: p.product_name || p.generic_name || p.brands || "Unknown",
          brand: p.brands,
          kcalPer100g: n["energy-kcal_100g"] ?? n["energy-kcal"] ?? undefined,
          proteinPer100g: n["proteins_100g"] ?? undefined,
          fatPer100g: n["fat_100g"] ?? undefined,
          carbsPer100g: n["carbohydrates_100g"] ?? undefined,
          imageUrl: p.image_front_url || p.image_url,
          source: "openfoodfacts",
          sourceId: p.code,
        };
      })
      .filter((i: FoodItem) => i.name);

    // CORS headers soo Vite app can call it from localhost too
    const headers = {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-headers":
        "authorization, x-client-info, apikey, content-type",
    };

    if (req.method === "OPTIONS") {
      return new Response("ok", { headers });
    }

    return new Response(JSON.stringify({ items }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
});
