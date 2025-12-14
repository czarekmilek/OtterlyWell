import type { FinanceTransaction } from "./types";
import { DeleteIcon } from "../icons";

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
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 rounded-lg bg-brand-neutral-dark/30 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-brand-secondary">
        Brak transakcji. Dodaj pierwszą!
      </div>
    );
  }

  // Group by date
  const grouped = transactions.reduce((acc, t) => {
    const date = t.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {} as Record<string, FinanceTransaction[]>);

  const dates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-4">
      {dates.map((date) => (
        <div key={date}>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px bg-brand-depth flex-1"></div>
            <h3 className="text-xs font-bold text-brand-secondary uppercase tracking-wider">
              {dateFormatter.format(new Date(date))}
            </h3>
            <div className="h-px bg-brand-depth flex-1"></div>
          </div>

          <div className="space-y-2">
            {grouped[date].map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-brand-neutral-dark/30 transition-colors border-b border-brand-depth/20 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-brand-neutral-light"
                    style={{
                      backgroundColor: `${
                        t.finance_categories?.color || "#555"
                      }20`,
                    }}
                  >
                    <span
                      className="material-symbols-sharp text-xl"
                      style={{ color: t.finance_categories?.color || "#555" }}
                    >
                      {t.finance_categories?.icon || "payments"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-brand-neutral-light text-sm">
                      {t.title}
                    </span>
                    <span className="text-xs text-brand-secondary">
                      {t.finance_categories?.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold text-sm ${
                      t.type === "income" ? "text-emerald-400" : "text-red-300"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {t.amount.toFixed(2)} zł
                  </span>
                  <button
                    onClick={() => onDelete(t.id)}
                    className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-full transition-all flex items-center justify-center cursor-pointer"
                    title="Usuń"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {dates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-brand-secondary">
          <p className="text-sm">Brak transakcji w tym miesiącu</p>
        </div>
      )}
    </div>
  );
}
