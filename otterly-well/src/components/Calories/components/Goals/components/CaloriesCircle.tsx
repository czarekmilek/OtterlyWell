interface CaloriesCircleProps {
  consumed: number;
  goal: number;
}

export function CaloriesCircle({ consumed, goal }: CaloriesCircleProps) {
  const percent = goal > 0 ? (consumed / goal) * 100 : 0;
  const remaining = goal - consumed;
  const isOver = remaining < 0;

  const visualPercent = Math.min(percent, 100);

  // TODO: Add animation
  // Adjusted the calorie chart to look and act like bilance chart in finacne component
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="w-64 h-64 rounded-full shadow-lg shadow-black/30 transition-all duration-300"
        style={{
          background: `conic-gradient(
                        var(--color-brand-accent-3) 0% ${visualPercent}%, 
                        var(--color-brand-neutral-dark) ${visualPercent}% 100%)`,
        }}
      >
        <div
          className="flex flex-col items-center justify-center absolute inset-0 m-auto w-44 h-44 
                      bg-brand-neutral-dark rounded-full border-4 border-brand-neutral-light/5 
                      transition-all duration-300"
        >
          <span className="text-xs text-brand-secondary uppercase tracking-wider">
            {isOver ? "Nadwyżka" : "Pozostało"}
          </span>
          <span
            className={`text-3xl font-bold ${
              isOver ? "text-brand-negative" : "text-brand-positive-lighter"
            }`}
          >
            {isOver ? "+" : ""}
            {Math.abs(remaining).toFixed(0)}
            <span className="text-lg font-normal text-brand-secondary ml-1">
              kcal
            </span>
          </span>
          <span className="text-xs text-brand-secondary mt-1">
            {((consumed / (goal || 1)) * 100).toFixed(0)}% celu
          </span>
        </div>
      </div>
    </div>
  );
}
