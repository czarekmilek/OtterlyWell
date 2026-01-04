import { motion } from "framer-motion";
import { LinearMacroProgress } from "../../MacroTracking/LinearMacroProgress";
import { StatsCard } from "./StatsCard";
import { CaloriesCircle } from "./CaloriesCircle";
import { CalculateIcon, TimelineIcon } from "../../../../icons";

interface GoalsStatsProps {
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
}

export function GoalsStats({
  goalCalories,
  totalCalories,
  goalProtein,
  goalFat,
  goalCarbs,
}: GoalsStatsProps) {
  return (
    <motion.div
      key="stats-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0"
    >
      <div className="flex flex-col gap-4 order-2 lg:order-1 justify-center">
        <StatsCard
          label="Cel dzienny"
          value={goalCalories}
          unit="kcal"
          icon={<CalculateIcon />}
          type="neutral"
        />
        <StatsCard
          label="Spożyto"
          value={totalCalories.kcal}
          unit="kcal"
          icon={<TimelineIcon />}
          type={totalCalories.kcal > goalCalories ? "negative" : "positive"}
        />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="order-1 lg:order-2 lg:-mt-16 overflow-visible flex items-center justify-center pointer-events-none"
      >
        <CaloriesCircle consumed={totalCalories.kcal} goal={goalCalories} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="h-full order-3 flex flex-col justify-center"
      >
        <div className="bg-brand-neutral-dark rounded-xl p-4 border border-brand-depth flex flex-col gap-3.5">
          <p className="text-xs text-brand-secondary uppercase tracking-wider mb-2">
            Makroskladniki
          </p>
          <LinearMacroProgress
            label="Białko"
            value={totalCalories.protein}
            goal={goalProtein}
            color="var(--color-brand-primary)"
          />
          <LinearMacroProgress
            label="Tłuszcz"
            value={totalCalories.fat}
            goal={goalFat}
            color="var(--color-brand-accent-1)"
          />
          <LinearMacroProgress
            label="Węgle"
            value={totalCalories.carbs}
            goal={goalCarbs}
            color="var(--color-brand-accent-2)"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
