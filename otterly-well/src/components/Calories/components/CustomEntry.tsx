import { motion } from "framer-motion";
import type { Entry } from "../types";

interface CustomEntryProps {
  customEntry: Omit<Entry, "id">;
  handleCustomEntryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomEntrySubmit: (e: React.FormEvent) => void;
}

export const CustomEntry = ({
  customEntry,
  handleCustomEntryChange,
  handleCustomEntrySubmit,
}: CustomEntryProps) => {
  return (
    <motion.div
      key="custom"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className=""
    >
      <form
        onSubmit={handleCustomEntrySubmit}
        className="p-4 bg-brand-neutral-dark/50 rounded-b-xl"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="name"
            className="rounded-md border border-brand-depth bg-brand-neutral-dark px-3 py-2 text-brand-neutral-light placeholder-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent-1/40 sm:col-span-2"
            placeholder="Nazwa produktu"
            value={customEntry.name}
            onChange={handleCustomEntryChange}
          />
          <div className="">
            <label className="flex flex-col text-sm text-brand-neutral-light">
              Węglowodany
              <input
                name="carbs"
                type="number"
                min={0}
                className="mt-1 rounded-md border border-brand-depth bg-brand-neutral-dark px-2 py-1 text-brand-neutral-light focus:ring-2 focus:ring-brand-accent-1/40 focus:outline-none"
                value={customEntry.carbs}
                onChange={handleCustomEntryChange}
              />
            </label>
            <label className="flex flex-col text-sm text-brand-neutral-light">
              Białko
              <input
                name="protein"
                type="number"
                min={0}
                className="mt-1 rounded-md border border-brand-depth bg-brand-neutral-dark px-2 py-1 text-brand-neutral-light focus:ring-2 focus:ring-brand-accent-1/40 focus:outline-none"
                value={customEntry.protein}
                onChange={handleCustomEntryChange}
              />
            </label>
            <label className="flex flex-col text-sm text-brand-neutral-light">
              Tłuszcz
              <input
                name="fat"
                type="number"
                min={0}
                className="mt-1 rounded-md border border-brand-depth bg-brand-neutral-dark px-2 py-1 text-brand-neutral-light focus:ring-2 focus:ring-brand-accent-1/40 focus:outline-none"
                value={customEntry.fat}
                onChange={handleCustomEntryChange}
              />
            </label>
          </div>
          <div className="">
            <label className="flex flex-col text-sm text-brand-neutral-light">
              Kalorie
              <input
                name="kcal"
                type="number"
                min={0}
                className="mt-1 rounded-md border border-brand-depth bg-brand-neutral-dark px-2 py-1 text-brand-neutral-light focus:ring-2 focus:ring-brand-accent-1/40 focus:outline-none"
                value={customEntry.kcal}
                onChange={handleCustomEntryChange}
              />
            </label>
            <label className="flex flex-col text-sm text-brand-neutral-light">
              Gramy
              <input
                name="grams"
                type="number"
                min={0}
                className="mt-1 rounded-md border border-brand-depth bg-brand-neutral-dark px-2 py-1 text-brand-neutral-light focus:ring-2 focus:ring-brand-accent-1/40 focus:outline-none"
                value={customEntry.grams}
                onChange={handleCustomEntryChange}
              />
            </label>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="w-full rounded-md bg-brand-accent-1 px-4 py-2 font-semibold text-brand-neutral-dark hover:bg-brand-accent-1/80 transition duration-300 cursor-pointer"
          >
            Dodaj
          </button>
        </div>
      </form>
    </motion.div>
  );
};
