import { useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useFinance } from "../../Finance/hooks/useFinance";
import { FinanceWidgetSimplified } from "./FinanceWidgetSimplified";
import { Link } from "react-router-dom";
import { FinanceIcon } from "../../icons";

export default function FinanceWidget() {
  const {} = useAuth();
  const today = useMemo(() => new Date(), []);

  const { transactions, budgets } = useFinance();

  const monthTransactions = useMemo(() => {
    const month = today.getMonth();
    const year = today.getFullYear();
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }, [transactions, today]);

  const stats = useMemo(() => {
    return monthTransactions.reduce(
      (acc, t) => {
        if (t.type === "income") acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [monthTransactions]);

  const totalBudget = useMemo(() => {
    return budgets.reduce((acc, b) => acc + (b.amount || 0), 0);
  }, [budgets]);

  const moneyLeft = totalBudget - stats.expense;

  return (
    <Link to="/finance">
      <div
        className="flex flex-col bg-brand-neutral-dark/40 border border-brand-depth rounded-2xl p-4
                    overflow-hidden relative group cursor-pointer hover:bg-brand-neutral-dark/50 hover:scale-102 
                    hover:shadow-lg transition-all duration-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brand-neutral-light flex items-center gap-2">
            <FinanceIcon />
            Finanse
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="origin-center w-full">
            <FinanceWidgetSimplified
              stats={stats}
              moneyLeft={moneyLeft}
              totalBudget={totalBudget}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
