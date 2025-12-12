import { useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import { DeleteIcon, WarningIcon } from "../../../icons";
import type { WorkoutEntry } from "../../types/types";

interface WorkoutItemProps {
  entry: WorkoutEntry;
  onRemoveEntry: (id: string) => void;
}

const WorkoutItem = ({ entry, onRemoveEntry }: WorkoutItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRemoveClick = () => {
    closeModal();
    setTimeout(() => onRemoveEntry(entry.id), 150);
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
              {entry.exercise?.type === "strength" ? "Siłowe" : "Cardio"}
            </p>
          </div>
          <button
            onClick={openModal}
            className="flex sm:w-auto h-fit items-center justify-center rounded-md text-sm text-brand-neutral-light 
                       hover:bg-red-800/20 hover:border-red-500/30 hover:text-red-400
                       transition-colors duration-200 cursor-pointer"
          >
            <DeleteIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-3 flex gap-4">
          <div className="bg-brand-depth/30 rounded px-2 py-1">
            <span className="text-brand-accent-1 font-bold">{entry.sets}</span>
            <span className="text-xs text-brand-neutral-light/50 ml-1">
              SERIE
            </span>
          </div>
          <div className="bg-brand-depth/30 rounded px-2 py-1">
            <span className="text-brand-accent-1 font-bold">{entry.reps}</span>
            <span className="text-xs text-brand-neutral-light/50 ml-1">
              POWT.
            </span>
          </div>
          <div className="bg-brand-depth/30 rounded px-2 py-1">
            <span className="text-brand-accent-1 font-bold">
              {entry.weight_kg}
            </span>
            <span className="text-xs text-brand-neutral-light/50 ml-1">KG</span>
          </div>
        </div>
      </motion.div>

      {/* Confirmation popup */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hidden rounded-2xl border border-brand-depth 
                            bg-brand-neutral-dark p-6 text-left align-middle shadow-xl transition-all"
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-brand-neutral-light flex items-center gap-2"
                  >
                    <WarningIcon className="text-2xl text-red-400" /> Potwierdź
                    usunięcie
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-brand-secondary">
                      Czy na pewno chcesz usunąć{" "}
                      <strong className="text-brand-neutral-light">
                        {entry.exercise?.name || "ćwiczenie"}
                      </strong>
                      ? Tej akcji nie można cofnąć.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row-reverse gap-3 ">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium 
                      text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 sm:w-auto cursor-pointer"
                      onClick={handleRemoveClick}
                    >
                      Usuń
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-brand-depth bg-brand-neutral-dark/50 px-4 py-2 text-sm 
                      font-medium text-brand-neutral-light hover:bg-brand-depth/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary 
                      focus-visible:ring-offset-2 sm:w-auto cursor-pointer"
                      onClick={closeModal}
                    >
                      Anuluj
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

interface WorkoutListProps {
  entries: WorkoutEntry[];
  onRemoveEntry: (id: string) => void;
  isLoading: boolean;
}

export default function WorkoutList({
  entries,
  onRemoveEntry,
  isLoading,
}: WorkoutListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 bg-brand-neutral-dark/50 border border-brand-depth rounded-xl p-4 flex items-center justify-center">
        <p className="text-brand-neutral-light/50">Ładowanie treningów...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex-1 bg-brand-neutral-dark/50 border border-brand-depth rounded-xl p-4 flex items-center justify-center">
        <p className="text-brand-neutral-light/50">Brak treningów tego dnia</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-brand-neutral-dark/50 border border-brand-depth rounded-xl p-4 overflow-y-auto custom-scrollbar">
      <AnimatePresence mode="popLayout">
        {entries.map((entry) => (
          <WorkoutItem
            key={entry.id}
            entry={entry}
            onRemoveEntry={onRemoveEntry}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
