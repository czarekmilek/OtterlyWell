import { motion, AnimatePresence } from "framer-motion";
import type { FoodHitWithGrams, FoodHit } from "../types";

interface FoodSearchProps {
  query: string;
  setQuery: (query: string) => void;
  loading: boolean;
  error: string | null;
  localHits: FoodHitWithGrams[];
  addEntryFromFood: (food: FoodHit, grams: number) => void;
  setLocalHits: (hits: FoodHitWithGrams[]) => void;
}

export const FoodSearch = ({
  query,
  setQuery,
  loading,
  error,
  localHits,
  addEntryFromFood,
  setLocalHits,
}: FoodSearchProps) => {
  return (
    <motion.div
      key="search"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="pt-4 px-4 bg-brand-neutral-dark/50 rounded-b-xl"
    >
      <input
        type="text"
        placeholder="Szukaj produktu..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-md border border-brand-depth bg-brand-neutral-dark px-3 py-2 text-brand-neutral-light 
                placeholder-brand-secondary focus:ring-2 focus:ring-brand-accent-1/40 focus:outline-none"
      />
      {loading && <p className="mt-2 text-brand-secondary">Szukam...</p>}
      {error && <p className="mt-2 text-red-500">Błąd: {error}</p>}

      {/* Results */}
      <AnimatePresence>
        {localHits.length > 0 && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="divide-y divide-white/10 rounded-lg border border-white/10 max-h-84 overflow-y-auto"
          >
            {localHits.map(
              (h, index) =>
                h.kcalPer100g &&
                h.id && (
                  <motion.li
                    key={h.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="group p-3 flex items-center gap-3 hover:bg-gray-700/50 transition"
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
                        onSubmit={(e: React.FormEvent) => {
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
                            setLocalHits(
                              localHits.map((item, i) =>
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
                      </form>
                    )}
                  </motion.li>
                )
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
