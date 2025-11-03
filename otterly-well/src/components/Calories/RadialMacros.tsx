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
          className="flex flex-col items-center justify-center rounded-full bg-gray-900 text-gray-100 text-xs"
          style={{ width: "56px", height: "56px" }}
        >
          <span className="font-semibold">
            {value.toFixed ? value.toFixed(0) : value}
          </span>
          <span className="text-[10px] text-gray-400">/ {goal}</span>
        </div>
      </div>
      <span className="text-xs text-gray-300">{label}</span>
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
            width: "100px",
            height: "100px",
            background: `conic-gradient(rgb(249 115 22) ${kcalPct}%, rgba(255,255,255,0.04) 0)`,
          }}
        >
          <div
            className="flex flex-col items-center justify-center rounded-full bg-gray-900 text-gray-100"
            style={{ width: "68px", height: "68px" }}
          >
            <span className="text-sm font-semibold">{kcal}</span>
            <span className="text-[10px] text-gray-400">/ {kcalGoal} kcal</span>
          </div>
        </div>
        <span className="text-xs text-gray-300">Kalorie</span>
      </div>

      <MiniCircle
        label="Białko"
        value={protein}
        goal={goals.protein}
        color="rgb(52 211 153)"
      />
      <MiniCircle
        label="Tłuszcz"
        value={fat}
        goal={goals.fat}
        color="rgb(244 63 94)"
      />
      <MiniCircle
        label="Węglowodany"
        value={carbs}
        goal={goals.carbs}
        color="rgb(56 189 248)"
      />
    </div>
  );
}
