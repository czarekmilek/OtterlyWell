import type { FinanceTransaction } from "../types/types";
import { TransactionDateGroup } from "./components/TransactionDateGroup";
import { TransactionListSkeleton } from "./components/TransactionListSkeleton";

interface TransactionListProps {
  transactions: FinanceTransaction[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export default function TransactionList({
  transactions,
  isLoading,
  onDelete,
}: TransactionListProps) {
  if (isLoading) {
    return <TransactionListSkeleton />;
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center text-brand-secondary py-8">
        Brak transakcji. Dodaj pierwszą!
      </div>
    );
  }

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = transaction.date;

    if (!acc[date]) acc[date] = [];
    acc[date].push(transaction);

    return acc;
  }, {} as Record<string, FinanceTransaction[]>);

  const dates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-4">
      {dates.map((date) => (
        <TransactionDateGroup
          key={date}
          date={date}
          transactions={groupedTransactions[date]}
          onDelete={onDelete}
        />
      ))}

      {dates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-brand-secondary">
          <p className="text-sm">Brak transakcji w tym miesiącu</p>
        </div>
      )}
    </div>
  );
}
