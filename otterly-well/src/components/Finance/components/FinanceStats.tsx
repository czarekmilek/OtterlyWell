import { FinanceCircle } from "./FinanceCircle";

interface FinanceStatsProps {
  stats: { income: number; expense: number };
  moneyLeft: number;
  totalBudget: number;
}

export function FinanceStats({
  stats,
  moneyLeft,
  totalBudget,
}: FinanceStatsProps) {
  return (
    <div className="bg-brand-neutral-dark/40 border border-brand-depth rounded-2xl p-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
        <div className="flex-shrink-0">
          <FinanceCircle income={stats.income} expense={stats.expense} />
        </div>

        <div className="flex-grow w-full grid grid-cols-2 gap-4">
          {/* Income Card */}
          <div className="bg-brand-neutral-dark rounded-xl p-4 border border-brand-depth">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <p className="text-xs text-brand-neutral-light/70 uppercase tracking-wide">
                Przychody
              </p>
            </div>
            <p className="text-2xl font-bold text-emerald-400">
              +{stats.income.toFixed(2)}
            </p>
          </div>

          {/* Expense Card */}
          <div className="bg-brand-neutral-dark rounded-xl p-4 border border-brand-depth">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <p className="text-xs text-brand-neutral-light/70 uppercase tracking-wide">
                Wydatki
              </p>
            </div>
            <p className="text-2xl font-bold text-red-400">
              -{stats.expense.toFixed(2)}
            </p>
          </div>

          {/* Budget Status Card */}
          <div className="col-span-2 bg-brand-neutral-dark rounded-xl p-4 border border-brand-depth flex justify-between items-center group">
            <div>
              <p className="text-xs text-brand-neutral-light/70 uppercase tracking-wide mb-1">
                Pozostało w budżecie
              </p>
              <p
                className={`text-3xl font-bold ${
                  moneyLeft >= 0 ? "text-brand-accent-1" : "text-red-400"
                } transition-colors`}
              >
                {moneyLeft.toFixed(2)}{" "}
                <span className="text-base font-normal text-brand-secondary">
                  PLN
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-brand-secondary">Planowany budżet</p>
              <p className="text-lg font-bold text-brand-neutral-light">
                {totalBudget.toFixed(0)} PLN
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
