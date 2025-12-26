import type { FinanceType } from "../types/types";

interface NewTransactionModalProps {
  handleOpenModal: (type: FinanceType) => void;
  incOrExp: "expense" | "income";
}

export const NewTransactionModal = ({
  handleOpenModal,
  incOrExp,
}: NewTransactionModalProps) => {
  return (
    <button
      onClick={() => handleOpenModal(incOrExp)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium 
                  transition-colors border cursor-pointer ${
                    incOrExp === "expense"
                      ? "bg-brand-negative/10 text-brand-negative border-brand-negative hover:bg-brand-negative/20"
                      : "bg-brand-positive/10 text-brand-positive border-brand-positive hover:bg-brand-positive/20"
                  }`}
    >
      <span className="material-symbols-sharp">
        {incOrExp === "expense" ? "remove" : "add"}
      </span>
      <span>{incOrExp === "expense" ? "Wydatek" : "Przychód"}</span>
    </button>
  );
};
