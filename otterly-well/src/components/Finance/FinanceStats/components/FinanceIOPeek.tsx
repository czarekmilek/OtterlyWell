import { motion } from "framer-motion";

interface FinanceIOPeekProps {
  stats: { income?: number; expense?: number };
}

export function FinanceIOPeek({ stats }: FinanceIOPeekProps) {
  console.log(stats);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-brand-neutral-dark p-4 border border-brand-depth rounded-xl"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full"></div>
        <p className="text-xs text-brand-neutral-light/70 uppercase tracking-wide">
          {stats.income ? "Przychody" : stats.expense ? "Wydatki" : ""}
        </p>
      </div>
      <p
        className={`text-2xl font-bold ${
          stats.income ? "text-brand-positive-lighter" : "text-brand-negative"
        }`}
      >
        {stats.income ? "+" : "-"}
        {stats.income?.toFixed(2) || stats.expense?.toFixed(2)}
        <span className="text-lg font-normal text-brand-secondary ml-1">
          PLN
        </span>
      </p>
    </motion.div>
  );
}
