import { MiniCircle, BigCircle } from "./CircleCharts";

type RadialMacrosProps = {
  kcal: number;
  kcalGoal: number;
  protein: number;
  fat: number;
  carbs: number;
  goals: { protein: number; fat: number; carbs: number };
};

export function RadialMacros({
  kcal,
  kcalGoal,
  protein,
  fat,
  carbs,
  goals,
}: RadialMacrosProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-between">
      <BigCircle
        label="Kalorie"
        value={kcal}
        goal={kcalGoal}
        color="var(--color-brand-accent-3)"
      />
      <MiniCircle
        label="Białko"
        value={protein}
        goal={goals.protein}
        color="var(--color-brand-primary)"
      />
      <MiniCircle
        label="Tłuszcz"
        value={fat}
        goal={goals.fat}
        color="var(--color-brand-accent-1)"
      />
      <BigCircle
        label="Węglowodany"
        value={carbs}
        goal={goals.carbs}
        color="var(--color-brand-accent-2)"
      />
    </div>
  );
}
