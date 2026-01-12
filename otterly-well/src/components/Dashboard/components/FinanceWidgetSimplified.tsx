import { motion } from "framer-motion";
import { FinanceCircle } from "../../Finance/components/FinanceStats/components/FinanceCircle";
import { FinanceBudget } from "../../Finance/components/FinanceStats/components/FinanceBudget";
import { FinanceIOPeek } from "../../Finance/components/FinanceStats/components/FinanceIOPeek";

interface FinanceWidgetSimplifiedProps {
  stats: { income: number; expense: number };
  moneyLeft: number;
  totalBudget: number;
}

export function FinanceWidgetSimplified({
  stats,
  moneyLeft,
  totalBudget,
}: FinanceWidgetSimplifiedProps) {
  return (
    <motion.div
      key="finance-simplified-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2"
    >
      <div className="h-full order-1 flex flex-col justify-center">
        <FinanceBudget moneyLeft={moneyLeft} totalBudget={totalBudget} />
      </div>
      <div className="flex flex-col gap-1">
        <FinanceIOPeek type="income" amount={stats.income} />
        <FinanceIOPeek type="expense" amount={stats.expense} />
      </div>

      {/* <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="order-2 overflow-visible flex items-center justify-center pointer-events-none"
      >
        <FinanceCircle
          income={Math.abs(stats.income)}
          expense={Math.abs(stats.expense)}
        />
      </motion.div> */}
    </motion.div>
  );
}
