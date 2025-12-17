import type { FinanceType } from "../../../types/types";

interface EntryTypeToggleProps {
  type: FinanceType;
  setType: (type: FinanceType) => void;
}

export function EntryTypeToggle({ type, setType }: EntryTypeToggleProps) {
  return (
    <div className="flex rounded-md bg-brand-neutral-dark/50 p-1 border border-brand-depth">
      <button
        type="button"
        onClick={() => setType("expense")}
        className={`flex-1 py-1.5 text-sm font-medium rounded ${
          type === "expense"
            ? "bg-brand-negative/20 text-brand-negative shadow-sm"
            : "text-brand-secondary hover:text-brand-neutral-light cursor-pointer"
        }`}
      >
        Wydatek
      </button>
      <button
        type="button"
        onClick={() => setType("income")}
        className={`flex-1 py-1.5 text-sm font-medium rounded ${
          type === "income"
            ? "bg-brand-positive-lighter/20 text-brand-positive-lighter shadow-sm"
            : "text-brand-secondary hover:text-brand-neutral-light cursor-pointer"
        }`}
      >
        Przychód
      </button>
    </div>
  );
}
