import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { WorkoutEntry } from "../../Fitness/types/types";
import { useWeeklyPlan } from "../../Fitness/hooks/useWeeklyPlan";

interface FitnessWidgetSimplifiedProps {
  entries: WorkoutEntry[];
  selectedDate: Date;
}

export function FitnessWidgetSimplified({
  entries,
  selectedDate,
}: FitnessWidgetSimplifiedProps) {
  const { getDayPlan } = useWeeklyPlan();
  const [todaysPlan, setTodaysPlan] = useState<any>(null);

  // 1-2-3-4-5-6-0 mon-sun
  const todayIndex = useMemo(() => {
    const day = selectedDate.getDay();
    return day === 0 ? 0 : day; // 0 - sunday
  }, [selectedDate]);

  useEffect(() => {
    const plan = getDayPlan(todayIndex);
    setTodaysPlan(plan);
  }, [todayIndex, getDayPlan]);

  const stats = useMemo(() => {
    const workouts = new Set(entries.map((e) => e.exercise_id)).size;
    const sets = entries.reduce((acc, e) => acc + (e.sets || 0), 0);
    const lastSet = entries.length > 0 ? entries[entries.length - 1] : null;
    return { workouts, sets, lastSet };
  }, [entries]);

  return (
    <motion.div
      key="fitness-simplified-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-brand-neutral-dark p-4 border border-brand-depth rounded-xl flex flex-col justify-center"
      >
        <p className="text-xs text-brand-neutral-light/60 uppercase tracking-widest mb-1">
          PLAN NA DZIŚ
        </p>

        {todaysPlan ? (
          <div className="flex flex-col gap-2 text-center items-center justify-center h-full">
            <h3 className="text-lg font-bold text-brand-accent-2 line-clamp-2 leading-tight">
              {todaysPlan.name}
            </h3>
            <span className="text-xs text-brand-neutral-light/50 bg-brand-depth/50 px-2 py-0.5 rounded-full inline-block">
              {todaysPlan.items?.length || 0} ćwiczeń
            </span>
          </div>
        ) : (
          <span className="text-brand-neutral-light/30 italic text-sm text-center">
            Brak planu
          </span>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-brand-neutral-dark p-4 border border-brand-depth rounded-xl h-full flex flex-col justify-center min-h-[100px]"
      >
        <p className="text-xs text-brand-neutral-light/70 uppercase tracking-wide mb-2">
          Ostatnia seria
        </p>
        {stats.lastSet ? (
          <div className="flex flex-col gap-1">
            <span className="text-lg font-bold text-brand-neutral-light line-clamp-1">
              {stats.lastSet.exercise?.name || "Nieznane ćwiczenie"}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-brand-accent-1 bg-brand-accent-1/10 px-2 py-0.5 rounded">
                {new Date(stats.lastSet.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {stats.lastSet.distance_km ? (
                <span className="text-xs text-brand-accent-1 bg-brand-accent-1/10 px-2 py-0.5 rounded">
                  {stats.lastSet.distance_km} km x {stats.lastSet.duration_min}{" "}
                  min
                </span>
              ) : stats.lastSet.weight_kg ? (
                <span className="text-xs text-brand-accent-1 bg-brand-accent-1/10 px-2 py-0.5 rounded">
                  {stats.lastSet.weight_kg} kg x {stats.lastSet.reps}
                </span>
              ) : (
                <span className="text-xs text-brand-accent-1 bg-brand-accent-1/10 px-2 py-0.5 rounded">
                  {stats.lastSet.duration_min} min
                </span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-brand-neutral-light/50 italic text-sm">
            Brak aktywności
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
