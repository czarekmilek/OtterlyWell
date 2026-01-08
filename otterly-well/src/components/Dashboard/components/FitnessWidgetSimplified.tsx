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
    return { workouts, sets };
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
        transition={{ delay: 0.2 }}
        className="bg-brand-neutral-dark p-4 border border-brand-depth rounded-xl flex items-center justify-between"
      >
        <div>
          <p className="text-xs text-brand-neutral-light/70 uppercase tracking-wide mb-1">
            Ćwiczenia • Serie
          </p>
          <p className={`text-2xl font-bold text-brand-accent-1`}>
            {stats.workouts}{" "}
            <span className="text-brand-neutral-light/50">•</span>{" "}
            <span className="text-brand-accent-3">{stats.sets}</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
