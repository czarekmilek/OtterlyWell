import { useState } from "react";
import type { FinanceTransaction, FinanceCategory } from "../../types/types";
import { TransactionDateGroup } from "./components/TransactionDateGroup";
import { TransactionListSkeleton } from "./components/TransactionListSkeleton";
import CategoryManager from "../CategoryManager/CategoryManager";

interface TransactionListProps {
  transactions: FinanceTransaction[];
  categories: FinanceCategory[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onEdit: (
    id: string,
    updatedTransaction: Partial<FinanceTransaction>
  ) => Promise<any>;
}

export default function TransactionList({
  transactions,
  categories,
  isLoading,
  onDelete,
  onEdit,
}: TransactionListProps) {
  const [hiddenCategoryKeys, setHiddenCategoryKeys] = useState<Set<string>>(
    new Set()
  );
  const [isFilterManagerOpen, setIsFilterManagerOpen] = useState(false);

  if (isLoading) {
    return <TransactionListSkeleton />;
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center text-brand-secondary py-8">
        Brak transakcji. Dodaj pierwszą!
      </div>
    );
  }

  // taking only unique categories
  const allCategoriesMap = new Map<string, FinanceCategory>();
  transactions.forEach((t) => {
    if (t.finance_categories) {
      const key = `${t.finance_categories.name}-${t.finance_categories.type}`;
      if (!allCategoriesMap.has(key)) {
        allCategoriesMap.set(key, t.finance_categories);
      }
    }
  });

  const toggleCategory = (name: string, type: "income" | "expense") => {
    const key = `${name}-${type}`;
    setHiddenCategoryKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleAll = (type: "income" | "expense", newState: boolean) => {
    setHiddenCategoryKeys((prev) => {
      const next = new Set(prev);
      const categoriesOfType = Array.from(allCategoriesMap.values()).filter(
        (c) => c.type === type
      );

      categoriesOfType.forEach((c) => {
        const key = `${c.name}-${c.type}`;
        if (newState) {
          next.delete(key);
        } else {
          next.add(key);
        }
      });

      return next;
    });
  };

  const clearFilters = () => {
    setHiddenCategoryKeys(new Set());
  };

  const filteredTransactions = transactions.filter((t) => {
    // checking if hidden, if yes skip
    if (t.finance_categories) {
      const key = `${t.finance_categories.name}-${t.finance_categories.type}`;
      if (hiddenCategoryKeys.has(key)) return false;
    }

    return true;
  });

  const groupedTransactions = filteredTransactions.reduce(
    (acc, transaction) => {
      const date = transaction.date;

      if (!acc[date]) acc[date] = [];
      acc[date].push(transaction);

      return acc;
    },
    {} as Record<string, FinanceTransaction[]>
  );

  const dates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const managerCategories = Array.from(allCategoriesMap.values()).map((c) => ({
    ...c,
    is_active: !hiddenCategoryKeys.has(`${c.name}-${c.type}`),
  }));

  const activeFilterCount = managerCategories.filter((c) => c.is_active).length;
  const totalCategoriesCount = managerCategories.length;
  // displaying only cateogires, where there is at least one transaction
  const hasActiveFilters = hiddenCategoryKeys.size > 0;

  return (
    <div className="space-y-4">
      {/* For now, filter buttons within the component, maybe move them outside (next to history header) later */}
      <div className="flex flex-row gap-2 items-center mb-4">
        <div className="flex gap-2 justify-start w-full sm:w-auto">
          <button
            onClick={() => setIsFilterManagerOpen(true)}
            className={`py-1 px-2 flex items-center justify-center rounded-lg transition-colors ${
              hasActiveFilters
                ? "bg-brand-accent-1 text-brand-neutral-darker hover:bg-brand-accent-1/80 cursor-pointer"
                : "bg-brand-neutral-dark/50 text-brand-secondary hover:bg-brand-neutral-dark/70 cursor-pointer"
            }`}
          >
            {/* TODO: change icon if custom ones finally added */}
            <span className="material-symbols-sharp">filter_list</span>
          </button>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-end text-xs text-brand-secondary hover:text-brand-accent-1 transition-colors cursor-pointer sm:ml-1"
          >
            Aktywne filtry: {activeFilterCount}/{totalCategoriesCount} (kliknij,
            aby wyczyścić)
          </button>
        )}
      </div>

      {dates.length > 0 ? (
        dates.map((date) => (
          <TransactionDateGroup
            key={date}
            date={date}
            transactions={groupedTransactions[date]}
            categories={categories}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-brand-secondary">
          <p className="text-sm">Brak transakcji spełniających kryteria</p>
        </div>
      )}

      <CategoryManager
        isOpen={isFilterManagerOpen}
        onClose={() => setIsFilterManagerOpen(false)}
        categories={managerCategories}
        onToggleCategory={toggleCategory}
        onToggleAll={toggleAll}
        showIncomeCategories={true}
      />
    </div>
  );
}
