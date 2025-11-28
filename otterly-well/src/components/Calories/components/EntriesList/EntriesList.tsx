import { motion, AnimatePresence } from "framer-motion";
import type { Entry } from "../../types/types";
import { EntryItem } from "./EntryItem";

interface EntriesListProps {
  entries: Entry[];
  removeEntry: (id: string) => void;
  isLoading: boolean;
}

export const EntriesList = ({
  entries,
  removeEntry,
  isLoading,
}: EntriesListProps) => {
  return (
    <motion.section
      layout
      className="rounded-xl border border-brand-depth bg-brand-neutral-dark/50 p-4
                flex flex-col flex-1 min-h-0"
    >
      <h2 className="text-lg font-semibold text-brand-neutral-light mb-2">
        Historia posiłków
      </h2>

      <div className="min-h-0 flex-1 overflow-y-auto mt-2 -mr-2 pr-2">
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          />
        ) : entries.length === 0 ? (
          <p className="mt-4 text-brand-secondary">
            Nic dziś jeszcze nie dodano. Dodaj pierwszy produkt na panelu obok.
          </p>
        ) : (
          <ul className="divide-y divide-brand-depth/70">
            <AnimatePresence>
              {entries.map((e) => (
                <EntryItem key={e.id} entry={e} removeEntry={removeEntry} />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </motion.section>
  );
};
