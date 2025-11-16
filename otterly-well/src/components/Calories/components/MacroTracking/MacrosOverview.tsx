import { BigCircle } from "./CircleCharts";
import { LinearMacroProgress } from "./LinearMacroProgress";

type MacrosOverviewProps = {
  kcal: number;
  kcalGoal: number;
  protein: number;
  fat: number;
  carbs: number;
  goals: { protein: number; fat: number; carbs: number };
};

export function MacrosOverview({
  kcal,
  kcalGoal,
  protein,
  fat,
  carbs,
  goals,
}: MacrosOverviewProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-4">
      {/* Calorie chart */}
      <BigCircle
        label="Kalorie"
        value={kcal}
        goal={kcalGoal}
        color="var(--color-brand-accent-3)"
      />

      {/* Macro progress bars */}
      <div className="w-full flex flex-col gap-3">
        <LinearMacroProgress
          label="Białko"
          value={protein}
          goal={goals.protein}
          color="var(--color-brand-primary)"
        />
        <LinearMacroProgress
          label="Tłuszcz"
          value={fat}
          goal={goals.fat}
          color="var(--color-brand-accent-1)"
        />
        <LinearMacroProgress
          label="Węglowodany"
          value={carbs}
          goal={goals.carbs}
          color="var(--color-brand-accent-2)"
        />
      </div>
    </div>
  );
}
