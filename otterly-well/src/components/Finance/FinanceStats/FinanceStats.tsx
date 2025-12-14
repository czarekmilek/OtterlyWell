import { motion } from "framer-motion";
import { FinanceCircle } from "./components/FinanceCircle";
import { FinanceBudget } from "./components/FinanceBudget";
import { FinanceIOPeek } from "./components/FinanceIOPeek";

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
          <FinanceIOPeek stats={{ income: stats.income }} />
          <FinanceIOPeek stats={{ expense: stats.expense }} />
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
