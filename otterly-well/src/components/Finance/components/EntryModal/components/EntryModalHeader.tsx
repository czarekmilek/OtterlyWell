import { DialogTitle } from "@headlessui/react";
import { CloseIcon, FinanceIcon } from "../../../../icons/index";
import type { FinanceType } from "../../../types/types";

interface EntryModalHeaderProps {
  type: FinanceType;
  onClose: () => void;
}

export function EntryModalHeader({ type, onClose }: EntryModalHeaderProps) {
  return (
    <div className="bg-brand-neutral-dark border-b border-brand-depth px-4 py-3 sm:px-6 flex justify-between items-center">
      <DialogTitle
        as="h3"
        className="text-lg font-semibold leading-6 text-brand-neutral-light flex items-center gap-2"
      >
        <FinanceIcon className="text-brand-accent-1" />
        {type === "income" ? "Dodaj przychód" : "Dodaj wydatek"}
      </DialogTitle>
      <button
        type="button"
        onClick={onClose}
        className="text-brand-secondary hover:text-brand-neutral-dark hover:bg-brand-neutral-light/70 rounded-full 
                  p-1 flex items-center justify-center cursor-pointer transition-all"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
