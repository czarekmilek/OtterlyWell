import type { FinanceCategory } from "../../types/types";
import { BreakdownListElement } from "./BreakdownListElement";

interface BilanceBreakdownProps {
  categories: FinanceCategory[];
  categorySpending: Record<string, number>;
  stats: { income: number; expense: number };
}

export default function BilanceBreakdown({
  categories,
  categorySpending,
  stats,
}: BilanceBreakdownProps) {
  const expenseCategories = categories.filter(
    (c) => c.type === "expense" && (categorySpending[c.id] || 0) !== 0
  );
  const incomeCategories = categories.filter(
    (c) => c.type === "income" && (categorySpending[c.id] || 0) !== 0
  );

  const categorisedIncome = incomeCategories.reduce(
    (acc, c) => acc + (categorySpending[c.id] || 0),
    0
  );

  const categorisedExpense = expenseCategories.reduce(
    (acc, c) => acc + (categorySpending[c.id] || 0),
    0
  );

  const uncategorisedIncome = stats.income - categorisedIncome;
  const uncategorisedExpense = stats.expense - categorisedExpense;

  return (
    <div>
      <div className="flex flex-col h-full relative max-w-80 sm:max-w-142 lg:max-w-none mx-auto">
        {/* this is supposed to be a background, idea was to add more depth by creating "3D" design */}
        {/* <div
          className="hidden md:flex items-center justify-center absolute bottom-0 left-1/2 -translate-x-1/2 w-6/9 rounded-2xl 
                        bg-brand-neutral-dark/40 z-0 h-[calc(100%-1rem)]"
        ></div> */}
        {/* <div className="h-4 bg-brand-neutral-dark/70 w-1/2 mx-auto mt-4 relative z-10"></div> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-2  relative z-10">
          {incomeCategories.length > 0 && (
            <div className="flex flex-col w-full">
              <h3
                className="text-xl font-bold text-brand-positive-lighter bg-brand-neutral-dark
                            w-3/4 text-center py-2 rounded-t-3xl mx-auto"
              >
                Przychody
              </h3>
              {incomeCategories.map((cat) => {
                const spent = categorySpending[cat.id] || 0;
                return (
                  <BreakdownListElement
                    key={cat.id}
                    category={cat}
                    amount={spent}
                  />
                );
              })}
              {uncategorisedIncome > 0 && (
                <BreakdownListElement
                  key="uncategorised-income"
                  category={{
                    id: "uncat-inc",
                    name: "Nieskategoryzowane",
                    type: "income",
                    is_active: true,
                    user_id: "",
                    created_at: "",
                  }}
                  amount={uncategorisedIncome}
                />
              )}
              {/* This h3 is to maintain the "burger" - basically the rounded rectangle in the back */}
              <h3
                className="text-xl font-bold text-brand-negative bg-brand-neutral-dark
                            w-3/4 text-center h-6 rounded-b-full mx-auto -mt-0.5"
              ></h3>
            </div>
          )}
          {/* <div className="visible md:hidden h-4 bg-brand-neutral-dark w-6/9 mx-auto -mt-4.5 rounded-b-full z-10"></div> */}
          {/* <div className="visible md:hidden h-0.5 bg-brand-depth/50 w-8/9 mx-auto rounded-full"></div> */}
          {expenseCategories.length > 0 && (
            <div className="flex flex-col w-full">
              {/* This h3 is to maintain the "burger" - basically the rounded rectangle in the back */}
              <h3
                className="text-xl font-bold text-brand-negative bg-brand-neutral-dark
                            w-3/4 text-center h-6 rounded-t-full mx-auto -mt-0.5"
              ></h3>
              {expenseCategories.map((cat) => {
                const spent = categorySpending[cat.id] || 0;
                return (
                  <BreakdownListElement
                    key={cat.id}
                    category={cat}
                    amount={spent}
                  />
                );
              })}
              {uncategorisedExpense > 0 && (
                <BreakdownListElement
                  key="uncategorised-expense"
                  category={{
                    id: "uncat-exp",
                    name: "Nieskategoryzowane",
                    type: "expense",
                    is_active: true,
                    user_id: "",
                    created_at: "",
                  }}
                  amount={uncategorisedExpense}
                />
              )}
              <h3
                className="text-xl font-bold text-brand-negative bg-brand-neutral-dark
                            w-3/4 text-center py-2 rounded-b-3xl mx-auto -mt-0.5"
              >
                Wydatki
              </h3>
            </div>
          )}
        </div>
        {/* <div className="h-4 bg-brand-neutral-dark md:bg-brand-neutral-dark/70 w-6/9 mx-auto -mt-0.5 rounded-b-full z-10"></div> */}
      </div>
    </div>
  );
}
