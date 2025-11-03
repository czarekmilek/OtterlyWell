import { useMemo, useState, useEffect, FormEvent } from "react";
import { CalorieIcon } from "../icons";

type Entry = { id: string; name: string; kcal: number; grams: number };

type FoodHit = {
  name: string;
  brand?: string;
  kcalPer100g?: number;
  proteinPer100g?: number;
  fatPer100g?: number;
  carbsPer100g?: number;
  imageUrl?: string;
  source: string;
  sourceId?: string;
};

type FoodHitWithGrams = FoodHit & {
  id: string;
  grams: number;
};

function useFoodSearch(q: string) {
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

export default function Calories() {
  const [goalCalories, setGoalCalories] = useState<number>(2137);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [query, setQuery] = useState("");
  const { loading, hits, error } = useFoodSearch(query);

  const totalCalories = useMemo(
    () => entries.reduce((sum, e) => sum + e.kcal, 0),
    [entries]
  );

  const goalPercent = Math.round(
    (totalCalories / Math.max(goalCalories, 1)) * 100
  );

  // function addEntry(e: React.FormEvent) {
  //   e.preventDefault();
  //   const cleanProductName = name.trim();
  //   const productCalorieCount = Number(kcal);
  //   if (
  //     !cleanProductName ||
  //     !Number.isFinite(productCalorieCount) ||
  //     productCalorieCount <= 0
  //   )
  //     return;

  //   setEntries((prev) => [
  //     ...prev,
  //     {
  //       id: crypto.randomUUID(),
  //       name: cleanProductName,
  //       kcal: Math.round(productCalorieCount),
  //     },
  //   ]);
  //   setName("");
  //   setKcal("");
  // }

  function addEntryFromFood(food: FoodHit, grams: number) {
    if (!food.kcalPer100g) return;
    const kcal = (food.kcalPer100g * grams) / 100;

    setEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: `${food.name} (${grams}g)}`,
        kcal: Math.round(kcal),
        grams,
      },
    ]);
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const hitsWithGrams: FoodHitWithGrams[] = useMemo(
    () =>
      hits.map((h) => ({
        ...h,
        id: h.sourceId + h.name,
        grams: 100,
      })),
    [hits]
  );

  const [localHits, setLocalHits] = useState(hitsWithGrams);

  useEffect(() => {
    setLocalHits(hitsWithGrams);
  }, [hitsWithGrams]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex items-center gap-3">
        <div className="rounded-lg p-2 bg-gray-700/50 text-orange-400">
          <CalorieIcon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Kalorie</h1>
          <p className="text-gray-400">Lorem ipsum lorem ipsum.</p>
        </div>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-gray-800/50 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-gray-400">Dzisiejszy cel</p>
              <p className="text-3xl font-semibold text-gray-100">
                {goalCalories} kcal
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Zjedzono</p>
              <p className="text-3xl font-semibold text-gray-100">
                {totalCalories} kcal
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-3 w-full rounded-full bg-gray-700 overflow-hidden">
              <div
                className="h-3 bg-orange-400 transition-[width] duration-500"
                style={{ width: `${goalPercent}%` }}
                aria-valuenow={goalPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="mt-2 text-sm text-gray-400">{goalPercent}% celu</p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <label className="text-sm text-gray-300">Ustaw nowy cel:</label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              className="w-28 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
              value={goalCalories}
              onChange={(e) => {
                const newGoal = Number(e.target.value);
                setGoalCalories(newGoal > 0 ? newGoal : defaultGoalCalories);
              }}
            />
          </div>
        </div>

        {/* <form
          onSubmit={addEntryFromFood}
          className="rounded-xl border border-white/10 bg-gray-800/50 p-4"
        >
          <h2 className="text-lg font-semibold text-gray-100">Dodaj produkt</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <input
              className="rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 sm:col-span-2"
              placeholder="Nazwa produktu"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              inputMode="numeric"
              className="rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
              placeholder="kcal"
              value={kcal}
              onChange={(e) => setKcal(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full rounded-md bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-400 transition duration-300 cursor-pointer"
            >
              Dodaj
            </button>
          </div>
        </form> */}

        {/* Search box */}
        <div>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Szukaj produktu..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-orange-400/40 focus:outline-none"
            />
            {loading && <p className="mt-2 text-gray-400">Szukam...</p>}
            {error && <p className="mt-2 text-red-400">Błąd: {error}</p>}
          </div>

          {/* Results */}
          {hits.length > 0 && (
            <ul className="mb-8 divide-y divide-white/10 rounded-lg border border-white/10 max-h-96 overflow-y-auto">
              {localHits.map((h, index) => (
                <li
                  key={h.id}
                  className="group p-3 flex items-center gap-3 bg-gray-800/50 hover:bg-gray-700/50 transition"
                >
                  {h.imageUrl && (
                    <img
                      src={h.imageUrl}
                      alt={h.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-100 truncate">{h.name}</p>
                    <p className="text-sm text-gray-400">
                      {h.brand ?? "—"} •{" "}
                      {h.kcalPer100g
                        ? `${h.kcalPer100g} kcal / 100g`
                        : "brak danych"}
                    </p>
                  </div>

                  {/* Add button */}
                  {h.kcalPer100g && (
                    <form
                      className="ml-auto"
                      onSubmit={(e: FormEvent) => {
                        e.preventDefault();
                        if (h.grams > 0) {
                          addEntryFromFood(h, h.grams);
                        }
                      }}
                    >
                      <div
                        className="
                          gap-2
                          items-center
                          opacity-0
                          focus-within:opacity-100
                          group-hover:opacity-100
                          transition-opacity
                          duration-200
                          flex
                        "
                      >
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          className="w-24 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
                          placeholder="Gramy"
                          value={h.grams}
                          onChange={(e) => {
                            const newGrams = Number(e.target.value);
                            setLocalHits((prev) =>
                              prev.map((item, i) =>
                                i === index
                                  ? { ...item, grams: newGrams }
                                  : item
                              )
                            );
                          }}
                        />
                        <button
                          type="submit"
                          className="rounded-md bg-orange-500 px-3 py-1 text-sm text-white hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-gray-600"
                          disabled={h.grams <= 0}
                        >
                          Dodaj
                        </button>
                      </div>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-gray-800/50 p-4">
        <h2 className="text-lg font-semibold text-gray-100">
          Historia posiłków
        </h2>

        {entries.length === 0 ? (
          <p className="mt-4 text-gray-400">
            Nic dziś jeszcze nie dodano. Dodaj pierwszy produkt powyżej.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-white/5">
            {entries.map((e) => (
              <li key={e.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-gray-100">{e.name}</p>
                  <p className="text-sm text-gray-400">{e.kcal} kcal</p>
                </div>
                <button
                  onClick={() => removeEntry(e.id)}
                  className="rounded-md border border-white/10 bg-gray-900 px-3 py-1 text-sm text-gray-300 hover:bg-gray-800"
                >
                  Usuń
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
