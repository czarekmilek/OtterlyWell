import { useState } from "react";
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
  const incomeCategories = categories.filter((c) => c.type === "income");

  const [selectedTransactionType, setSelectedTransactionType] =
    useState("expense");
  const [editMode, setEditMode] = useState(false);
  const [edits, setEdits] = useState<Record<string, string>>({});

  const handleEditModeToggle = () => {
    if (editMode) {
      handleSaveAll();
    } else {
      setEdits({});
      setEditMode(true);
    }
  };

  const handleCategoryChange = (categoryId: string, value: string) => {
    setEdits((prev) => ({
      ...prev,
      [categoryId]: value,
    }));
  };

  const handleSaveAll = async () => {
    const promises = Object.entries(edits).map(([categoryId, value]) => {
      const amount = parseFloat(value);
      if (isNaN(amount) || amount < 0) return Promise.resolve();
      return onSaveBudget(categoryId, amount);
    });

    await Promise.all(promises);
    setEditMode(false);
    setEdits({});
  };

  return (
    // <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center justify-between text-brand-neutral-light font-semibold">
        <button
          className="px-4 py-2 rounded-lg bg-brand-secondary/80 hover:bg-brand-neutral-dark/70 transition-colors cursor-pointer"
          onClick={() =>
            selectedTransactionType === "expense"
              ? setSelectedTransactionType("income")
              : setSelectedTransactionType("expense")
          }
        >
          {selectedTransactionType === "expense" ? "Przychody" : "Wydatki"}
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-brand-secondary/80 hover:bg-brand-neutral-dark/70 transition-colors cursor-pointer"
          onClick={handleEditModeToggle}
        >
          {editMode ? "Zapisz" : "Edytuj"}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {selectedTransactionType === "expense"
          ? expenseCategories.map((cat) => {
              const budget = budgets.find((b) => b.category_id === cat.id);
              const amount = budget ? budget.amount : 0;
              const spent = categorySpending[cat.id] || 0;
              const editValue = edits[cat.id];

              return (
                <BudgetCategoryOverview
                  key={cat.id}
                  category={cat}
                  amount={amount}
                  spent={spent}
                  editMode={editMode}
                  editValue={editValue}
                  onEdit={(val) => handleCategoryChange(cat.id, val)}
                  onSave={async () => {}}
                />
              );
            })
          : incomeCategories.map((cat) => {
              const budget = budgets.find((b) => b.category_id === cat.id);
              const amount = budget ? budget.amount : 0;
              const spent = categorySpending[cat.id] || 0;
              const editValue = edits[cat.id];

              return (
                <BudgetCategoryOverview
                  key={cat.id}
                  category={cat}
                  amount={amount}
                  spent={spent}
                  editMode={editMode}
                  editValue={editValue}
                  onEdit={(val) => handleCategoryChange(cat.id, val)}
                  onSave={async () => {}}
                />
              );
            })}
      </div>
    </div>
  );
}
