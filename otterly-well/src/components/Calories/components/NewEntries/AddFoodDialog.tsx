import { FormEvent, Fragment } from "react";
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
                      <label
                        htmlFor="grams"
                        className="block text-sm font-medium text-brand-secondary"
                      >
                        Gramy
                      </label>
                      <input
                        id="grams"
                        type="number"
                        min={1}
                        className="mt-1 w-full rounded-md border border-brand-depth bg-brand-neutral-dark px-3 py-2 text-brand-neutral-light focus:outline-none focus:ring-2 focus:ring-brand-accent-1/40"
                        placeholder="100"
                        value={foodHit.grams}
                        onChange={(e) => onGramsChange(Number(e.target.value))}
                      />
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        className="flex-1 justify-center rounded-md border border-brand-secondary px-4 py-2 text-sm font-medium text-brand-secondary hover:bg-brand-secondary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-1/40"
                        onClick={onClose}
                      >
                        Anuluj
                      </button>
                      <button
                        type="submit"
                        disabled={foodHit.grams <= 0}
                        className="flex-1 justify-center rounded-md bg-brand-accent-1 px-4 py-2 text-sm font-semibold text-brand-neutral-dark hover:bg-brand-accent-1/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-1/40 disabled:bg-brand-secondary"
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
