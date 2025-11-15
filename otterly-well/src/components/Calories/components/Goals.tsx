import { motion } from "framer-motion";
import { RadialMacros } from "../RadialMacros";

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
}: GoalsProps) => {
  return (
    <motion.div className="rounded-xl border border-white/10 bg-gray-800/50 p-4 flex flex-col gap-4 lg:w-1/2">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-gray-400">Dzisiejszy cel</p>
          <p className="text-3xl font-semibold text-gray-100">
            {goalCalories} kcal
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-400">Zjedzono</p>
          <p className="text-3xl font-semibold text-gray-100">
            {totalCalories.kcal} kcal
          </p>
        </div>
      </div>

      {/* Goals inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <label className="flex flex-col text-sm text-gray-300">
          Kalorie
          <input
            type="number"
            min={1}
            className="mt-1 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:ring-2 focus:ring-orange-400/40 focus:outline-none"
            value={goalCalories}
            onChange={(e) => {
              const v = Number(e.target.value);
              setGoalCalories(v > 0 ? v : 0);
            }}
          />
        </label>

        <label className="flex flex-col text-sm text-gray-300">
          Białko
          <input
            type="number"
            min={0}
            className="mt-1 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:ring-2 focus:ring-orange-400/40 focus:outline-none"
            value={goalProtein}
            onChange={(e) => setGoalProtein(Number(e.target.value) || 0)}
          />
        </label>

        <label className="flex flex-col text-sm text-gray-300">
          Tłuszcz
          <input
            type="number"
            min={0}
            className="mt-1 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:ring-2 focus:ring-orange-400/40 focus:outline-none"
            value={goalFat}
            onChange={(e) => setGoalFat(Number(e.target.value) || 0)}
          />
        </label>

        <label className="flex flex-col text-sm text-gray-300">
          Węglowodany
          <input
            type="number"
            min={0}
            className="mt-1 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:ring-2 focus:ring-orange-400/40 focus:outline-none"
            value={goalCarbs}
            onChange={(e) => setGoalCarbs(Number(e.target.value) || 0)}
          />
        </label>
      </div>

      <RadialMacros
        kcal={totalCalories.kcal}
        kcalGoal={goalCalories}
        protein={totalCalories.protein}
        fat={totalCalories.fat}
        carbs={totalCalories.carbs}
        goals={{
          protein: goalProtein,
          fat: goalFat,
          carbs: goalCarbs,
        }}
      />
    </motion.div>
  );
};
