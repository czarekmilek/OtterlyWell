import { motion } from "framer-motion";
import { FinanceCircle } from "./components/FinanceCircle";
import { FinanceBudget } from "./components/FinanceBudget";

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
    <div className="bg-brand-neutral-dark/40 border border-brand-depth rounded-2xl p-6 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0">
        <div className="flex flex-col gap-4 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-brand-neutral-dark border border-brand-depth rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-brand-positive-lighter rounded-full"></div>
              <p className="text-xs text-brand-neutral-light/70 uppercase tracking-wide">
                Przychody
              </p>
            </div>
            <p className="text-2xl font-bold text-brand-positive-lighter">
              +{stats.income.toFixed(2)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-brand-neutral-dark border border-brand-depth rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-brand-negative rounded-full"></div>
              <p className="text-xs text-brand-neutral-light/70 uppercase tracking-wide">
                Wydatki
              </p>
            </div>
            <p className="text-2xl font-bold text-brand-negative">
              -{stats.expense.toFixed(2)}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="order-1 lg:order-2 lg:-mt-16 overflow-visible"
        >
          <FinanceCircle
            income={Math.abs(stats.income)}
            expense={Math.abs(stats.expense)}
          />
        </motion.div>

        <FinanceBudget moneyLeft={moneyLeft} totalBudget={totalBudget} />
      </div>
    </div>
  );
}
