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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const get = (obj: any, path: string, defaultValue: any = undefined) => {
  const result = path
    .split(".")
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj
    );
  return result !== undefined ? result : defaultValue;
};

serve(async (req: { url: string | URL; method: string }) => {
  const url = new URL(req.url);
  const barcode = url.searchParams.get("barcode")?.trim();

  // CORS headers
  const headers = {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-headers":
      "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  if (!barcode) {
    return new Response(JSON.stringify({ error: "Missing barcode" }), {
      status: 400,
      headers,
    });
  }

  try {
    const offUrl = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;

    const r = await fetch(offUrl, {
      headers: { "User-Agent": "otterly-well/1.0" },
    });

    if (!r.ok) {
      if (r.status === 404) {
        return new Response(JSON.stringify({ error: "Product not found" }), {
          status: 404,
          headers,
        });
      }
      throw new Error(`OpenFoodFacts API error: ${r.status}`);
    }

    const data = await r.json();

    if (data.status !== 1 || !data.product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers,
      });
    }

    const p = data.product;
    const n = p.nutriments ?? {};

    const item: FoodItem = {
      name: p.product_name || p.generic_name || p.brands || "Unknown",
      brand: p.brands,
      kcalPer100g: get(n, "energy-kcal_100g", n["energy-kcal"]),
      proteinPer100g: get(n, "proteins_100g"),
      fatPer100g: get(n, "fat_100g"),
      carbsPer100g: get(n, "carbohydrates_100g"),
      imageUrl: p.image_front_url || p.image_url,
      source: "openfoodfacts",
      sourceId: p.code || barcode,
    };

    return new Response(JSON.stringify({ items: [item] }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers,
    });
  }
});
