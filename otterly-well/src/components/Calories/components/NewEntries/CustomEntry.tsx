import { motion } from "framer-motion";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import type { Entry } from "../../types/types";

interface CustomEntryProps {
  customEntry: Omit<Entry, "id">;
  handleCustomEntryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCustomEntrySubmit: (
    e: FormEvent,
    saveData?: { servingName: string; servingWeight: number }
  ) => void;
}

export const CustomEntry = ({
  customEntry,
  handleCustomEntryChange,
  handleCustomEntrySubmit,
}: CustomEntryProps) => {
  const [mode, setMode] = useState<"grams" | "serving">("grams");
  const [saveToMyFoods, setSaveToMyFoods] = useState(false);

  const [servingName, setServingName] = useState("");
  const [servingWeight, setServingWeight] = useState(0);

  // servings count or grams
  const [amount, setAmount] = useState(100);

  // Calculate macros based on mode and amount
  useEffect(() => {
    if (mode === "grams") {
      // Direct grams input
      handleCustomEntryChange({
        target: { name: "grams", value: amount.toString() },
      });
    } else {
      // grams = amount * servingWeight
      const totalGrams = amount * servingWeight;
      handleCustomEntryChange({
        target: { name: "grams", value: totalGrams.toString() },
      });
    }
  }, [mode, amount, servingWeight]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleCustomEntrySubmit(
      e,
      saveToMyFoods
        ? {
            servingName,
            servingWeight,
          }
        : undefined
    );
  };

  return (
    <motion.div
      key="custom"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="overflow-y-scroll"
    >
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-brand-neutral-dark/50 rounded-b-xl"
      >
        <div className="flex gap-2 mb-4 p-1 bg-brand-neutral-dark rounded-lg border border-brand-depth">
          <button
            type="button"
            onClick={() => setMode("grams")}
            className={`flex-1 py-1 px-3 rounded-md text-sm font-medium transition-colors ${
              mode === "grams"
                ? "bg-brand-accent-1 text-brand-neutral-dark"
                : "text-brand-secondary hover:text-brand-neutral-light hover:cursor-pointer"
            }`}
          >
            Na 100g
          </button>
          <button
            type="button"
            onClick={() => setMode("serving")}
            className={`flex-1 py-1 px-3 rounded-md text-sm font-medium transition-colors ${
              mode === "serving"
                ? "bg-brand-accent-1 text-brand-neutral-dark"
                : "text-brand-secondary hover:text-brand-neutral-light hover:cursor-pointer"
            }`}
          >
            Na porcję
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="name"
            className="rounded-md border border-brand-depth bg-brand-neutral-dark px-3 py-2 text-brand-neutral-light 
                    placeholder-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-accent-1/40 sm:col-span-2
                      transition-outline duration-300"
            placeholder="Nazwa produktu*"
            value={customEntry.name}
            onChange={handleCustomEntryChange}
            required
          />

          {mode === "serving" && (
            <div className="sm:col-span-2 grid grid-cols-2 gap-3 p-3 rounded-lg border border-brand-depth/50 bg-brand-neutral-dark/30">
              <label className="flex flex-col text-sm text-brand-neutral-light">
                Nazwa porcji*
                <input
                  type="text"
                  placeholder="porcja"
                  className="mt-1 rounded-md border border-brand-depth bg-brand-neutral-dark px-2 py-1 text-brand-neutral-light focus:ring-2 
                          focus:ring-brand-accent-1/40 focus:outline-none transition-outline duration-300"
                  value={servingName}
                  onChange={(e) => setServingName(e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col text-sm text-brand-neutral-light">
                Waga porcji (g)*
                <input
                  type="number"
                  min={1}
                  className="mt-1 rounded-md border border-brand-depth bg-brand-neutral-dark px-2 py-1 text-brand-neutral-light focus:ring-2 
                          focus:ring-brand-accent-1/40 focus:outline-none transition-outline duration-300"
                  value={servingWeight || "100"}
                  onChange={(e) => setServingWeight(Number(e.target.value))}
                  required
                />
              </label>
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="flex flex-col text-sm text-brand-neutral-light">
              {mode === "grams"
                ? "Ilość (g)"
                : `Ilość (${servingName || "porcji"})`}
              <input
                type="number"
                min={0}
                step={mode === "serving" ? 0.5 : 1}
                className="mt-1 w-full rounded-md border border-brand-depth bg-brand-neutral-dark px-3 py-2 text-brand-neutral-light focus:ring-2 
                        focus:ring-brand-accent-1/40 focus:outline-none transition-outline duration-300"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </label>
            {mode === "serving" && servingWeight > 0 && (
              <p className="text-xs text-brand-secondary mt-1 text-left">
                {amount} x {servingWeight}g = {amount * servingWeight}g
              </p>
            )}
          </div>

          <div className="">
            <label className="flex flex-col text-sm text-brand-neutral-light">
              Węglowodany (na 100g)
              <input
                name="carbs"
                type="number"
                min={0}
                className="mt-1 rounded-md border border-brand-depth bg-brand-neutral-dark px-2 py-1 text-brand-neutral-light focus:ring-2 
                        focus:ring-brand-accent-1/40 focus:outline-none transition-outline duration-300"
                value={customEntry.carbs}
                onChange={handleCustomEntryChange}
              />
            </label>
            <label className="flex flex-col text-sm text-brand-neutral-light">
              Białko (na 100g)
              <input
                name="protein"
                type="number"
                min={0}
                className="mt-1 rounded-md border border-brand-depth bg-brand-neutral-dark px-2 py-1 text-brand-neutral-light focus:ring-2 
                        focus:ring-brand-accent-1/40 focus:outline-none transition-outline duration-300"
                value={customEntry.protein}
                onChange={handleCustomEntryChange}
              />
            </label>
            <label className="flex flex-col text-sm text-brand-neutral-light">
              Tłuszcz (na 100g)
              <input
                name="fat"
                type="number"
                min={0}
                className="mt-1 rounded-md border border-brand-depth bg-brand-neutral-dark px-2 py-1 text-brand-neutral-light focus:ring-2 
                        focus:ring-brand-accent-1/40 focus:outline-none transition-outline duration-300"
                value={customEntry.fat}
                onChange={handleCustomEntryChange}
              />
            </label>
          </div>
          <div className="">
            <label className="flex flex-col text-sm text-brand-neutral-light">
              Kalorie (na 100g)
              <input
                name="kcal"
                type="number"
                min={0}
                className="mt-1 rounded-md border border-brand-depth bg-brand-neutral-dark px-2 py-1 text-brand-neutral-light focus:ring-2 
                        focus:ring-brand-accent-1/40 focus:outline-none transition-outline duration-300"
                value={customEntry.kcal}
                onChange={handleCustomEntryChange}
              />
            </label>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="saveToMyFoods"
            checked={saveToMyFoods}
            onChange={(e) => setSaveToMyFoods(e.target.checked)}
            className="rounded border-brand-depth bg-brand-neutral-dark text-brand-accent-1 focus:ring-brand-accent-1/40"
          />
          <label
            htmlFor="saveToMyFoods"
            className="text-sm text-brand-neutral-light select-none cursor-pointer"
          >
            Zapisz do moich produktów
          </label>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="w-full rounded-md bg-brand-accent-1 px-4 py-2 font-semibold text-brand-neutral-dark hover:bg-brand-accent-1/80 
                      transition duration-300 cursor-pointer"
          >
            Dodaj
          </button>
        </div>
      </form>
    </motion.div>
  );
};
