import { useState } from "react";
import { motion } from "framer-motion";
import { DeleteIcon, EditIcon, TrashIcon } from "../../../icons";
import ConfirmDeleteDialog from "../../../UI/ConfirmDeleteDialog";
import type { Entry } from "../../types/types";
import { EditEntryModal } from "./EditEntryModal";
import { MacroBar } from "../MacroTracking/MacroBar";

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
        className="group relative flex flex-col gap-2 p-4 bg-brand-neutral-dark/30 hover:bg-brand-neutral-dark/50 rounded-xl 
                  border border-transparent hover:border-brand-primary/10 transition-all duration-300"
      >
        <div className="flex justify-between items-start w-full">
          <div className="flex-1 pr-4">
            <h3 className="font-medium text-brand-neutral-light text-base leading-snug">
              {entry.name}
            </h3>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="font-bold text-lg text-brand-accent-3 tabular-nums">
              {Math.round(entry.kcal)} kcal
            </span>
          </div>
        </div>
        <div>
          <MacroBar
            protein={entry.protein}
            fat={entry.fat}
            carbs={entry.carbs}
          />
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-4 text-xs font-medium text-brand-secondary">
            <div className="flex items-center gap-1.5" title="Białko">
              <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(var(--brand-primary),0.5)]" />
              <span className="text-brand-neutral-light/80">
                B: {entry.protein.toFixed(1)}g
              </span>
            </div>
            <div className="flex items-center gap-1.5" title="Tłuszcz">
              <div className="w-2 h-2 rounded-full bg-brand-accent-1 shadow-[0_0_8px_rgba(var(--brand-accent-1),0.5)]" />
              <span className="text-brand-neutral-light/80">
                T: {entry.fat.toFixed(1)}g
              </span>
            </div>
            <div className="flex items-center gap-1.5" title="Węglowodany">
              <div className="w-2 h-2 rounded-full bg-brand-accent-2 shadow-[0_0_8px_rgba(var(--brand-accent-2),0.5)]" />
              <span className="text-brand-neutral-light/80">
                W: {entry.carbs.toFixed(1)}g
              </span>
            </div>
          </div>

          <div className="sm:flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center p-1.5 rounded-full text-brand-secondary hover:bg-brand-accent-2/70 transition-colors cursor-pointer"
              title="Edytuj"
            >
              <EditIcon className="" />
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center p-1.5 rounded-full text-brand-secondary hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
              title="Usuń"
            >
              <TrashIcon className="" />
            </button>
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
