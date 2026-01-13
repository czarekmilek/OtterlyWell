import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FoodSearch } from "./NewEntries/FoodSearch";
import { CustomEntry } from "./NewEntries/CustomEntry";
import { BarcodeScanner } from "./NewEntries/BarcodeScanner";
import { useFoodSearch } from "../hooks/useFoodSearch";
import { useCustomEntryForm } from "../hooks/useCustomEntryForm";
import type { Entry, FoodHit, FoodHitWithGrams } from "../types/types";

type AddDataSectionProps = {
  addEntryFromFood: (food: FoodHit, grams: number) => Promise<void>;
  addCustomEntry: (
    entry: Omit<Entry, "id">,
    saveData?: { servingName: string; servingWeight: number }
  ) => Promise<boolean>;
};

export function AddDataSection({
  addEntryFromFood,
  addCustomEntry,
}: AddDataSectionProps) {
  const [activeTab, setActiveTab] = useState<"search" | "custom" | "scan">(
    "custom"
  );
  const [query, setQuery] = useState("");
  const { loading, hits, error } = useFoodSearch(query);

  const hitsWithGrams: FoodHitWithGrams[] = useMemo(
    () =>
      hits.map((h) => ({
        ...h,
        listId: (h.sourceId ?? "") + h.name + (h.id ?? ""),
        grams: 100,
      })),
    [hits]
  );

  const [localHits, setLocalHits] = useState<FoodHitWithGrams[]>(hitsWithGrams);

  useEffect(() => {
    setLocalHits(hitsWithGrams);
  }, [hitsWithGrams]);

  const { customEntry, handleCustomEntryChange, handleCustomEntrySubmit } =
    useCustomEntryForm(
      {
        name: "",
        kcal: 0,
        grams: 100,
        protein: 0,
        fat: 0,
        carbs: 0,
      },
      addCustomEntry
    );

  const getTabClassName = (tabName: typeof activeTab) =>
    `glass-header text-sm sm:text-base py-2 px-4 rounded-t-xl transition-all relative cursor-pointer ${
      activeTab === tabName
        ? "bg-brand-neutral-dark/70 z-11 border-b-0"
        : "opacity-70 hover:opacity-100 hover:bg-brand-neutral-dark/60"
    }`;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-end gap-2">
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
      <motion.div
        className="glass-panel rounded-xl rounded-tl-none flex-1 
              flex flex-col min-h-0 relative z-0"
      >
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
            />
          ) : activeTab === "custom" ? (
            <CustomEntry
              key="custom"
              customEntry={customEntry}
              handleCustomEntryChange={handleCustomEntryChange}
              handleCustomEntrySubmit={handleCustomEntrySubmit}
            />
          ) : (
            <BarcodeScanner key="scan" addEntryFromFood={addEntryFromFood} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
