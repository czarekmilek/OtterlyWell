import { motion } from "framer-motion";

interface FinanceIOPeekProps {
  // stats: { income?: number; expense?: number };
  type: "income" | "expense";
  amount: number;
}

export function FinanceIOPeek({ type, amount }: FinanceIOPeekProps) {
  // console.log(type, amount);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-brand-neutral-dark p-4 border border-brand-depth rounded-xl"
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor:
              type === "income"
                ? "var(--color-brand-positive-lighter)"
                : "var(--color-brand-negative)",
          }}
        ></div>
        <p className="text-xs text-brand-neutral-light/70 uppercase tracking-wide">
          {type === "income" ? "Przychody" : "Wydatki"}
        </p>
      </div>
      <p
        className={`text-2xl font-bold ${
          type === "income"
            ? "text-brand-positive-lighter"
            : "text-brand-negative"
        }`}
      >
        {type === "income" ? "+" : "-"}
        {amount.toFixed(2)}
        <span className="text-lg font-normal text-brand-secondary ml-1">
          PLN
        </span>
      </p>
    </motion.div>
  );
}
