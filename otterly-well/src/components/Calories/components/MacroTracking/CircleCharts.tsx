function circlePercent(current: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
}

export function MiniCircle({
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
          width: "105px",
          height: "105px",
          background: `conic-gradient(${color} ${percent}%, rgba(255,255,255,0.04) 0)`,
        }}
      >
        {/* inner circle */}
        <div
          className="flex flex-col items-center justify-center rounded-full bg-brand-neutral-dark text-brand-neutral-light text-xs"
          style={{ width: "70px", height: "70px" }}
        >
          <span className="font-semibold text-sm">
            {value.toFixed ? value.toFixed(0) : value}
          </span>
          <span className="text-sm text-brand-secondary">/ {goal}</span>
        </div>
      </div>
      <span className="text-xs text-brand-neutral-light">{label}</span>
    </div>
  );
}

export function BigCircle({
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
          width: "125px",
          height: "125px",
          background: `conic-gradient(${color} ${percent}%, rgba(255,255,255,0.04) 0)`,
        }}
      >
        {/* inner circle */}
        <div
          className="flex flex-col items-center justify-center rounded-full bg-brand-neutral-dark text-brand-neutral-light"
          style={{ width: "70px", height: "70px" }}
        >
          <span className="text-sm font-semibold">
            {value.toFixed ? value.toFixed(0) : value}
          </span>
          <span className="text-xs text-brand-secondary">/ {goal}</span>
        </div>
      </div>
      <span className="text-xs text-brand-neutral-light">{label}</span>
    </div>
  );
}
