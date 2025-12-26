interface FinanceCircleProps {
  income: number;
  expense: number;
}

export function FinanceCircle({ income, expense }: FinanceCircleProps) {
  const total = income + expense;

  let incomePercent = 0;
  if (total > 0) {
    incomePercent = (income / total) * 100;
  }

  // if no data for chart, display no data message chart to keep layout
  if (total === 0) {
    return (
      <div className="relative flex items-center justify-center">
        <div
          className="flex items-center justify-center relative w-32 h-32 lg:w-64 lg:h-64 
                  bg-brand-neutral-dark border-4 border-brand-depth rounded-full 
                  transition-all duration-300"
        >
          <span className="font-medium text-xs lg:text-lg text-brand-secondary uppercase tracking-wider">
            Brak danych
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      <div
        className="w-64 h-64 rounded-full shadow-lg shadow-black/30 transition-all duration-300"
        // style={{
        //   background: `conic-gradient(#10B981 0% ${incomePercent}%,
        //               #EF4444 ${incomePercent}% 100%)`,
        // }}
        style={{
          background: `conic-gradient(
                      var(--color-brand-positive) 0% ${incomePercent}%, 
                      var(--color-brand-negative) ${incomePercent}% 100%)`,
        }}
      >
        <div
          className="flex flex-col items-center justify-center absolute inset-0 m-auto w-42 h-42 
                    bg-brand-neutral-dark rounded-full border-4 border-brand-neutral-light/5 
                    transition-all duration-300"
        >
          <span className="text-xs text-brand-secondary uppercase tracking-wider">
            Bilans
          </span>
          <span
            className={`text-3xl font-bold ${
              income - expense >= 0
                ? "text-brand-positive-lighter"
                : "text-brand-negative"
            }`}
          >
            {income - expense > 0 ? "+" : ""}
            {(income - expense).toFixed(0)}
            <span className="text-lg font-normal text-brand-secondary ml-1">
              PLN
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
