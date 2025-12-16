import type { FinanceBudget, FinanceCategory } from "../../types/types";
import BudgetCategoryCard from "./components/BudgetCategoryCard";
import BudgetCategoryOverview from "./components/BudgetCategoryOverview";

interface BudgetPlannerProps {
  categories: FinanceCategory[];
  budgets: FinanceBudget[];
  onSaveBudget: (categoryId: string, amount: number) => Promise<void>;
  categorySpending: Record<string, number>;
}

export default function BudgetPlanner({
  categories,
  budgets,
  onSaveBudget,
  categorySpending,
}: BudgetPlannerProps) {
  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    // <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <div className="flex flex-col gap-2">
      {expenseCategories.map((cat) => {
        const budget = budgets.find((b) => b.category_id === cat.id);
        const amount = budget ? budget.amount : 0;
        const spent = categorySpending[cat.id] || 0;

        return (
          <BudgetCategoryOverview
            key={cat.id}
            category={cat}
            amount={amount}
            spent={spent}
            onSave={(amt) => onSaveBudget(cat.id, amt)}
          />
        );
      })}
    </div>
  );
}
