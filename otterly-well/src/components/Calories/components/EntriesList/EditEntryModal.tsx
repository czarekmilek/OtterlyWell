import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import type { Entry } from "../../types/types";
import { CloseIcon } from "../../../icons";

interface EditEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: Entry;
  onSave: (id: string, updates: Partial<Entry>) => void;
}

export const EditEntryModal = ({
  isOpen,
  onClose,
  entry,
  onSave,
}: EditEntryModalProps) => {
  const [name, setName] = useState(entry.name);
  const [kcal, setKcal] = useState(entry.kcal);
  const [protein, setProtein] = useState(entry.protein);
  const [fat, setFat] = useState(entry.fat);
  const [carbs, setCarbs] = useState(entry.carbs);
  const [grams, setGrams] = useState(entry.grams);

  useEffect(() => {
    if (isOpen) {
      setName(entry.name);
      setKcal(entry.kcal);
      setProtein(entry.protein);
      setFat(entry.fat);
      setCarbs(entry.carbs);
      setGrams(entry.grams);
    }
  }, [entry, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(entry.id, {
      name,
      kcal: Number(kcal),
      protein: Number(protein),
      fat: Number(fat),
      carbs: Number(carbs),
      grams: Number(grams),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-brand-neutral-darker/70 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded-2xl bg-brand-neutral-dark border border-brand-depth p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-brand-neutral-light">
              Edytuj wpis
            </h3>
            <button
              onClick={onClose}
              className="flex items-center justify-center text-brand-neutral-light/60 hover:text-brand-neutral-light 
                  hover:bg-brand-neutral-light/10 rounded-full p-1 transition-colors cursor-pointer"
            >
              <CloseIcon />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                Nazwa
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-brand-neutral-dark/40 border border-brand-depth rounded-xl text-brand-neutral-light focus:outline-none focus:border-brand-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                Ilość
              </label>
              <input
                type="number"
                value={grams}
                // updating grams udpates all macros automatiicaly
                onChange={(e) => {
                  const newGrams = Number(e.target.value);
                  setGrams(newGrams);
                  if (entry.grams > 0) {
                    const ratio = newGrams / entry.grams;
                    setKcal(Math.round(entry.kcal * ratio));
                    setProtein(Math.round(entry.protein * ratio * 10) / 10);
                    setFat(Math.round(entry.fat * ratio * 10) / 10);
                    setCarbs(Math.round(entry.carbs * ratio * 10) / 10);
                  }
                }}
                className="w-full px-3 py-2 bg-brand-neutral-dark/40 border border-brand-depth rounded-xl text-brand-neutral-light focus:outline-none focus:border-brand-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                  Kcal
                </label>
                <input
                  type="number"
                  value={kcal}
                  onChange={(e) => setKcal(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-brand-neutral-dark/40 border border-brand-depth rounded-xl text-brand-neutral-light focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                  Białko (g)
                </label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-brand-neutral-dark/40 border border-brand-depth rounded-xl text-brand-neutral-light focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                  Tłuszcz (g)
                </label>
                <input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-brand-neutral-dark/40 border border-brand-depth rounded-xl text-brand-neutral-light focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                  Węgle (g)
                </label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-brand-neutral-dark/40 border border-brand-depth rounded-xl text-brand-neutral-light focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2 bg-brand-accent-2 rounded-xl text-brand-neutral-light font-bold hover:bg-brand-accent-2/70 transition-all cursor-pointer"
              >
                Zapisz
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
