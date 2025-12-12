import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { WarningIcon } from "../icons";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Potwierdź usunięcie",
  description,
  confirmLabel = "Usuń",
  cancelLabel = "Anuluj",
}: ConfirmDeleteDialogProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
                  <WarningIcon className="text-2xl text-red-400" /> {title}
                </Dialog.Title>
                <div className="mt-2">
                  <div className="text-sm text-brand-secondary">
                    {description}
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium 
                    text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto transition-colors"
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                  >
                    {confirmLabel}
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-lg border border-brand-depth bg-brand-neutral-dark px-4 py-2 text-sm 
                    font-medium text-brand-neutral-light hover:bg-brand-depth/40 focus:outline-none focus:ring-2 focus:ring-brand-primary 
                    focus:ring-offset-2 sm:w-auto transition-colors"
                    onClick={onClose}
                  >
                    {cancelLabel}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
