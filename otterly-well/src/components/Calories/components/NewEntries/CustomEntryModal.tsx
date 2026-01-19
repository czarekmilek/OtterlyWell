import { motion } from "framer-motion";
import { CloseIcon } from "../../../icons";
import { CustomEntry } from "./CustomEntry";
import type { Entry } from "../../types/types";
import type { FormEvent, ChangeEvent } from "react";

interface CustomEntryModalProps {
  onClose: () => void;
  customEntry: Omit<Entry, "id">;
  handleCustomEntryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCustomEntrySubmit: (
    e: FormEvent,
    saveData?: { servingName: string; servingWeight: number },
  ) => void;
}

export function CustomEntryModal({
  onClose,
  customEntry,
  handleCustomEntryChange,
  handleCustomEntrySubmit,
}: CustomEntryModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-neutral-dark/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-brand-neutral-dark border border-brand-depth w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-brand-depth bg-brand-neutral-dark/50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-brand-neutral-light">
            Dodaj własny produkt
          </h2>
          <button
            onClick={onClose}
            className="p-1 cursor-pointer hover:bg-brand-depth rounded-full transition-colors hover:text-brand-neutral-dark text-brand-neutral-light flex items-center justify-center"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-hidden">
          <CustomEntry
            customEntry={customEntry}
            handleCustomEntryChange={handleCustomEntryChange}
            handleCustomEntrySubmit={(e, saveData) => {
              handleCustomEntrySubmit(e, saveData);
              onClose();
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
