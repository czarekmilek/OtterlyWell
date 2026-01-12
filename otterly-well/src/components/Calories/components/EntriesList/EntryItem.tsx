import { useState } from "react";
import { motion } from "framer-motion";
import { DeleteIcon, EditIcon } from "../../../icons";
import ConfirmDeleteDialog from "../../../UI/ConfirmDeleteDialog";
import type { Entry } from "../../types/types";
import { MacroBar } from "../MacroTracking/MacroBar";
import { EditEntryModal } from "./EditEntryModal";

interface EntryItemProps {
  entry: Entry;
  removeEntry: (id: string) => void;
  onEdit: (id: string, updates: Partial<Entry>) => void;
}

export const EntryItem = ({ entry, removeEntry, onEdit }: EntryItemProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <motion.li
        layout
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-3 gap-3 bg-brand-neutral-dark/40 rounded-lg group"
      >
        <div className="min-w-0 flex-1">
          <div className="flex justify-between gap-2">
            <p className="text-brand-neutral-light">{entry.name}</p>
            <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              {/* same as edit button below, only differnet icon and color */}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex sm:w-auto h-fit items-center justify-center rounded-full p-0.5 text-sm text-brand-neutral-light/60
                        hover:text-brand-neutral-light hover:bg-brand-neutral-light/10
                        transition-colors duration-200 cursor-pointer"
                title="Edytuj"
              >
                <EditIcon className="scale-75" />
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex sm:w-auto h-fit items-center justify-center rounded-full p-0.5 text-sm text-brand-neutral-light 
                        hover:bg-red-800/20 hover:border-red-500/30 hover:text-red-400
                        transition-colors duration-200 cursor-pointer"
                title="Usuń"
              >
                <DeleteIcon className="scale-75" />
              </button>
            </div>
          </div>

          <div className="mt-2 w-full">
            <MacroBar
              protein={entry.protein}
              fat={entry.fat}
              carbs={entry.carbs}
            />
          </div>
          <div className="h-px bg-brand-neutral-light/20 mt-2"></div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-brand-secondary">
            <span className="font-semibold bg-brand-accent-3/90 text-brand-neutral-light px-2 rounded-xl text-center">
              {entry.kcal} kcal
            </span>
            <span className="font-semibold bg-brand-primary/90 text-brand-neutral-light px-2 rounded-xl text-center">
              B: {entry.protein.toFixed(1)}g
            </span>
            <span className="font-semibold bg-brand-accent-1/90 text-brand-neutral-light px-2 rounded-xl text-center">
              T: {entry.fat.toFixed(1)}g
            </span>
            <span className="font-semibold bg-brand-accent-2/90 text-brand-neutral-light px-2 rounded-xl text-center">
              W: {entry.carbs.toFixed(1)}g
            </span>
          </div>
        </div>
      </motion.li>

      <ConfirmDeleteDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => removeEntry(entry.id)}
        description={
          <p>
            Czy na pewno chcesz usunąć{" "}
            <strong className="text-brand-neutral-light">{entry.name}</strong>?
            Tej akcji nie można cofnąć.
          </p>
        }
      />

      <EditEntryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        entry={entry}
        onSave={onEdit}
      />
    </>
  );
};
