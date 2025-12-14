import { useState } from "react";
import type { FinanceBudget, FinanceCategory } from "./types";

interface BudgetPlannerProps {
  categories: FinanceCategory[];
  budgets: FinanceBudget[];
  onSaveBudget: (categoryId: string, amount: number) => Promise<void>;
}

export default function BudgetPlanner({
  categories,
  budgets,
  onSaveBudget,
}: BudgetPlannerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");

  const expenseCategories = categories.filter((c) => c.type === "expense");

  const handleEdit = (categoryId: string, currentAmount: number) => {
    setEditingId(categoryId);
    setEditAmount(currentAmount.toString());
  };

  const handleSave = async (categoryId: string) => {
    const val = parseFloat(editAmount);
    if (isNaN(val) || val < 0) return;
    await onSaveBudget(categoryId, val);
    setEditingId(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {expenseCategories.map((cat) => {
        const budget = budgets.find((b) => b.category_id === cat.id);
        const amount = budget ? budget.amount : 0;
        const isEditing = editingId === cat.id;

        return (
          <div
            key={cat.id}
            className="p-4 rounded-xl bg-brand-neutral-dark/20 hover:bg-brand-neutral-dark/30 
                      transition-all flex flex-col gap-2 group"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-brand-neutral-light shadow-sm"
                style={{
                  backgroundColor: `${cat.color || "#555"}21`,
                  color: cat.color || "#555",
                }}
              >
                <span className="material-symbols-sharp text-xl">
                  {cat.icon || "category"}
                </span>
              </div>
              <span className="font-semibold text-brand-neutral-light">
                {cat.name}
              </span>
            </div>

            {isEditing ? (
              <div className="flex gap-2 items-center mt-2">
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full bg-brand-neutral-light/5 border border-brand-depth rounded-lg px-3 py-2 text-sm text-brand-neutral-light focus:outline-none 
                            focus:border-brand-accent-2 transition-colors"
                  autoFocus
                  placeholder="0"
                />
                <button
                  onClick={() => handleSave(cat.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-500
                          hover:bg-emerald-500/30 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-sharp">check</span>
                </button>
              </div>
            ) : (
              <div className="mt-2 pt-3 border-t border-brand-depth/30 flex justify-between items-end">
                <div>
                  <p className="text-xs text-brand-secondary font-medium uppercase tracking-wider mb-0.5">
                    Limit
                  </p>
                  <p className="text-xl font-bold text-brand-neutral-light">
                    {amount.toFixed(0)}{" "}
                    <span className="text-sm font-normal text-brand-secondary">
                      PLN
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleEdit(cat.id, amount)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-brand-secondary hover:text-brand-accent-2 hover:bg-brand-accent-2/10 
                            rounded-lg transition-all cursor-pointer"
                  title="Edytuj limit"
                >
                  <span className="material-symbols-sharp">edit</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
