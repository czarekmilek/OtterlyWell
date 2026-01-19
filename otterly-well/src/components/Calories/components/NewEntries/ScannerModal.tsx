import { motion } from "framer-motion";
import { CloseIcon } from "../../../icons";
import { BarcodeScanner } from "./BarcodeScanner";
import type { FoodHit } from "../../types/types";

interface ScannerModalProps {
  onClose: () => void;
  addEntryFromFood: (food: FoodHit, grams: number) => void;
}

export function ScannerModal({ onClose, addEntryFromFood }: ScannerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-neutral-dark/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-brand-neutral-dark border border-brand-depth w-full max-w-md rounded-2xl shadow-2xl flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b border-brand-depth bg-brand-neutral-dark/50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-brand-neutral-light">
            Skanuj kod kreskowy
          </h2>
          <button
            onClick={onClose}
            className="p-1 cursor-pointer hover:bg-brand-depth rounded-full transition-colors hover:text-brand-neutral-dark text-brand-neutral-light flex items-center justify-center"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-2">
          <BarcodeScanner addEntryFromFood={addEntryFromFood} />
        </div>
      </motion.div>
    </div>
  );
}
