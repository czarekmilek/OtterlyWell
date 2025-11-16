import { useMemo, useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFoodSearch } from "./hooks/useFoodSearch";
import type { Entry, FoodHit, FoodHitWithGrams } from "./types/types";
import {
  Goals,
  FoodSearch,
  CustomEntry,
  BarcodeScanner,
  EntriesList,
} from "./components";

export default function Calories() {
  const [goalCalories, setGoalCalories] = useState<number>(2137);
  const [goalProtein, setGoalProtein] = useState(133);
  const [goalFat, setGoalFat] = useState(77);
  const [goalCarbs, setGoalCarbs] = useState(255);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [query, setQuery] = useState("");
  const { loading, hits, error } = useFoodSearch(query);
  const [activeTab, setActiveTab] = useState<"search" | "custom" | "scan">(
    "custom"
  );
  const [customEntry, setCustomEntry] = useState<Omit<Entry, "id">>({
    name: "",
    kcal: 0,
    grams: 100,
    protein: 0,
    fat: 0,
    carbs: 0,
  });

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

  function handleCustomEntryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setCustomEntry((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Number(value),
    }));
  }

  function handleCustomEntrySubmit(e: FormEvent) {
    e.preventDefault();
    const newEntry: Entry = {
      id: crypto.randomUUID(),
      ...customEntry,
      name: `${customEntry.name} (${customEntry.grams}g)`,
    };
    setEntries((prev) => [...prev, newEntry].sort((a, b) => b.kcal - a.kcal));
    setCustomEntry({
      name: "",
      kcal: 0,
      grams: 100,
      protein: 0,
      fat: 0,
      carbs: 0,
    });
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const getTabClassName = (tabName: typeof activeTab) =>
    `flex-1 text-center px-2 sm:px-4 py-2 rounded-t-md transition-colors relative -mb-px ${
      activeTab === tabName
        ? "bg-brand-neutral-dark/50 text-brand-neutral-light border-x border-t border-brand-depth border-b-transparent"
        : "text-brand-neutral-dark hover:bg-brand-accent-3 border-b border-brand-depth cursor-pointer"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-2 sm:py-4"
    >
      <section className="mb-4 flex gap-1 lg:flex-row flex-col">
        <EntriesList entries={entries} removeEntry={removeEntry} />
        <div className="gap-1 flex flex-col">
          <Goals
            goalCalories={goalCalories}
            totalCalories={totalCalories}
            goalProtein={goalProtein}
            goalFat={goalFat}
            goalCarbs={goalCarbs}
            setGoalCalories={setGoalCalories}
            setGoalProtein={setGoalProtein}
            setGoalFat={setGoalFat}
            setGoalCarbs={setGoalCarbs}
          />
          <motion.div className="rounded-xl border border-brand-depth bg-brand-neutral-dark/50 p-4">
            <div className="flex border-b border-brand-depth">
              <button
                onClick={() => setActiveTab("search")}
                className={getTabClassName("search")}
              >
                Wyszukaj
              </button>
              <button
                onClick={() => setActiveTab("custom")}
                className={getTabClassName("custom")}
              >
                Dodaj własny
              </button>
              <button
                onClick={() => setActiveTab("scan")}
                className={getTabClassName("scan")}
              >
                Skanuj
              </button>
            </div>
            <AnimatePresence mode="wait">
              {activeTab === "search" ? (
                <FoodSearch
                  key="search"
                  query={query}
                  setQuery={setQuery}
                  loading={loading}
                  error={error}
                  localHits={localHits}
                  addEntryFromFood={addEntryFromFood}
                  setLocalHits={setLocalHits}
                />
              ) : activeTab === "custom" ? (
                <CustomEntry
                  key="custom"
                  customEntry={customEntry}
                  handleCustomEntryChange={handleCustomEntryChange}
                  handleCustomEntrySubmit={handleCustomEntrySubmit}
                />
              ) : (
                <BarcodeScanner
                  key="scan"
                  addEntryFromFood={addEntryFromFood}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
