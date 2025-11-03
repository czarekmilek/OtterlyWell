import { useMemo, useState, useEffect, FormEvent } from "react";
import { useFoodSearch } from "./useFoodSearch";
import { RadialMacros } from "./RadialMacros";
import { MacroBar } from "./MacroBar";

export default function Calories() {
  const [goalCalories, setGoalCalories] = useState<number>(2137);
  const [goalProtein, setGoalProtein] = useState(133);
  const [goalFat, setGoalFat] = useState(77);
  const [goalCarbs, setGoalCarbs] = useState(255);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [query, setQuery] = useState("");
  const { loading, hits, error } = useFoodSearch(query);

  const hitsWithGrams: FoodHitWithGrams[] = useMemo(
    () =>
      hits.map((h) => ({
        ...h,
        id: (h.sourceId ?? "") + h.name,
        grams: 100,
      })),
    [hits]
  );

  const [localHits, setLocalHits] = useState<FoodHitWithGrams[]>(hitsWithGrams);

  useEffect(() => {
    setLocalHits(hitsWithGrams);
  }, [hitsWithGrams]);

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

  const totalCalories = useMemo(
    () =>
      entries.reduce(
        (acc, e) => {
          acc.kcal += e.kcal;
          acc.protein += e.protein;
          acc.fat += e.fat;
          acc.carbs += e.carbs;
          return acc;
        },
        { kcal: 0, protein: 0, fat: 0, carbs: 0 }
      ),
    [entries]
  );

  function addEntryFromFood(food: FoodHit, grams: number) {
    if (!food.kcalPer100g) return;

    const kcal = (food.kcalPer100g * grams) / 100;
    const protein = ((food.proteinPer100g ?? 0) * grams) / 100;
    const fat = ((food.fatPer100g ?? 0) * grams) / 100;
    const carbs = ((food.carbsPer100g ?? 0) * grams) / 100;

    setEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: `${food.name} (${grams}g)`,
        kcal: Math.round(kcal),
        grams,
        protein: Math.round(protein),
        fat: Math.round(fat),
        carbs: Math.round(carbs),
      },
    ]);
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Stats */}
      <section className="mb-4 grid gap-4 lg:grid-cols-2">
        {/* Goals and radial */}
        <div className="rounded-xl border border-white/10 bg-gray-800/50 p-4 flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-gray-400">Dzisiejszy cel</p>
              <p className="text-3xl font-semibold text-gray-100">
                {goalCalories} kcal
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Zjedzono</p>
              <p className="text-3xl font-semibold text-gray-100">
                {totalCalories.kcal} kcal
              </p>
            </div>
          </div>

          {/* Goals inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="flex flex-col text-sm text-gray-300">
              Kalorie
              <input
                type="number"
                min={1}
                className="mt-1 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:ring-2 focus:ring-orange-400/40 focus:outline-none"
                value={goalCalories}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setGoalCalories(v > 0 ? v : defaultGoalCalories);
                }}
              />
            </label>

            <label className="flex flex-col text-sm text-gray-300">
              Białko
              <input
                type="number"
                min={0}
                className="mt-1 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:ring-2 focus:ring-orange-400/40 focus:outline-none"
                value={goalProtein}
                onChange={(e) => setGoalProtein(Number(e.target.value) || 0)}
              />
            </label>

            <label className="flex flex-col text-sm text-gray-300">
              Tłuszcz
              <input
                type="number"
                min={0}
                className="mt-1 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:ring-2 focus:ring-orange-400/40 focus:outline-none"
                value={goalFat}
                onChange={(e) => setGoalFat(Number(e.target.value) || 0)}
              />
            </label>

            <label className="flex flex-col text-sm text-gray-300">
              Węglowodany
              <input
                type="number"
                min={0}
                className="mt-1 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:ring-2 focus:ring-orange-400/40 focus:outline-none"
                value={goalCarbs}
                onChange={(e) => setGoalCarbs(Number(e.target.value) || 0)}
              />
            </label>
          </div>

          <RadialMacros
            kcal={totalCalories.kcal}
            kcalGoal={goalCalories}
            protein={totalCalories.protein}
            fat={totalCalories.fat}
            carbs={totalCalories.carbs}
            goals={{
              protein: goalProtein,
              fat: goalFat,
              carbs: goalCarbs,
            }}
          />
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
        <div className="rounded-xl border border-white/10 bg-gray-800/50 p-4">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Wyszukaj produkt
          </h2>
          <input
            type="text"
            placeholder="Szukaj produktu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-orange-400/40 focus:outline-none"
          />
          {loading && <p className="mt-2 text-gray-400">Szukam...</p>}
          {error && <p className="mt-2 text-red-400">Błąd: {error}</p>}

          {/* Results */}
          {localHits.length > 0 && (
            <ul className="mt-4 divide-y divide-white/10 rounded-lg border border-white/10 max-h-64 overflow-y-auto">
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
                        : "brak danych"}{" "}
                      {h.proteinPer100g != null &&
                        `| ${h.proteinPer100g}g białka`}{" "}
                      {h.fatPer100g != null && `| ${h.fatPer100g}g tłuszczu`}{" "}
                      {h.carbsPer100g != null &&
                        `| ${h.carbsPer100g}g węglowodanów`}
                    </p>
                  </div>

                  {/* Add button */}
                  {h.kcalPer100g && (
                    <form
                      className="flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
                      onSubmit={(e: FormEvent) => {
                        e.preventDefault();
                        if (h.grams > 0) {
                          addEntryFromFood(h, h.grams);
                        }
                      }}
                    >
                      <input
                        type="number"
                        min={1}
                        className="w-24 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
                        placeholder="Gramy"
                        value={h.grams}
                        onChange={(e) => {
                          const newGrams = Number(e.target.value);
                          setLocalHits((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, grams: newGrams } : item
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
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Entries */}
      <section className="rounded-xl border border-white/10 bg-gray-800/50 p-4">
        <h2 className="text-lg font-semibold text-gray-100 mb-2">
          Historia posiłków
        </h2>

        {entries.length === 0 ? (
          <p className="mt-4 text-gray-400">
            Nic dziś jeszcze nie dodano. Dodaj pierwszy produkt powyżej.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-white/5">
            {entries.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between py-3 gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-gray-100">{e.name}</p>
                  <p className="text-sm text-gray-400">
                    {e.kcal} kcal | B {e.protein.toFixed(1)}g | T{" "}
                    {e.fat.toFixed(1)}g | W {e.carbs.toFixed(1)}g
                  </p>
                </div>
                <MacroBar protein={e.protein} fat={e.fat} carbs={e.carbs} />
                <button
                  onClick={() => removeEntry(e.id)}
                  className="rounded-md border border-white/10 bg-gray-900 px-3 py-1 text-sm text-gray-300 hover:bg-gray-800 hover:cursor-pointer transition:color duration-200"
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
