import { useState } from "react";
import { DeleteIcon } from "../../../../icons";
import type { FinanceTransaction } from "../../../types/types";
import { getCategoryColor } from "../../../constants/categoryColors";
import { getCategoryIcon } from "../../../constants/categoryIcons";

interface TransactionItemProps {
  transaction: FinanceTransaction;
  onDelete: (id: string) => void;
}

export function TransactionItem({
  transaction,
  onDelete,
}: TransactionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const categoryColor = getCategoryColor(transaction.finance_categories?.name);
  const categoryIcon = getCategoryIcon(transaction.finance_categories?.name);

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={`flex justify-between gap-3 p-3 rounded-lg 
                   hover:bg-brand-neutral-dark/90 transition-colors duration-300 cursor-pointer ${
                     isExpanded
                       ? "bg-brand-neutral-dark/60"
                       : "bg-brand-neutral-dark/40"
                   }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div
          className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full text-brand-neutral-light"
          style={{
            backgroundColor: `${categoryColor}21`,
          }}
        >
          <span
            className="material-symbols-sharp"
            style={{ color: categoryColor }}
          >
            {categoryIcon}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-brand-neutral-light text-sm">
            {transaction.title}
          </span>

          <span className="text-xs text-brand-secondary">
            {transaction.finance_categories?.name}
          </span>

          {isExpanded && transaction.description && (
            <span className="text-xs text-brand-secondary/80 mt-2 text-wrap break-words">
              {transaction.description}
            </span>
          )}
        </div>
      </div>

      <div className="flex-col flex justify-between gap-2">
        <div
          className={`flex items-center self-start ${isExpanded ? "pt-1" : ""}`}
        >
          <span
            className={`font-bold text-sm whitespace-nowrap ${
              transaction.type === "income"
                ? "text-brand-positive-lighter"
                : "text-brand-negative"
            }`}
          >
            {transaction.type === "income" ? "+" : "-"}
            {transaction.amount.toFixed(2)}
            <span className="text-xs ml-1">PLN</span>
          </span>
        </div>

        {isExpanded ? (
          <div className="flex items-end justify-end">
            <button
              onClick={() => onDelete(transaction.id)}
              className="flex items-center p-1 text-brand-negative hover:bg-brand-negative/10
                      rounded-full transition-all cursor-pointer"
              title="Usuń"
            >
              <DeleteIcon />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
