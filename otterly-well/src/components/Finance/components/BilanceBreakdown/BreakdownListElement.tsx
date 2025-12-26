import { getCategoryColor } from "../../constants/categoryColors";
import { getCategoryIcon } from "../../constants/categoryIcons";
import type { FinanceCategory } from "../../types/types";

interface BreakdownListElementProps {
  category: FinanceCategory;
  amount: number;
}

// copy-pasted from BudgetPlanner, just removed edit and dispalyed as grid
export const BreakdownListElement = ({
  category,
  amount,
}: BreakdownListElementProps) => {
  const categoryColor = getCategoryColor(category.name);
  const categoryIcon = getCategoryIcon(category.name);

  return (
    <div>
      <div
        className="grid grid-cols-[minmax(0,1fr)_auto] 
                  transition-colors rounded-xl border-1 border-brand-depth/10"
        style={{
          // Colors where too saturated, made more bland
          backgroundColor: `color-mix(in srgb, ${categoryColor}, gray 50%)`,
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.33), rgba(0,0,0,0.37))",
        }}
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
          <p className="font-bold text-brand-neutral-light/60">
            <span
              className={`text-md md:text-xl font-medium uppercase     
                            tracking-wider mt-0.5`}
              style={{
                color: `${categoryColor}`,
                filter: "brightness(1.33)",
              }}
            >
              <span className="text-lg md:text-xl">{amount.toFixed(0)}</span>
            </span>
            <span className="text-xs md:text-sm font-normal text-brand-secondary">
              {" "}
              PLN
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
