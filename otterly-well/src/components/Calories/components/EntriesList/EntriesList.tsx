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
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-end lg:justify-end">
        <h2 className="glass-header text-lg rounded-t-xl py-2 px-4">
          Historia posiłków
        </h2>
      </div>
      <motion.section
        layout
        className="glass-panel rounded-b-2xl rounded-tr-2xl lg:rounded-tr-none lg:rounded-tl-2xl p-4 flex-1 min-h-0 overflow-y-auto"
      >
        <div className="h-full flex flex-col">
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : entries.length === 0 ? (
            <p className="mt-4 text-brand-secondary">
              Nic dziś jeszcze nie dodano. Dodaj pierwszy produkt na panelu
              obok.
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
    </div>
  );
};
