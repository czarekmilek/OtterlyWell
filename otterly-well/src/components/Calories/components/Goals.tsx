import { motion } from "framer-motion";
import { MacrosOverview } from "./MacroTracking/MacrosOverview";

interface GoalsProps {
  goalCalories: number;
  totalCalories: {
    kcal: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  goalProtein: number;
  goalFat: number;
  goalCarbs: number;
  setGoalCalories: (value: number) => void;
  setGoalProtein: (value: number) => void;
  setGoalFat: (value: number) => void;
  setGoalCarbs: (value: number) => void;
  isLoading: boolean;
}

export const Goals = ({
  goalCalories,
  totalCalories,
  goalProtein,
  goalFat,
  goalCarbs,
  setGoalCalories,
  setGoalProtein,
  setGoalFat,
  setGoalCarbs,
  isLoading,
}: GoalsProps) => {
  return (
    <motion.div className="glass-panel rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-brand-secondary">Dzisiejszy cel</p>
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }}
              className="mt-2 w-6 h-6 border-5 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <p className="text-3xl font-semibold text-brand-neutral-light">
              {goalCalories} kcal
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-brand-secondary">Zjedzono</p>
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }}
              className="mt-2 w-6 h-6 border-5 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <p className="text-3xl font-semibold text-brand-neutral-light">
              {totalCalories.kcal} kcal
            </p>
          )}
        </div>
      </div>

      {/* Goals inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <label className="flex flex-col text-sm text-brand-neutral-light">
          Kalorie
          <input
            type="number"
            min={1}
            disabled={isLoading}
            className="mt-1 rounded-md border border-brand-depth bg-brand-neutral-dark px-2 py-1 text-brand-neutral-light focus:ring-2 
                    focus:ring-brand-accent-1/40 focus:outline-none disabled:opacity-50"
            value={goalCalories}
            onChange={(e) => {
              const v = Number(e.target.value);
              setGoalCalories(v > 0 ? v : 0);
            }}
          />
        </label>

        <label className="flex flex-col text-sm text-brand-neutral-light">
          Białko
          <input
            type="number"
            min={0}
            disabled={isLoading}
            className="mt-1 rounded-md border border-brand-depth bg-brand-neutral-dark px-2 py-1 text-brand-neutral-light focus:ring-2 
                    focus:ring-brand-accent-1/40 focus:outline-none disabled:opacity-50"
            value={goalProtein}
            onChange={(e) => setGoalProtein(Number(e.target.value) || 0)}
          />
        </label>

        <label className="flex flex-col text-sm text-brand-neutral-light">
          Tłuszcz
          <input
            type="number"
            min={0}
            disabled={isLoading}
            className="mt-1 rounded-md border border-brand-depth bg-brand-neutral-dark px-2 py-1 text-brand-neutral-light focus:ring-2 
                    focus:ring-brand-accent-1/40 focus:outline-none disabled:opacity-50"
            value={goalFat}
            onChange={(e) => setGoalFat(Number(e.target.value) || 0)}
          />
        </label>

        <label className="flex flex-col text-sm text-brand-neutral-light">
          Węglowodany
          <input
            type="number"
            min={0}
            disabled={isLoading}
            className="mt-1 rounded-md border border-brand-depth bg-brand-neutral-dark px-2 py-1 text-brand-neutral-light focus:ring-2 
                    focus:ring-brand-accent-1/40 focus:outline-none disabled:opacity-50"
            value={goalCarbs}
            onChange={(e) => setGoalCarbs(Number(e.target.value) || 0)}
          />
        </label>
      </div>

      <MacrosOverview
        kcal={totalCalories.kcal}
        kcalGoal={goalCalories}
        protein={totalCalories.protein}
        fat={totalCalories.fat}
        carbs={totalCalories.carbs}
        goals={{ protein: goalProtein, fat: goalFat, carbs: goalCarbs }}
      />
    </motion.div>
  );
};
