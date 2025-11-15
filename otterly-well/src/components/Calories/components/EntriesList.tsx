import { motion, AnimatePresence } from "framer-motion";
import type { Entry } from "../types";
import { EntryItem } from "./EntryItem";

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
              <EntryItem key={e.id} entry={e} removeEntry={removeEntry} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.section>
  );
};
