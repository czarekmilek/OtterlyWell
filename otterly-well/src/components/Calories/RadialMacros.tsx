type RadialMacrosProps = {
  kcal: number;
  kcalGoal: number;
  protein: number;
  fat: number;
  carbs: number;
  goals: { protein: number; fat: number; carbs: number };
};

function circlePercent(current: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
}

function MiniCircle({
  label,
  value,
  goal,
  color,
}: {
  label: string;
  value: number;
  goal: number;
  color: string;
}) {
  const percent = circlePercent(value, goal);
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: "84px",
          height: "84px",
          background: `conic-gradient(${color} ${percent}%, rgba(255,255,255,0.04) 0)`,
        }}
      >
        {/* inner circle */}
        <div
          className="flex flex-col items-center justify-center rounded-full bg-brand-neutral-dark text-brand-neutral-light text-xs"
          style={{ width: "56px", height: "56px" }}
        >
          <span className="font-semibold">
            {value.toFixed ? value.toFixed(0) : value}
          </span>
          <span className="text-[10px] text-brand-secondary">/ {goal}</span>
        </div>
      </div>
      <span className="text-xs text-brand-neutral-light">{label}</span>
    </div>
  );
}

export function RadialMacros({
  kcal,
  kcalGoal,
  protein,
  fat,
  carbs,
  goals,
}: RadialMacrosProps) {
  const kcalPct = circlePercent(kcal, kcalGoal);

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: "125px",
            height: "125px",
            background: `conic-gradient(var(--color-brand-accent-3) ${kcalPct}%, rgba(255,255,255,0.04) 0)`,
          }}
        >
          <div
            className="flex flex-col items-center justify-center rounded-full bg-brand-neutral-dark text-brand-neutral-light"
            style={{ width: "85px", height: "85px" }}
          >
            <span className="text-sm font-semibold">{kcal}</span>
            <span className="text-[10px] text-brand-secondary">
              / {kcalGoal} kcal
            </span>
          </div>
        </div>
        <span className="text-xs text-brand-neutral-light">Kalorie</span>
      </div>

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
      <MiniCircle
        label="Węglowodany"
        value={carbs}
        goal={goals.carbs}
        color="var(--color-brand-accent-2)"
      />
    </div>
  );
}
