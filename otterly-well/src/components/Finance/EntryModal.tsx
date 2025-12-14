import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import type { FinanceCategory, FinanceTransaction, FinanceType } from "./types";
import { CloseIcon, FinanceIcon } from "../icons";

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
  const [type, setType] = useState<FinanceType>(initialType);
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setAmount("");
      setTitle("");
      setDescription("");
      setCategoryId("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [isOpen, initialType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        type,
        amount: parseFloat(amount),
        title,
        description: description || null,
        category_id: categoryId || null,
        date,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === type);

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
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                className="relative transform overflow-hidden rounded-xl bg-brand-neutral-dark border border-brand-depth text-left 
                                  shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              >
                <div className="bg-brand-neutral-dark border-b border-brand-depth px-4 py-3 sm:px-6 flex justify-between items-center">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-semibold leading-6 text-brand-neutral-light flex items-center gap-2"
                  >
                    <FinanceIcon className="text-brand-accent-1" />
                    {type === "income" ? "Dodaj przychód" : "Dodaj wydatek"}
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="text-brand-secondary hover:text-brand-neutral-dark hover:bg-brand-neutral-light/70 rounded-full 
                              p-1 flex items-center justify-center cursor-pointer transition-all"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Type Switcher */}
                  <div className="flex rounded-md bg-brand-neutral-dark/50 p-1 border border-brand-depth">
                    <button
                      type="button"
                      onClick={() => setType("expense")}
                      className={`flex-1 py-1.5 text-sm font-medium rounded ${
                        type === "expense"
                          ? "bg-red-500/20 text-red-400 shadow-sm"
                          : "text-brand-secondary hover:text-brand-neutral-light cursor-pointer"
                      }`}
                    >
                      Wydatek
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("income")}
                      className={`flex-1 py-1.5 text-sm font-medium rounded ${
                        type === "income"
                          ? "bg-emerald-500/20 text-emerald-400 shadow-sm"
                          : "text-brand-secondary hover:text-brand-neutral-light cursor-pointer"
                      }`}
                    >
                      Przychód
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-neutral-light">
                      Kwota
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-brand-depth bg-brand-neutral-light/5 px-3 py-2 text-brand-neutral-light focus:border-brand-accent-1 focus:ring-1 focus:ring-brand-accent-1 focus:outline-none sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-neutral-light">
                      Tytuł
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-brand-depth bg-brand-neutral-light/5 px-3 py-2 text-brand-neutral-light focus:border-brand-accent-1 focus:ring-1 focus:ring-brand-accent-1 focus:outline-none sm:text-sm"
                      placeholder="np. Zakupy spożywcze"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-neutral-light">
                      Kategoria (opcjonalnie)
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-brand-depth bg-brand-neutral-light/5 px-3 py-2 text-brand-neutral-light focus:border-brand-accent-1 focus:ring-1 focus:ring-brand-accent-1 focus:outline-none sm:text-sm appearance-none"
                    >
                      <option value="" className="bg-brand-neutral-dark">
                        Wybierz kategorię
                      </option>
                      {filteredCategories.map((cat) => (
                        <option
                          key={cat.id}
                          value={cat.id}
                          className="bg-brand-neutral-dark"
                        >
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-neutral-light">
                      Data
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-brand-depth bg-brand-neutral-light/5 px-3 py-2 text-brand-neutral-light focus:border-brand-accent-1 focus:ring-1 focus:ring-brand-accent-1 focus:outline-none sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-neutral-light">
                      Opis (opcjonalnie)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-brand-depth bg-brand-neutral-light/5 px-3 py-2 text-brand-neutral-light 
                            focus:border-brand-accent-1 focus:ring-1 focus:ring-brand-accent-1 focus:outline-none sm:text-sm"
                    />
                  </div>

                  <div className="mt-5 sm:mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex w-full justify-center rounded-md bg-brand-accent-1 px-3 py-2 text-sm font-semibold text-brand-neutral-dark shadow-sm 
                              hover:bg-brand-accent-2 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand-accent-1 disabled:opacity-50
                              disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? "Zapisywanie..." : "Zapisz"}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
