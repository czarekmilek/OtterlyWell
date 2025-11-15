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
      className="h-96"
    >
      <form
        onSubmit={handleCustomEntrySubmit}
        className="p-4 bg-gray-800/50 rounded-xl"
      >
        <h2 className="text-lg font-semibold text-gray-100">
          Dodaj własny produkt
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            name="name"
            className="rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 sm:col-span-2"
            placeholder="Nazwa produktu"
            value={customEntry.name}
            onChange={handleCustomEntryChange}
          />
          <div className="">
            <label className="flex flex-col text-sm text-gray-300">
              Węglowodany
              <input
                name="carbs"
                type="number"
                min={0}
                className="mt-1 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:ring-2 focus:ring-orange-400/40 focus:outline-none"
                value={customEntry.carbs}
                onChange={handleCustomEntryChange}
              />
            </label>
            <label className="flex flex-col text-sm text-gray-300">
              Białko
              <input
                name="protein"
                type="number"
                min={0}
                className="mt-1 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:ring-2 focus:ring-orange-400/40 focus:outline-none"
                value={customEntry.protein}
                onChange={handleCustomEntryChange}
              />
            </label>
            <label className="flex flex-col text-sm text-gray-300">
              Tłuszcz
              <input
                name="fat"
                type="number"
                min={0}
                className="mt-1 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:ring-2 focus:ring-orange-400/40 focus:outline-none"
                value={customEntry.fat}
                onChange={handleCustomEntryChange}
              />
            </label>
          </div>
          <div className="">
            <label className="flex flex-col text-sm text-gray-300">
              Kalorie
              <input
                name="kcal"
                type="number"
                min={0}
                className="mt-1 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:ring-2 focus:ring-orange-400/40 focus:outline-none"
                value={customEntry.kcal}
                onChange={handleCustomEntryChange}
              />
            </label>
            <label>
              <span className="flex flex-col text-sm text-gray-300">Gramy</span>
              <input
                name="grams"
                type="number"
                min={0}
                className="mt-1 rounded-md border border-white/10 bg-gray-900 px-2 py-1 text-gray-100 focus:ring-2 focus:ring-orange-400/40 focus:outline-none"
                value={customEntry.grams}
                onChange={handleCustomEntryChange}
              />
            </label>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="w-full rounded-md bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-400 transition duration-300 cursor-pointer"
          >
            Dodaj
          </button>
        </div>
      </form>
    </motion.div>
  );
};
