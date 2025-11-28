import { type FormEvent, Fragment, useState, useEffect } from "react";
import type { FoodHitWithGrams } from "../../types/types";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

interface AddFoodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  foodHit: FoodHitWithGrams | null;
  onGramsChange: (grams: number) => void;
}

export const AddFoodDialog = ({
  isOpen,
  onClose,
  onSubmit,
  foodHit,
  onGramsChange,
}: AddFoodDialogProps) => {
  const [amount, setAmount] = useState(1);
  const [mode, setMode] = useState<"grams" | "serving">("grams");

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen && foodHit) {
      if (foodHit.servingSize) {
        setMode("serving");
        setAmount(1);
        onGramsChange(foodHit.servingSize);
      } else {
        setMode("grams");
        setAmount(100);
        onGramsChange(100);
      }
    }
  }, [isOpen, foodHit?.id]);

  const handleAmountChange = (val: number) => {
    setAmount(val);
    if (mode === "serving" && foodHit?.servingSize) {
      onGramsChange(val * foodHit.servingSize);
    } else {
      onGramsChange(val);
    }
  };

  const toggleMode = () => {
    if (mode === "grams" && foodHit?.servingSize) {
      setMode("serving");
      setAmount(1);
      onGramsChange(foodHit.servingSize);
    } else {
      setMode("grams");
      setAmount(100);
      onGramsChange(100);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-brand-neutral-dark/80" />
        </TransitionChild>

        {/* Panel */}
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
            <DialogPanel
              className="w-full max-w-md transform overflow-hidden rounded-t-xl bg-brand-neutral-dark p-6 text-left 
                          align-middle shadow-xl transition-all border-t border-brand-depth"
            >
              {foodHit && (
                <>
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-brand-neutral-light"
                  >
                    Dodaj produkt
                  </DialogTitle>

                  <form onSubmit={onSubmit} className="mt-4">
                    {/* Food info */}
                    <div className="rounded-lg border border-brand-depth p-3">
                      <p className="text-brand-neutral-light truncate">
                        {foodHit.name}
                      </p>
                      <p className="text-sm text-brand-secondary">
                        {foodHit.brand ?? "—"} • {foodHit.kcalPer100g} kcal /
                        100g
                      </p>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <label
                          htmlFor="amount"
                          className="block text-sm font-medium text-brand-secondary"
                        >
                          Ilość{" "}
                          {mode === "serving"
                            ? `(${foodHit.servingUnit || "porcji"})`
                            : "(g)"}
                        </label>
                        {foodHit.servingSize && (
                          <button
                            type="button"
                            onClick={toggleMode}
                            className="text-xs text-brand-accent-1 hover:underline hover:cursor-pointer"
                          >
                            {mode === "grams"
                              ? "Przełącz na porcje"
                              : "Przełącz na gramy"}
                          </button>
                        )}
                      </div>

                      <input
                        id="amount"
                        type="number"
                        min={1}
                        step={mode === "serving" ? 0.5 : 1}
                        className="mt-1 w-full rounded-md border border-brand-depth bg-brand-neutral-dark px-3 py-2 
                                text-brand-neutral-light focus:outline-none focus:ring-2 focus:ring-brand-accent-1/40
                                transition-focus duration-300"
                        value={amount}
                        onChange={(e) =>
                          handleAmountChange(Number(e.target.value))
                        }
                      />

                      {mode === "serving" && foodHit.servingSize && (
                        <p className="text-xs text-brand-secondary mt-1 text-left">
                          {amount} x {foodHit.servingSize}g ={" "}
                          {Math.round(amount * foodHit.servingSize)}g
                        </p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        className="flex-1 justify-center rounded-md border border-brand-secondary px-4 py-2 text-sm font-medium 
                                text-brand-secondary hover:bg-brand-secondary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-1/40"
                        onClick={onClose}
                      >
                        Anuluj
                      </button>
                      <button
                        type="submit"
                        disabled={foodHit.grams <= 0}
                        className="flex-1 justify-center rounded-md bg-brand-accent-1 px-4 py-2 text-sm font-semibold 
                                text-brand-neutral-dark hover:bg-brand-accent-1/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-1/40 disabled:bg-brand-secondary"
                      >
                        Dodaj
                      </button>
                    </div>
                  </form>
                </>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
