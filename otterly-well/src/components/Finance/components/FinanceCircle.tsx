interface FinanceCircleProps {
  income: number;
  expense: number;
}

export function FinanceCircle({ income, expense }: FinanceCircleProps) {
  const total = income + expense;
  const incomePercent = total > 0 ? (income / total) * 100 : 0;

  if (total === 0) {
    return (
      <div className="relative w-32 h-32 rounded-full border-4 border-brand-depth flex items-center justify-center bg-brand-neutral-dark/30">
        <span className="text-brand-secondary text-xs font-medium uppercase tracking-wider">
          Brak danych
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      <div
        className="w-32 h-32 rounded-full shadow-lg shadow-black/50"
        style={{
          background: `conic-gradient(#10B981 0% ${incomePercent}%, #EF4444 ${incomePercent}% 100%)`,
        }}
      >
        <div className="absolute inset-0 m-auto w-24 h-24 bg-brand-neutral-dark rounded-full flex flex-col items-center justify-center border-4 border-brand-neutral-light/5">
          <span
            className={`text-md font-bold ${
              income - expense >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {income - expense > 0 ? "+" : ""}
            {(income - expense).toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
}
