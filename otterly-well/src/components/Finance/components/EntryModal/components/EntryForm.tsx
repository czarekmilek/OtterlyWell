import { useState, useEffect, forwardRef } from "react";
import { DialogPanel } from "@headlessui/react";
import type {
  FinanceCategory,
  FinanceTransaction,
  FinanceType,
} from "../../../types/types";
import { EntryModalHeader } from "./EntryModalHeader";
import { EntryTypeToggle } from "./EntryTypeToggle";

interface EntryFormProps {
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

const EntryForm = forwardRef<HTMLDivElement, EntryFormProps>(
  ({ isOpen, onClose, onSubmit, categories, initialType = "expense" }, ref) => {
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
      <DialogPanel
        ref={ref}
        className="relative transform overflow-hidden rounded-xl bg-brand-neutral-dark border border-brand-depth text-left 
                        shadow-xl transition-all sm:my-8 w-full sm:max-w-lg"
      >
        <EntryModalHeader type={type} onClose={onClose} />

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <EntryTypeToggle type={type} setType={setType} />

          <div>
            <label className="block text-sm font-medium text-brand-neutral-light">
              Kwota
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border border-brand-depth bg-brand-neutral-light/5 px-3 py-2 
                  text-brand-neutral-light focus:border-brand-accent-1 focus:ring-1 focus:ring-brand-accent-1 
                    focus:outline-none sm:text-sm"
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
              className="mt-1 block w-full rounded-md border border-brand-depth bg-brand-neutral-light/5 px-3 py-2 
                    text-brand-neutral-light focus:border-brand-accent-1 focus:ring-1 focus:ring-brand-accent-1 
                      focus:outline-none sm:text-sm"
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
    );
  }
);

EntryForm.displayName = "EntryForm";

export default EntryForm;
