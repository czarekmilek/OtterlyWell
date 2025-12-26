import { getCategoryColor } from "../../../constants/categoryColors";
import { getCategoryIcon } from "../../../constants/categoryIcons";
import type { FinanceCategory } from "../../../types/types";

interface BudgetCategoryOverviewProps {
  category: FinanceCategory;
  amount: number;
  spent: number;
  onSave?: (amount: number) => Promise<void>;
  editMode: boolean;
  editValue?: string;
  onEdit?: (value: string) => void;
}

export default function BudgetCategoryOverview({
  category,
  amount,
  spent,
  editMode,
  editValue,
  onEdit,
}: BudgetCategoryOverviewProps) {
  const categoryColor = getCategoryColor(category.name);
  const categoryIcon = getCategoryIcon(category.name);

  const displayValue = editValue !== undefined ? editValue : amount.toString();

  return (
    <div>
      <div
        className="grid grid-cols-[minmax(0,1fr)_auto] rounded-xl bg-brand-neutral-dark/40 
                  hover:bg-brand-neutral-dark/80 transition-colors"
        // style={
        //   {
        //     // backgroundColor: `${categoryColor}80`,
        //   }
        // }
      >
        <div className="flex items-center gap-1 min-w-0">
          <div
            className="w-10 min-h-10 ml-1 rounded-l-xl flex items-center justify-center
                      text-brand-neutral-light shrink-0"
            style={{
              color: `${categoryColor}`,
            }}
          >
            <span className="material-symbols-sharp">{categoryIcon}</span>
          </div>
          <span className="font-semibold text-sm sm:text-base text-brand-neutral-light truncate">
            {category.name}
          </span>
        </div>

        <div className="flex justify-between items-center min-h-10 ml-auto  px-4 py-1.5 rounded-r-xl">
          {/* <p className="text-xs text-brand-secondary font-medium uppercase tracking-wider mb-0.5">
            Limit
          </p> */}
          {editMode ? (
            <input
              type="number"
              value={displayValue}
              onChange={(e) => onEdit?.(e.target.value)}
              className="w-full bg-brand-neutral-light/5 border border-brand-depth rounded-lg px-3 py-2 text-sm text-brand-neutral-light focus:outline-none 
                        focus:border-brand-accent-2 transition-colors"
              autoFocus
              placeholder="0"
            />
          ) : (
            <p className="font-bold text-brand-neutral-light/60">
              <span
                className={`text-md md:text-xl font-medium uppercase     
                            tracking-wider mt-0.5 ${
                              spent > amount
                                ? "text-brand-negative"
                                : "text-brand-neutral-light"
                            }`}
              >
                <span className="text-lg md:text-xl">{spent.toFixed(0)}</span>
              </span>
              <span className="text-xs md:text-sm mx-1 text-brand-neutral-light/60">
                /
              </span>
              <span className="text-sm md:text-base">{amount.toFixed(0)} </span>
              <span className="text-xs md:text-sm font-normal text-brand-secondary">
                PLN
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
