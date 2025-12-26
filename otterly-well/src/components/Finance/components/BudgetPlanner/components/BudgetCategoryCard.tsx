import { useState } from "react";
import type { FinanceCategory } from "../../../types/types";
import { getCategoryColor } from "../../../constants/categoryColors";
import { getCategoryIcon } from "../../../constants/categoryIcons";

interface BudgetCategoryCardProps {
  category: FinanceCategory;
  amount: number;
  onSave: (amount: number) => Promise<void>;
}

export default function BudgetCategoryCard({
  category,
  amount,
  onSave,
}: BudgetCategoryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
    setEditAmount(amount.toString());
  };

  const handleSave = async () => {
    const val = parseFloat(editAmount);
    if (isNaN(val) || val < 0) return;
    await onSave(val);
    setIsEditing(false);
  };

  const categoryColor = getCategoryColor(category.name);
  const categoryIcon = getCategoryIcon(category.name);

  return (
    <div
      className="flex flex-col gap-2 group bg-brand-neutral-dark/20 hover:bg-brand-neutral-dark/30 
              rounded-xl p-4 transition-all"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-brand-neutral-light shadow-sm"
          style={{
            backgroundColor: `${categoryColor}21`,
            color: categoryColor,
          }}
        >
          <span className="material-symbols-sharp text-xl">{categoryIcon}</span>
        </div>
        <span className="font-semibold text-brand-neutral-light">
          {category.name}
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
            onClick={handleSave}
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
            onClick={handleEdit}
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
}
