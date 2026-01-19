import { useState, useEffect, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
  DialogTitle,
} from "@headlessui/react";
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
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-brand-neutral-darker/70 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-end justify-center">
          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel className="w-full max-w-md rounded-t-xl bg-brand-neutral-dark border-t border-brand-depth p-6 shadow-xl relative">
              <div className="flex justify-between items-center mb-4">
                <DialogTitle className="text-lg font-bold text-brand-neutral-light">
                  Edytuj wpis
                </DialogTitle>
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
                    className="w-full rounded-md border border-brand-depth bg-brand-neutral-dark px-3 py-2 
                             text-brand-neutral-light focus:outline-none focus:ring-2 focus:ring-brand-accent-1/40
                             transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                    Ilość (g)
                  </label>
                  <input
                    type="number"
                    value={grams}
                    // updating grams udpates all macros automatiicaly
                    onChange={(e) => {
                      const newGrams = Number(e.target.value);

                      // Auto-update grams in name if present
                      const gramPattern = new RegExp(
                        `\\((${grams}|${entry.grams})\\s*g\\)|(${grams}|${entry.grams})\\s*g`,
                        "i",
                      );
                      if (gramPattern.test(name)) {
                        setName(
                          name.replace(gramPattern, (match) =>
                            match.replace(/\d+/, newGrams.toString()),
                          ),
                        );
                      }

                      setGrams(newGrams);
                      if (entry.grams > 0) {
                        const ratio = newGrams / entry.grams;
                        setKcal(Math.round(entry.kcal * ratio));
                        setProtein(Math.round(entry.protein * ratio * 10) / 10);
                        setFat(Math.round(entry.fat * ratio * 10) / 10);
                        setCarbs(Math.round(entry.carbs * ratio * 10) / 10);
                      }
                    }}
                    className="w-full rounded-md border border-brand-depth bg-brand-neutral-dark px-3 py-2 
                             text-brand-neutral-light focus:outline-none focus:ring-2 focus:ring-brand-accent-1/40
                             transition-all duration-300"
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
                      className="w-full rounded-md border border-brand-depth bg-brand-neutral-dark px-3 py-2 
                               text-brand-neutral-light focus:outline-none focus:ring-2 focus:ring-brand-accent-1/40
                               transition-all duration-300"
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
                      className="w-full rounded-md border border-brand-depth bg-brand-neutral-dark px-3 py-2 
                               text-brand-neutral-light focus:outline-none focus:ring-2 focus:ring-brand-accent-1/40
                               transition-all duration-300"
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
                      className="w-full rounded-md border border-brand-depth bg-brand-neutral-dark px-3 py-2 
                               text-brand-neutral-light focus:outline-none focus:ring-2 focus:ring-brand-accent-1/40
                               transition-all duration-300"
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
                      className="w-full rounded-md border border-brand-depth bg-brand-neutral-dark px-3 py-2 
                               text-brand-neutral-light focus:outline-none focus:ring-2 focus:ring-brand-accent-1/40
                               transition-all duration-300"
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
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
