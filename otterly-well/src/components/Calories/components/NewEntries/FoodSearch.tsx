import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FoodHitWithGrams, FoodHit } from "../../types/types";
import { AddFoodDialog } from "./AddFoodDialog";

interface FoodSearchProps {
  query: string;
  loading: boolean;
  error: string | null;
  localHits: FoodHitWithGrams[];
  addEntryFromFood: (food: FoodHit, grams: number) => void;
  isRecent?: boolean;
}

export const FoodSearch = ({
  query,
  loading,
  error,
  localHits,
  addEntryFromFood,
  isRecent = false,
}: FoodSearchProps) => {
  const [selectedHit, setSelectedHit] = useState<FoodHitWithGrams | null>(null);

  const openModal = (hit: FoodHitWithGrams) =>
    setSelectedHit({ ...hit, grams: hit.grams > 0 ? hit.grams : 100 });

  const closeModal = () => {
    setSelectedHit(null);
  };

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (selectedHit && selectedHit.grams > 0) {
      addEntryFromFood(selectedHit, selectedHit.grams);
      closeModal();
    }
  };

  const handleGramsChange = (grams: number) => {
    if (selectedHit) {
      setSelectedHit({
        ...selectedHit,
        grams: grams,
      });
    }
  };

  return (
    <>
      <motion.div
        key="search"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="h-full flex flex-col"
      >
        <AnimatePresence>
          {localHits.length > 0 && (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="divide-y divide-white/10 border-b border-brand-depth/40 flex-1 overflow-y-auto min-h-0 max-h-[calc(100vh-15rem)] custom-scrollbar"
            >
              {localHits.map(
                (h) =>
                  h.kcalPer100g != null && (
                    <motion.li
                      key={h.listId}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => openModal(h)}
                      className={`group p-3 flex items-center gap-3 hover:bg-brand-neutral-dark/40 transition cursor-pointer ${
                        isRecent ? "" : ""
                      }`}
                    >
                      {h.imageUrl && (
                        <img
                          src={h.imageUrl}
                          alt={h.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-brand-neutral-light">
                          {h.brand && (
                            <span>
                              <span className="text-brand-secondary">
                                {h.brand}
                              </span>
                              <span className="text-brand-neutral-light mx-1">
                                •
                              </span>
                            </span>
                          )}
                          {h.name}
                        </p>
                        <p className="text-sm text-brand-secondary">
                          {h.kcalPer100g
                            ? `${h.kcalPer100g} kcal / 100g`
                            : "brak danych"}{" "}
                          {h.proteinPer100g != null &&
                            `| ${h.proteinPer100g}g białka`}{" "}
                          {h.fatPer100g != null &&
                            `| ${h.fatPer100g}g tłuszczu`}{" "}
                          {h.carbsPer100g != null &&
                            `| ${h.carbsPer100g}g węglowodanów`}
                        </p>
                      </div>
                    </motion.li>
                  ),
              )}
            </motion.ul>
          )}
        </AnimatePresence>
        {localHits.length === 0 &&
          loading === false &&
          query !== "" &&
          error === null && (
            <p className="m-2 text-brand-secondary">Brak wyników</p>
          )}

        {localHits.length === 0 &&
          loading === false &&
          isRecent &&
          localHits.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-brand-neutral-light/30">
              <p>Brak ostatnio dodawanych produktów</p>
            </div>
          )}

        {loading && (
          <p className="m-2 text-brand-secondary">Szukam w internecie...</p>
        )}
        {error && <p className="m-2 text-brand-warning">Błąd: {error}</p>}
      </motion.div>

      <AddFoodDialog
        isOpen={selectedHit !== null}
        onClose={closeModal}
        onSubmit={handleAddSubmit}
        foodHit={selectedHit}
        onGramsChange={handleGramsChange}
      />
    </>
  );
};
