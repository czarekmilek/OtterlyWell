import { useState } from "react";
import { DeleteIcon, EditIcon } from "../../../../icons";
import ConfirmDeleteDialog from "../../../../UI/ConfirmDeleteDialog";
import EntryModal from "../../EntryModal/EntryModal";
import type { FinanceTransaction, FinanceCategory } from "../../../types/types";
import { getCategoryColor } from "../../../constants/categoryColors";
import { getCategoryIcon } from "../../../constants/categoryIcons";

interface TransactionItemProps {
  transaction: FinanceTransaction;
  categories: FinanceCategory[];
  onDelete: (id: string) => void;
  onEdit: (
    id: string,
    updatedTransaction: Partial<FinanceTransaction>
  ) => Promise<any>;
}

export function TransactionItem({
  transaction,
  categories,
  onDelete,
  onEdit,
}: TransactionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const categoryColor = getCategoryColor(transaction.finance_categories?.name);
  const categoryIcon = getCategoryIcon(transaction.finance_categories?.name);

  return (
    <>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`grid grid-cols-2 p-2 rounded-lg
                   hover:bg-brand-neutral-dark/90 transition-colors duration-300 cursor-pointer ${
                     isExpanded
                       ? "bg-brand-neutral-dark/60"
                       : "bg-brand-neutral-dark/40"
                   }`}
      >
        <div className="flex items-center gap-2 flex-1 self-start">
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
          <div className="flex flex-col justify-center">
            <span
              className="font-medium text-brand-neutral-light text-sm line-clamp-2 overflow-hidden 
                          text-ellipsis"
            >
              {transaction.title}
            </span>

            <span className="text-xs text-brand-secondary">
              {/* Placeholder for no category to maintain proper height */}
              {transaction.finance_categories
                ? transaction.finance_categories.name
                : "Nieskategoryzowane"}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end justify-start h-full gap-1">
          <div className="flex items-center">
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
            <div className="flex items-end justify-end gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditModalOpen(true);
                }}
                className="flex items-center p-1 text-brand-neutral-light hover:bg-brand-neutral-light/10
                      rounded-full transition-all cursor-pointer"
                title="Edytuj"
              >
                <EditIcon className="scale-80" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteModalOpen(true);
                }}
                className="flex items-center p-1 text-brand-negative hover:bg-brand-negative/10
                      rounded-full transition-all cursor-pointer"
                title="Usuń"
              >
                <DeleteIcon />
              </button>
            </div>
          ) : null}
        </div>

        {isExpanded ? (
          <div
            // if title is too long (more than one row of characters) we add a little margin to maintain proportions
            className={`col-span-2 bg-brand-neutral-dark/40 p-2 -mx-2 -mb-2 rounded-b-lg ${
              transaction.title.length > 15 ? "mt-2" : ""
            }`}
          >
            {/* we cut the title in the list to make space for transaction amount,
            displaying it here to allow user to actually see the title if curious */}
            <div className="text-sm text-brand-neutral-light font-semibold text-wrap break-words px-1">
              {transaction.title}
            </div>
            {/* description optional but if exists - showing it below the expanded title */}
            <div className="text-xs text-brand-secondary/80 text-wrap break-words p-1">
              {transaction.description ? transaction.description : "Brak opisu"}
            </div>
          </div>
        ) : null}
      </div>

      <ConfirmDeleteDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => onDelete(transaction.id)}
        description={
          <p>
            Czy na pewno chcesz usunąć transakcję{" "}
            <strong className="text-brand-neutral-light">
              {transaction.title}
            </strong>
            ? Tej akcji nie można cofnąć.
          </p>
        }
      />

      <EntryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(updatedData) => onEdit(transaction.id, updatedData)}
        categories={categories}
        initialData={transaction}
      />
    </>
  );
}
