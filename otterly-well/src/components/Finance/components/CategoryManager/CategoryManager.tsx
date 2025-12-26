import { motion, AnimatePresence } from "framer-motion";
import type { FinanceCategory } from "../../types/types";
import { CategoryToggleRow } from "./CategoryToggleRow";
import { CloseIcon } from "../../../icons";

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FinanceCategory[];
  showIncomeCategories?: boolean;
  onToggleAll?: (type: "income" | "expense", newState: boolean) => void;
  onToggleCategory: (categoryName: string, type: "income" | "expense") => void;
}

export default function CategoryManager({
  isOpen,
  onClose,
  categories,
  onToggleCategory,
  showIncomeCategories = false,
  onToggleAll,
}: CategoryManagerProps) {
  // Deriving categories from props now instead of hardcoding as before
  const expenseCategoriesList = categories
    .filter((c) => c.type === "expense")
    .map((c) => c.name);

  const incomeCategoriesList = categories
    .filter((c) => c.type === "income")
    .map((c) => c.name);

  // names are unique, but just in case
  const uniqueExpenseCategories = Array.from(new Set(expenseCategoriesList));
  const uniqueIncomeCategories = Array.from(new Set(incomeCategoriesList));

  const isCategoryActive = (name: string, type: "income" | "expense") => {
    const cat = categories.find((c) => c.name === name && c.type === type);
    return cat ? cat.is_active : false;
  };

  const areAllActive = (type: "income" | "expense") => {
    const list =
      type === "expense" ? uniqueExpenseCategories : uniqueIncomeCategories;
    return list.every((name) => isCategoryActive(name, type));
  };

  const handleToggleAll = (type: "income" | "expense") => {
    if (onToggleAll) {
      const newState = !areAllActive(type);
      onToggleAll(type, newState);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-neutral-darker/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div
              className="overflow-hidden flex flex-col w-full max-w-2xl max-h-[85vh] bg-brand-neutral-darker border border-brand-depth 
                          rounded-2xl shadow-2xl pointer-events-auto mx-4"
            >
              <div className="p-6 border-b border-brand-depth flex justify-between items-center bg-brand-neutral-dark/50">
                <h2 className="text-xl font-bold text-brand-neutral-light">
                  Aktywne kategorie
                </h2>
                <button
                  onClick={onClose}
                  className="text-brand-secondary hover:text-brand-neutral-dark hover:bg-brand-neutral-light/70 rounded-full 
                  p-1 flex items-center justify-center cursor-pointer transition-all"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <section>
                  {/* TODO: can extract this out later since it repeats twice */}
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-sm uppercase tracking-wider text-brand-negative font-semibold">
                      Wydatki
                    </h3>
                    {onToggleAll && (
                      <button
                        onClick={() => handleToggleAll("expense")}
                        className="text-xs font-medium text-brand-accent-1 hover:text-brand-accent-2 transition-colors cursor-pointer"
                      >
                        {areAllActive("expense")
                          ? "Odznacz wszystkie"
                          : "Zaznacz wszystkie"}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {uniqueExpenseCategories.map((name) => (
                      <CategoryToggleRow
                        key={`expense-${name}`}
                        name={name}
                        isActive={isCategoryActive(name, "expense")}
                        onToggle={() => onToggleCategory(name, "expense")}
                      />
                    ))}
                  </div>
                </section>

                {showIncomeCategories && (
                  <section>
                    <div className="flex items-center justify-between mb-4 px-1 border-t border-brand-depth pt-6">
                      <h3 className="text-sm uppercase tracking-wider text-brand-positive font-semibold">
                        Przychody
                      </h3>
                      {onToggleAll && (
                        <button
                          onClick={() => handleToggleAll("income")}
                          className="text-xs font-medium text-brand-accent-1 hover:text-brand-accent-2 transition-colors cursor-pointer"
                        >
                          {areAllActive("income")
                            ? "Odznacz wszystkie"
                            : "Zaznacz wszystkie"}
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {uniqueIncomeCategories.map((name) => (
                        <CategoryToggleRow
                          key={`income-${name}`}
                          name={name}
                          isActive={isCategoryActive(name, "income")}
                          onToggle={() => onToggleCategory(name, "income")}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <div className="p-4 border-t border-brand-depth bg-brand-neutral-dark/30 text-center">
                <p className="text-xs text-brand-neutral-light/50">
                  Wybierz kategorie, które chcesz widzieć.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
