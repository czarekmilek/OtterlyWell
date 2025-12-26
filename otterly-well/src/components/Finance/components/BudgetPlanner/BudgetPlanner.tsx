import { useState } from "react";
import type { FinanceBudget, FinanceCategory } from "../../types/types";
import BudgetCategoryCard from "./components/BudgetCategoryCard";
import BudgetCategoryOverview from "./components/BudgetCategoryOverview";
import CategoryManager from "../CategoryManager/CategoryManager";

interface BudgetPlannerProps {
  categories: FinanceCategory[];
  budgets: FinanceBudget[];
  onSaveBudget: (categoryId: string, amount: number) => Promise<void>;

  categorySpending: Record<string, number>;
  onToggleCategory: (categoryName: string, type: "income" | "expense") => void;
}

export default function BudgetPlanner({
  categories,
  budgets,
  onSaveBudget,
  categorySpending,
  onToggleCategory,
}: BudgetPlannerProps) {
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  const activeCategories = categories.filter((c) => c.is_active);
  const expenseCategories = activeCategories.filter(
    (c) => c.type === "expense"
  );
  // only to display - we won't set any limits on those
  const incomeCategories = activeCategories.filter((c) => c.type === "income");

  // totals to show current status of specific categories budget
  const totalSpentFromActiveBudget = expenseCategories.reduce(
    (sum, c) => sum + (categorySpending[c.id] || 0),
    0
  );
  const totalActiveBudget = budgets
    .filter((b) => activeCategories.some((c) => c.id === b.category_id))
    .reduce((sum, b) => sum + b.amount, 0);

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
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 items-center justify-between text-brand-neutral-light font-semibold">
        {/* <button
          className="px-4 py-2 rounded-lg bg-brand-secondary/80 hover:bg-brand-neutral-dark/70 transition-colors cursor-pointer"
          onClick={() =>
            selectedTransactionType === "expense"
              ? setSelectedTransactionType("income")
              : setSelectedTransactionType("expense")
          }
        >
          {selectedTransactionType === "expense" ? "Przychody" : "Wydatki"}
        </button> */}

        <button
          className="px-4 py-2 rounded-lg bg-brand-secondary/80 hover:bg-brand-neutral-dark/70 transition-colors cursor-pointer"
          onClick={() => setIsCategoryManagerOpen(true)}
        >
          Kategorie
        </button>

        {/* TODO: adjust later */}
        <span
          className="hidden sm:block text-brand-neutral-light bg-brand-neutral-dark px-8 py-2 -mb-7 rounded-t-full 
                      font-semibold text-xl lg:text-lg text-center"
        >
          {totalSpentFromActiveBudget} /{" "}
          <span className="text-brand-accent-1 font-bold">
            {totalActiveBudget}
          </span>
          <span className="text-xs ml-1 font-normal">PLN</span>
        </span>

        <button
          className="px-4 py-2 rounded-lg bg-brand-secondary/80 hover:bg-brand-neutral-dark/70 transition-colors cursor-pointer"
          onClick={handleEditModeToggle}
        >
          {editMode ? "Zapisz" : "Edytuj"}
        </button>
      </div>

      {/* Mobile only - same as above but hidden for desktops
          Had to do it like this, since in between the buttons there is not enough space on narrower screns */}
      <span
        className="block sm:hidden mx-auto mt-1 text-brand-neutral-light bg-brand-neutral-dark px-8 pt-2 pb-1 -mb-3 max-w-60 
                      rounded-t-full font-semibold text-lg text-center"
      >
        {totalSpentFromActiveBudget} /{" "}
        <span className="text-brand-accent-1 font-bold">
          {totalActiveBudget}
        </span>
        <span className="text-xs ml-1 font-normal">PLN</span>
      </span>

      <div className="flex flex-col gap-2">
        {/* copied from MacroBar - TODO: make it reusable */}
        <div className="h-5 w-full rounded-full bg-brand-neutral-dark overflow-hidden flex mb-1">
          <div
            className="h-full bg-brand-accent-3"
            style={{
              width: `${
                (totalSpentFromActiveBudget / totalActiveBudget) * 100
              }%`,
            }}
          />
        </div>
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

      <CategoryManager
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        onToggleCategory={onToggleCategory}
      />
    </div>
  );
}
