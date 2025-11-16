import { useState, useEffect, FormEvent, Fragment } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import type { FoodHit, FoodHitWithGrams } from "../../types/types";
import { useBarcodeSearch } from "../../hooks/useBarcodeSearch";

interface BarcodeScannerProps {
  addEntryFromFood: (food: FoodHit, grams: number) => void;
}

export const BarcodeScanner = ({ addEntryFromFood }: BarcodeScannerProps) => {
  const [manualBarcode, setManualBarcode] = useState("");
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [result, setResult] = useState<FoodHitWithGrams | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { loading, hits, error, setHits } = useBarcodeSearch(scannedBarcode);

  useEffect(() => {
    if (hits.length > 0) {
      setResult({ ...hits[0], id: hits[0].sourceId || "result", grams: 100 });
      setIsOpen(true);
    } else {
      setResult(null);
    }
  }, [hits]);

  const resetState = () => {
    setScannedBarcode("");
    setManualBarcode("");
    setResult(null);
    setHits([]);
    setIsOpen(false);
  };

  const handleManualSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (manualBarcode) {
      setScannedBarcode(manualBarcode);
    }
  };

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (result && result.grams > 0) {
      addEntryFromFood(result, result.grams);
      resetState();
    }
  };

  return (
    <>
      {/* Manual input area */}
      <motion.div
        key="scan"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="pt-4 px-4 bg-brand-neutral-dark/50 rounded-b-xl"
      >
        {loading ? (
          <p className="text-center text-brand-secondary">Szukam...</p>
        ) : (
          <form onSubmit={handleManualSubmit}>
            <input
              type="text"
              placeholder="Wpisz numer kodu kreskowego..."
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              className="mt-1 w-full rounded-md border border-brand-depth bg-brand-neutral-dark px-3 py-2 text-brand-neutral-light 
                         placeholder-brand-secondary focus:ring-2 focus:ring-brand-accent-1/40 focus:outline-none"
            />
            <button
              type="submit"
              className="mt-3 w-full rounded-md bg-brand-primary px-4 py-2 font-semibold text-brand-neutral-light
                         hover:bg-brand-primary/80 transition duration-300 cursor-pointer disabled:bg-brand-secondary"
              disabled={!manualBarcode || loading}
            >
              Szukaj ręcznie
            </button>
          </form>
        )}

        {error && (
          <p className="mt-4 text-center text-brand-warning">Błąd: {error}</p>
        )}
        <div className="h-4"></div>
      </motion.div>

      {/* Bottom dialog for results */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={resetState}>
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
                {result && (
                  <>
                    <DialogTitle
                      as="h3"
                      className="text-lg font-medium leading-6 text-brand-neutral-light"
                    >
                      Dodaj produkt
                    </DialogTitle>

                    <form onSubmit={handleAddSubmit} className="mt-4">
                      {/* Food info */}
                      <div className="rounded-lg border border-brand-depth p-3">
                        <p className="text-brand-neutral-light truncate">
                          {result.name}
                        </p>
                        <p className="text-sm text-brand-secondary">
                          {result.brand ?? "—"} • {result.kcalPer100g} kcal /
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
                          value={result.grams}
                          onChange={(e) =>
                            setResult({
                              ...result,
                              grams: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      {/* Buttons */}
                      <div className="mt-6 flex gap-3">
                        <button
                          type="button"
                          className="flex-1 justify-center rounded-md border border-brand-secondary px-4 py-2 text-sm font-medium text-brand-secondary hover:bg-brand-secondary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-1/40"
                          onClick={resetState}
                        >
                          Anuluj
                        </button>
                        <button
                          type="submit"
                          disabled={result.grams <= 0}
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
    </>
  );
};
