import { useState, useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { FoodSearch } from "./NewEntries/FoodSearch";
import { CustomEntryModal } from "./NewEntries/CustomEntryModal";
import { ScannerModal } from "./NewEntries/ScannerModal";
import { useFoodSearch } from "../hooks/useFoodSearch";
import { useCustomEntryForm } from "../hooks/useCustomEntryForm";
import { SearchIcon, QrCodeIcon } from "../../icons";
import type { Entry, FoodHit, FoodHitWithGrams } from "../types/types";

type AddDataSectionProps = {
  addEntryFromFood: (food: FoodHit, grams: number) => Promise<void>;
  addCustomEntry: (
    entry: Omit<Entry, "id">,
    saveData?: { servingName: string; servingWeight: number },
  ) => Promise<boolean>;
};

export function AddDataSection({
  addEntryFromFood,
  addCustomEntry,
}: AddDataSectionProps) {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { loading, hits, error } = useFoodSearch(query);

  const hitsWithGrams: FoodHitWithGrams[] = useMemo(
    () =>
      hits.map((h) => ({
        ...h,
        listId: (h.sourceId ?? "") + h.name + (h.id ?? ""),
        grams: 100,
      })),
    [hits],
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
      addCustomEntry,
    );

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex flex-col h-full bg-brand-neutral-dark/10 rounded-xl overflow-hidden border border-brand-depth/50">
        <div className="p-3 border-b border-brand-depth bg-brand-neutral-dark relative flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-neutral-light/50" />
            <input
              type="text"
              placeholder="Szukaj produktu..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-brand-depth/30 border border-brand-depth/50 text-brand-neutral-light 
                        placeholder-brand-neutral-light/30 focus:outline-none focus:ring-1 focus:ring-brand-accent-1 focus:border-brand-accent-1 
                        transition-all"
            />
          </div>
          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="bg-brand-accent-1 hover:bg-brand-accent-2 text-white p-3 rounded-lg transition-colors shadow-lg cursor-pointer flex items-center justify-center"
            title="Dodaj własny produkt"
          >
            <span className="flex justify-center items-center">+</span>
          </button>
          <button
            onClick={() => setIsScannerModalOpen(true)}
            className="bg-brand-neutral-light/90 hover:bg-brand-accent-3 border border-brand-depth 
                    text-brand-neutral-dark p-3 rounded-lg transition-colors 
                      shadow-sm cursor-pointer flex items-center justify-center"
            title="Skanuj kod kreskowy"
          >
            <QrCodeIcon />
          </button>
        </div>

        <div className="flex-1 overflow-hidden relative bg-brand-neutral-dark/40">
          <FoodSearch
            query={query}
            loading={loading}
            error={error}
            localHits={localHits}
            addEntryFromFood={addEntryFromFood}
          />
        </div>
      </div>

      <AnimatePresence>
        {isCustomModalOpen && (
          <CustomEntryModal
            onClose={() => setIsCustomModalOpen(false)}
            customEntry={customEntry}
            handleCustomEntryChange={handleCustomEntryChange}
            handleCustomEntrySubmit={(e, data) => {
              handleCustomEntrySubmit(e, data);
              setIsCustomModalOpen(false);
            }}
          />
        )}
        {isScannerModalOpen && (
          <ScannerModal
            onClose={() => setIsScannerModalOpen(false)}
            addEntryFromFood={addEntryFromFood}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
