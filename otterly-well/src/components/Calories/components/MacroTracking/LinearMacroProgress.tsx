function circlePercent(current: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
}

type LinearMacroProgressProps = {
  label: string;
  value: number;
  goal: number;
  color: string;
};

export function LinearMacroProgress({
  label,
  value,
  goal,
  color,
}: LinearMacroProgressProps) {
  const percent = circlePercent(value, goal);

  return (
    <div className="w-full">
      {/* Label, progress and goal */}
      <div className="text-sm flex justify-between items-baseline mb-1">
        <span className="font-semibold text-brand-neutral-light">{label}</span>
        <span className="text-brand-neutral-light">
          {value.toFixed(0)}g /{" "}
          <span className="text-brand-secondary">{goal}g</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-4 w-full rounded-full bg-brand-neutral-dark overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
}
