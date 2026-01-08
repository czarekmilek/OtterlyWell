import { useState } from "react";
import { motion } from "framer-motion";
import type { WorkoutEntry } from "../../types/types";
import ConfirmDeleteDialog from "../../../UI/ConfirmDeleteDialog";
import { DeleteIcon } from "../../../icons";

interface WorkoutItemProps {
  entry: WorkoutEntry;
  onRemoveEntry: (id: string) => void;
}

export default function WorkoutItem({
  entry,
  onRemoveEntry,
}: WorkoutItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRemoveClick = () => {
    onRemoveEntry(entry.id);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="mb-2 last:mb-0 bg-brand-neutral-dark border border-brand-depth rounded-lg p-3 group relative overflow-hidden"
      >
        <div className="flex justify-between items-start z-10 relative">
          <div>
            <h4 className="font-bold text-brand-neutral-light text-lg">
              {entry.exercise?.name || "Nieznane ćwiczenie"}
            </h4>
            <p className="text-sm text-brand-neutral-light/70 uppercase tracking-wider">
              {entry.exercise?.muscle_group} •{" "}
              {entry.exercise?.type === "strength"
                ? "Siłowe"
                : entry.exercise?.type === "stretching"
                ? "Rozciąganie"
                : "Cardio"}
            </p>
          </div>
          <button
            onClick={openModal}
            className="flex sm:w-auto h-fit items-center justify-center rounded-md text-sm text-brand-neutral-light 
                       hover:bg-red-800/20 hover:border-red-500/30 hover:text-red-400
                       transition-colors duration-200 cursor-pointer"
          >
            <DeleteIcon />
          </button>
        </div>

        <div className="mt-3 flex gap-4">
          {entry.exercise?.type === "strength" ? (
            <div className="flex gap-2">
              {/* strenght based */}
              <div className="bg-brand-depth/30 rounded px-2 py-1">
                <span className="text-brand-accent-1 font-bold">
                  {entry.sets}
                </span>
                <span className="text-xs text-brand-neutral-light/50 ml-1">
                  SERIE
                </span>
              </div>
              <div className="bg-brand-depth/30 rounded px-2 py-1">
                <span className="text-brand-accent-1 font-bold">
                  {entry.reps}
                </span>
                <span className="text-xs text-brand-neutral-light/50 ml-1">
                  POWT.
                </span>
              </div>
              <div className="bg-brand-depth/30 rounded px-2 py-1">
                <span className="text-brand-accent-1 font-bold">
                  {entry.weight_kg}
                </span>
                <span className="text-xs text-brand-neutral-light/50 ml-1">
                  KG
                </span>
              </div>
            </div>
          ) : entry.exercise?.type === "cardio" ? (
            <div className="flex gap-2">
              {/* cardio based */}
              <div className="bg-brand-depth/30 rounded px-2 py-1">
                <span className="text-brand-accent-1 font-bold">
                  {entry.duration_min}
                </span>
                <span className="text-xs text-brand-neutral-light/50 ml-1">
                  MIN
                </span>
              </div>
              <div className="bg-brand-depth/30 rounded px-2 py-1">
                <span className="text-brand-accent-1 font-bold">
                  {entry.distance_km}
                </span>
                <span className="text-xs text-brand-neutral-light/50 ml-1">
                  KM
                </span>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              {/* stretching based */}
              <div className="bg-brand-depth/30 rounded px-2 py-1">
                <span className="text-brand-accent-1 font-bold">
                  {entry.duration_min}
                </span>
                <span className="text-xs text-brand-neutral-light/50 ml-1">
                  MIN
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <ConfirmDeleteDialog
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleRemoveClick}
        description={
          <p>
            Czy na pewno chcesz usunąć{" "}
            <strong className="text-brand-neutral-light">
              {entry.exercise?.name || "ćwiczenie"}
            </strong>
            ? Tej akcji nie można cofnąć.
          </p>
        }
      />
    </>
  );
}
