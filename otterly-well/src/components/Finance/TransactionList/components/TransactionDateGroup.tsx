import type { FinanceTransaction } from "../../types/types";
import { TransactionItem } from "./TransactionItem";

interface TransactionDateGroupProps {
  date: string;
  transactions: FinanceTransaction[];
  onDelete: (id: string) => void;
}

export function TransactionDateGroup({
  date,
  transactions,
  onDelete,
}: TransactionDateGroupProps) {
  const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-brand-depth"></div>
        <h3 className="text-xs font-bold text-brand-secondary uppercase tracking-wider">
          {dateFormatter.format(new Date(date))}
        </h3>
        <div className="flex-1 h-px bg-brand-depth"></div>
      </div>

      <div className="space-y-2">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
