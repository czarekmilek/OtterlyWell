import { Fragment } from "react";
import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import type {
  FinanceCategory,
  FinanceTransaction,
  FinanceType,
} from "../../types/types";
import EntryForm from "./components/EntryForm";

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    entry: Omit<
      FinanceTransaction,
      "id" | "user_id" | "created_at" | "finance_categories"
    >
  ) => Promise<any>;
  categories: FinanceCategory[];
  initialType?: FinanceType;
}

export default function EntryModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialType = "expense",
}: EntryModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-brand-neutral-dark/80" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 text-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <EntryForm
                isOpen={isOpen}
                onClose={onClose}
                onSubmit={onSubmit}
                categories={categories}
                initialType={initialType}
              />
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
