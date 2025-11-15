import { useState, Fragment } from "react";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import { DeleteIcon, WarningIcon } from "../../icons";
import type { Entry } from "../types";
import { MacroBar } from "../MacroBar";

interface EntryItemProps {
  entry: Entry;
  removeEntry: (id: string) => void;
}

export const EntryItem = ({ entry: e, removeEntry }: EntryItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRemoveClick = () => {
    closeModal();
    setTimeout(() => removeEntry(e.id), 150);
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
          <p className="text-brand-neutral-light">{e.name}</p>

          <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-brand-secondary">
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

        {/* Button */}
        <div className="flex-shrink-0 w-full sm:w-auto flex justify-center">
          <button
            onClick={openModal}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-brand-depth 
                       bg-brand-neutral-dark px-3 py-1 text-sm text-brand-neutral-light 
                       hover:bg-red-800/20 hover:border-red-500/30 hover:text-red-400
                       transition-colors duration-200 cursor-pointer"
          >
            <DeleteIcon className="text-base" />
            Usuń
          </button>
        </div>
      </motion.li>

      {/* Confirmation popup */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border border-brand-depth bg-brand-neutral-dark p-6 text-left align-middle shadow-xl transition-all">
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
                        {e.name}
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
