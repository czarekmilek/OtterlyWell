import { useEffect } from "react";
import { motion } from "framer-motion";
import { CloseIcon } from "../../../icons";
import { useWeeklyPlan } from "../../hooks/useWeeklyPlan";
import { useWorkoutSets } from "../../hooks/useWorkoutSets";

interface WeeklyPlanModalProps {
  onClose: () => void;
}

const DAYS = [
  { id: 1, name: "Poniedziałek" },
  { id: 2, name: "Wtorek" },
  { id: 3, name: "Środa" },
  { id: 4, name: "Czwartek" },
  { id: 5, name: "Piątek" },
  { id: 6, name: "Sobota" },
  { id: 0, name: "Niedziela" },
];

export default function WeeklyPlanModal({ onClose }: WeeklyPlanModalProps) {
  const {
    weeklyPlan,
    updateScheduledDay,
    loading: planLoading,
  } = useWeeklyPlan();
  const {
    sets: allSets,
    loading: setsLoading,
    refreshSets,
  } = useWorkoutSets("");

  useEffect(() => {
    refreshSets();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-brand-neutral-dark border border-brand-depth rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
      >
        <div className="p-6 border-b border-brand-depth flex justify-between items-center">
          <h2 className="text-xl lg:text-2xl font-bold text-brand-neutral-light">
            Plan tygodniowy
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center p-2 hover:bg-brand-depth/50 rounded-full transition-colors 
                text-brand-neutral-light/60 hover:text-brand-neutral-light cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
          {planLoading || setsLoading ? (
            <div className="py-10 text-center text-brand-neutral-light/50">
              Ładowanie...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {DAYS.map((day) => {
                // displaying sets for selected day, not CURRENT day
                const currentSet = weeklyPlan.find(
                  (s) => s.scheduled_day === day.id,
                );

                return (
                  <div
                    key={day.id}
                    className="flex items-center gap-4 bg-brand-depth/20 p-3 rounded-xl border border-brand-depth/40 hover:border-brand-depth transition-colors"
                  >
                    <div className="truncate w-14 lg:w-28 font-medium text-brand-neutral-light">
                      {day.name}
                    </div>
                    <div className="flex-1">
                      <select
                        value={currentSet?.id || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val && currentSet) {
                            updateScheduledDay(currentSet.id, null);
                          } else if (val) {
                            updateScheduledDay(val, day.id);
                          }
                        }}
                        className="w-full bg-brand-neutral-dark border border-brand-depth/60 rounded-lg px-3 py-2 text-sm text-brand-neutral-light focus:border-brand-accent-1 
                                focus:ring-1 focus:ring-brand-accent-1 outline-none"
                      >
                        <option value="">Brak planu</option>
                        {allSets.map((set) => (
                          <option key={set.id} value={set.id}>
                            {set.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-brand-depth flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-brand-accent-1 hover:bg-brand-accent-2 text-white font-bold rounded-xl transition-all shadow-lg cursor-pointer"
          >
            Gotowe
          </button>
        </div>
      </motion.div>
    </div>
  );
}
