import { useState, useEffect } from "react";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WorkoutEntry } from "../../types/types";
import { useWeeklyPlan } from "../../hooks/useWeeklyPlan";
import WeeklyPlanModal from "./WeeklyPlanModal";
import { EditIcon } from "../../../icons";

interface FitnessGoalsProps {
  entries: WorkoutEntry[];
  selectedDate: Date;
}

export default function FitnessSummary({
  entries,
  selectedDate,
}: FitnessGoalsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getDayPlan, refreshPlan } = useWeeklyPlan();
  const [todaysPlan, setTodaysPlan] = useState<any>(null);

  // 1-2-3-4-5-6-0 mon-sun
  const todayIndex = useMemo(() => {
    const day = selectedDate.getDay();
    return day === 0 ? 0 : day; // 0 - sunday
  }, [selectedDate]);

  useEffect(() => {
    refreshPlan();
  }, []);

  useEffect(() => {
    const plan = getDayPlan(todayIndex);
    setTodaysPlan(plan);
  }, [todayIndex, getDayPlan]);

  const stats = useMemo(() => {
    const workouts = new Set(entries.map((e) => e.exercise_id)).size;
    const sets = entries.reduce((acc, e) => acc + (e.sets || 0), 0);
    const volume = entries.reduce(
      (acc, e) => acc + (e.sets || 0) * (e.reps || 0) * (e.weight_kg || 0),
      0
    );
    const distance_km = entries.reduce(
      (acc, e) => acc + (e.distance_km || 0),
      0
    );

    const lastSet = entries.length > 0 ? entries[0] : null;

    return { workouts, sets, volume, distance_km, lastSet };
  }, [entries]);

  return (
    <>
      <div className="bg-brand-neutral-dark/40 border border-brand-depth rounded-2xl p-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  <span className="text-sm text-brand-secondary">
                    {stats.lastSet.weight_kg} kg x {stats.lastSet.reps}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-brand-neutral-light/50 italic text-sm">
                Brak aktywności
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-brand-neutral-dark p-4 border border-brand-depth rounded-xl h-full flex flex-col justify-center min-h-[100px]"
          >
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-brand-neutral-light/60 uppercase tracking-widest mb-1">
                  {selectedDate.toLocaleDateString("pl-PL", {
                    weekday: "long",
                  })}
                  : PLAN
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center text-brand-neutral-light hover:text-white transition-all hover:bg-brand-depth/50 
                            p-1 rounded-full cursor-pointer"
                  title="Zmień plan"
                >
                  <EditIcon className="scale-80" />
                </button>
              </div>

              {todaysPlan ? (
                <div className="text-center px-6">
                  <h3 className="text-xl lg:text-2xl font-bold text-brand-accent-2 mb-2 line-clamp-2">
                    {todaysPlan.name}
                  </h3>
                  <span className="text-xs text-brand-neutral-light/50 bg-brand-depth/50 px-2 py-1 rounded-full">
                    Liczba ćwiczeń: {todaysPlan.items?.length || 0}
                  </span>
                </div>
              ) : (
                <span className="text-brand-neutral-light/30 italic px-4 text-center">
                  Brak planu
                </span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-brand-neutral-dark p-4 border border-brand-depth rounded-xl flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-brand-neutral-light/70 uppercase tracking-wide mb-1">
                Objętość • Przebieg
              </p>
              <p className={`text-2xl font-bold text-brand-accent-1`}>
                <span className="text-brand-accent-3">{stats.volume} kg</span>{" "}
                <span className="text-brand-neutral-light/50">•</span>{" "}
                <span className="text-brand-accent-1">
                  {stats.distance_km} km
                </span>
              </p>
            </div>
          </motion.div>
          {/* <MotionPeek
            label="Serie"
            value={stats.sets}
            color="text-brand-accent-2"
            bg="bg-brand-accent-2"
            delay={0.2}
          /> */}

          {/* <MotionPeek
            label="Objętość (kg)"
            value={Math.round(stats.volume)}
            color="text-brand-accent-3"
            bg="bg-brand-accent-3"
            delay={0.3}
          /> */}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <WeeklyPlanModal onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
