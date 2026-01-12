import { useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import type { FoodHit, FoodHitWithGrams } from "../../types/types";
import { useBarcodeSearch } from "../../hooks/useBarcodeSearch";
import { AddFoodDialog } from "./AddFoodDialog";

interface BarcodeScannerProps {
  addEntryFromFood: (food: FoodHit, grams: number) => void;
}

export const BarcodeScanner = ({ addEntryFromFood }: BarcodeScannerProps) => {
  const [manualBarcode, setManualBarcode] = useState("");
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [result, setResult] = useState<FoodHitWithGrams | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const {
    loading,
    hits,
    error: hookError,
    setHits,
  } = useBarcodeSearch(scannedBarcode);

  const [displayError, setDisplayError] = useState<string | null>(null);

  useEffect(() => {
    if (hookError) {
      setDisplayError(hookError);
      setResult(null);
      return;
    }

    if (hits.length > 0) {
      const firstHit = hits[0];

      if (firstHit.kcalPer100g != null) {
        setResult({
          ...firstHit,
          id: firstHit.sourceId || "result",
          grams: 100,
        });
        setIsOpen(true);
        setDisplayError(null);
      } else {
        setResult(null);
        setDisplayError(`"${firstHit.name}" nie zawiera danych o kaloriach.`);
      }
    } else {
      setResult(null);
      if (scannedBarcode && !loading) {
        setDisplayError("Nie znaleziono produktu o podanym kodzie.");
      }
    }
  }, [hits, hookError, scannedBarcode, loading]);

  const resetState = () => {
    setScannedBarcode("");
    setManualBarcode("");
    setResult(null);
    setHits([]);
    setIsOpen(false);
    setDisplayError(null);
  };

  const handleManualSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDisplayError(null);
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

  const handleGramsChange = (grams: number) => {
    if (result) {
      setResult({ ...result, grams: grams });
    }
  };
  return (
    <>
      <motion.div
        key="scan"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="pt-4 px-4 bg-brand-neutral-dark/50 rounded-xl rounded-tl-none"
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

        {displayError && (
          <p className="mt-4 text-center text-brand-warning font-semibold T">
            {displayError}
          </p>
        )}
        <div className="h-4"></div>
      </motion.div>

      <AddFoodDialog
        isOpen={isOpen}
        onClose={resetState}
        onSubmit={handleAddSubmit}
        foodHit={result}
        onGramsChange={handleGramsChange}
      />
    </>
  );
};
