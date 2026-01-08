import { motion, AnimatePresence } from "framer-motion";
import type { WorkoutEntry } from "../../types/types";
import WorkoutItem from "./WorkoutItem";

interface WorkoutListProps {
  entries: WorkoutEntry[];
  onRemoveEntry: (id: string) => void;
  isLoading: boolean;
}

export default function WorkoutList({
  entries,
  onRemoveEntry,
  isLoading,
}: WorkoutListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 bg-brand-neutral-dark/50 border border-brand-depth rounded-xl p-4 flex items-center justify-center">
        <p className="text-brand-neutral-light/50">Ładowanie treningów...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex-1 bg-brand-neutral-dark/50 border border-brand-depth rounded-xl p-4 flex items-center justify-center">
        <p className="text-brand-neutral-light/50">Brak treningów tego dnia</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-brand-neutral-dark/50 border border-brand-depth rounded-xl p-4 overflow-y-auto custom-scrollbar">
      <motion.div
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        <AnimatePresence mode="popLayout">
          {entries.map((entry) => (
            <WorkoutItem
              key={entry.id}
              entry={entry}
              onRemoveEntry={onRemoveEntry}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
