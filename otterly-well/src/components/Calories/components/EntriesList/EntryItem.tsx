import { useState } from "react";
import { motion } from "framer-motion";
import { DeleteIcon } from "../../../icons/index";
import ConfirmDeleteDialog from "../../../UI/ConfirmDeleteDialog";
import type { Entry } from "../../types/types";
import { MacroBar } from "../MacroTracking/MacroBar";

interface EntryItemProps {
  entry: Entry;
  removeEntry: (id: string) => void;
}

export const EntryItem = ({ entry: e, removeEntry }: EntryItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRemoveClick = () => {
    removeEntry(e.id);
  };

  return (
    <>
      <motion.li
        layout
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between py-3 gap-3"
      >
        {/* Info section */}
        <div className="min-w-0 flex-1">
          <div className="flex justify-between gap-2">
            <p className="text-brand-neutral-light">{e.name}</p>
            <button
              onClick={openModal}
              className="flex sm:w-auto h-fit items-center justify-center rounded-md text-sm text-brand-neutral-light 
                       hover:bg-red-800/20 hover:border-red-500/30 hover:text-red-400
                       transition-colors duration-200 cursor-pointer"
            >
              <DeleteIcon className="text-base" />
            </button>
          </div>

          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-brand-secondary">
            <span className="font-semibold bg-brand-accent-3 text-brand-neutral-light px-2 rounded-xl">
              {e.kcal} kcal
            </span>
            <span className="text-brand-depth/50" aria-hidden="true">
              |
            </span>
            <span className="font-semibold bg-brand-primary text-brand-neutral-light px-2 rounded-xl">
              B: {e.protein.toFixed(1)}g
            </span>
            <span className="text-brand-depth/50" aria-hidden="true">
              |
            </span>
            <span className="font-semibold bg-brand-accent-1 text-brand-neutral-light px-2 rounded-xl">
              T: {e.fat.toFixed(1)}g
            </span>
            <span className="text-brand-depth/50" aria-hidden="true">
              |
            </span>
            <span className="font-semibold bg-brand-accent-2 text-brand-neutral-light px-2 rounded-xl">
              W: {e.carbs.toFixed(1)}g
            </span>
          </p>

          <div className="mt-2 w-">
            <MacroBar protein={e.protein} fat={e.fat} carbs={e.carbs} />
          </div>
        </div>
      </motion.li>

      <ConfirmDeleteDialog
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleRemoveClick}
        description={
          <p>
            Czy na pewno chcesz usunąć{" "}
            <strong className="text-brand-neutral-light">{e.name}</strong>? Tej
            akcji nie można cofnąć.
          </p>
        }
      />
    </>
  );
};
