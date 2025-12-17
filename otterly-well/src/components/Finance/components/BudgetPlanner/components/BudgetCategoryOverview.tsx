import { useState } from "react";
import { getCategoryColor } from "../../../constants/categoryColors";
import { getCategoryIcon } from "../../../constants/categoryIcons";
import type { FinanceCategory } from "../../../types/types";

interface BudgetCategoryOverviewProps {
  category: FinanceCategory;
  amount: number;
  spent: number;
  onSave: (amount: number) => Promise<void>;
}

export default function BudgetCategoryOverview({
  category,
  amount,
  spent,
  onSave,
}: BudgetCategoryOverviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState("");

  const categoryColor = getCategoryColor(category.name);

  const categoryIcon = getCategoryIcon(category.name);

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

  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-xl bg-brand-neutral-dark/40 hover:bg-brand-neutral-dark/80 transition-colors"
        // style={
        //   {
        //     // backgroundColor: `${categoryColor}80`,
        //   }
        // }
      >
        <div
          className="w-10 min-h-10 ml-1 rounded-l-xl flex items-center justify-center 
                    text-brand-neutral-light"
          style={{
            color: `${categoryColor}`,
          }}
        >
          <span className="material-symbols-sharp text-xl">{categoryIcon}</span>
        </div>
        <span className="font-semibold text-brand-neutral-light">
          {category.name}
        </span>

        <div className="flex justify-between items-center min-h-10 ml-auto  px-4 py-1.5 rounded-r-xl">
          {/* <p className="text-xs text-brand-secondary font-medium uppercase tracking-wider mb-0.5">
            Limit
          </p> */}
          <p className="text-md font-bold text-brand-neutral-light/60">
            <span
              className={`md:text-xl font-medium uppercase     
                            tracking-wider mt-0.5 ${
                              spent > amount
                                ? "text-brand-negative"
                                : "text-brand-neutral-light"
                            }`}
            >
              {spent.toFixed(0)}
            </span>
            <span className="text-sm mx-1 text-brand-neutral-light/60">/</span>
            {amount.toFixed(0)}{" "}
            <span className="text-sm font-normal text-brand-secondary">
              PLN
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
