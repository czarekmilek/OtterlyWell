import { motion } from "framer-motion";

interface FinanceBudgetProps {
  moneyLeft: number;
  totalBudget: number;
}

export function FinanceBudget({ moneyLeft, totalBudget }: FinanceBudgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="h-full order-3"
    >
      <div
        className="flex flex-col justify-between items-start lg:items-end lg:text-right
                  h-full bg-brand-neutral-dark rounded-xl p-6 border border-brand-depth"
      >
        <div>
          <p className="text-xs text-brand-neutral-light/70 uppercase tracking-wide mb-2">
            Pozostały budżet
          </p>
          <p
            className={`text-4xl font-bold ${
              moneyLeft >= 0 ? "text-brand-accent-1" : "text-brand-negative"
            } transition-colors`}
          >
            {moneyLeft.toFixed(2)}
            <span className="text-lg font-normal text-brand-secondary ml-1">
              PLN
            </span>
          </p>
        </div>
        <div className="mt-4">
          <p className="text-xs text-brand-secondary mb-1">
            Zaplanowany budżet
          </p>
          <p className="font-bold text-xl text-brand-neutral-light">
            {totalBudget.toFixed(0)} PLN
          </p>
        </div>
      </div>
    </motion.div>
  );
}
