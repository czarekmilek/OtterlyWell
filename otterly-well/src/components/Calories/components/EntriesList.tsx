import { motion, AnimatePresence } from "framer-motion";
import type { Entry } from "../types";
import { MacroBar } from "../MacroBar";

interface EntriesListProps {
  entries: Entry[];
  removeEntry: (id: string) => void;
}

export const EntriesList = ({ entries, removeEntry }: EntriesListProps) => {
  return (
    <motion.section
      layout
      className="rounded-xl border border-brand-depth bg-brand-neutral-dark/50 p-4"
    >
      <h2 className="text-lg font-semibold text-brand-neutral-light mb-2">
        Historia posiłków
      </h2>

      {entries.length === 0 ? (
        <p className="mt-4 text-brand-secondary">
          Nic dziś jeszcze nie dodano. Dodaj pierwszy produkt powyżej.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-brand-depth/5">
          <AnimatePresence>
            {entries.map((e) => (
              <motion.li
                key={e.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between py-3 gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-brand-neutral-light">{e.name}</p>
                  <p className="text-sm text-brand-secondary">
                    {e.kcal} kcal | B {e.protein.toFixed(1)}g | T{" "}
                    {e.fat.toFixed(1)}g | W {e.carbs.toFixed(1)}g
                  </p>
                </div>
                <MacroBar protein={e.protein} fat={e.fat} carbs={e.carbs} />
                <button
                  onClick={() => removeEntry(e.id)}
                  className="rounded-md border border-brand-depth bg-brand-neutral-dark px-3 py-1 text-sm 
                          text-brand-neutral-light hover:bg-brand-primary hover:cursor-pointer transition:color duration-200"
                >
                  Usuń
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.section>
  );
};
