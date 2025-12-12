import { useMemo } from "react";
import { motion } from "framer-motion";
import type { WorkoutEntry } from "../../types/types";

interface FitnessGoalsProps {
  entries: WorkoutEntry[];
}

export default function FitnessGoals({ entries }: FitnessGoalsProps) {
  const stats = useMemo(() => {
    return entries.reduce(
      (acc, entry) => {
        acc.workouts += 1;
        acc.sets += entry.sets || 0;
        acc.volume +=
          (entry.sets || 0) * (entry.reps || 0) * (entry.weight_kg || 0);
        return acc;
      },
      { workouts: 0, sets: 0, volume: 0 }
    );
  }, [entries]);

  return (
    <div className="bg-brand-neutral-dark/50 border border-brand-depth rounded-xl p-4 flex flex-col justify-between gap-2">
      <h3 className="text-brand-neutral-light font-bold text-lg">
        Podsumowanie dnia
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-brand-neutral-dark rounded-lg p-3 border border-brand-depth text-center"
        >
          <p className="text-2xl font-bold text-brand-accent-1">
            {stats.workouts}
          </p>
          <p className="text-xs text-brand-neutral-light/70 uppercase">
            Ćwiczenia
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-brand-neutral-dark rounded-lg p-3 border border-brand-depth text-center"
        >
          <p className="text-2xl font-bold text-brand-accent-2">{stats.sets}</p>
          <p className="text-xs text-brand-neutral-light/70 uppercase">Serie</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-brand-neutral-dark rounded-lg p-3 border border-brand-depth text-center"
        >
          <p className="text-2xl font-bold text-brand-accent-3">
            {Math.round(stats.volume)}
          </p>
          <p className="text-xs text-brand-neutral-light/70 uppercase">
            Objętość (kg)
          </p>
        </motion.div>
      </div>
    </div>
  );
}
