import { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import type { FoodHit, FoodHitWithGrams } from "../types";
import { useBarcodeSearch } from "../useBarcodeSearch";

interface BarcodeScannerProps {
  addEntryFromFood: (food: FoodHit, grams: number) => void;
}

export const BarcodeScanner = ({ addEntryFromFood }: BarcodeScannerProps) => {
  const [manualBarcode, setManualBarcode] = useState("");
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [result, setResult] = useState<FoodHitWithGrams | null>(null);

  const { loading, hits, error, setHits } = useBarcodeSearch(scannedBarcode);

  useEffect(() => {
    if (hits.length > 0) {
      setResult({ ...hits[0], id: hits[0].sourceId || "result", grams: 100 });
    } else {
      setResult(null);
    }
  }, [hits]);

  const resetState = () => {
    setScannedBarcode("");
    setManualBarcode("");
    setResult(null);
    setHits([]);
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

  const renderResult = () => (
    <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {result && (
        <form
          onSubmit={handleAddSubmit}
          className="p-3 flex items-center gap-3 rounded-lg border border-brand-depth"
        >
          <div className="min-w-0 flex-1">
            <p className="text-brand-neutral-light truncate">{result.name}</p>
            <p className="text-sm text-brand-secondary">
              {result.brand ?? "—"} • {result.kcalPer100g} kcal / 100g
            </p>
          </div>
          <input
            type="number"
            min={1}
            className="w-24 rounded-md border border-brand-depth bg-brand-neutral-dark px-2 py-1 text-brand-neutral-light focus:outline-none focus:ring-2 focus:ring-brand-accent-1/40"
            placeholder="Gramy"
            value={result.grams}
            onChange={(e) =>
              setResult({ ...result, grams: Number(e.target.value) })
            }
          />
          <button
            type="submit"
            className="rounded-md bg-brand-accent-1 px-3 py-1 text-sm font-semibold text-brand-neutral-dark hover:bg-brand-accent-1/80"
            disabled={result.grams <= 0}
          >
            Dodaj
          </button>
        </form>
      )}
      <button
        onClick={resetState}
        className="mt-4 w-full text-center text-sm text-brand-secondary hover:text-brand-neutral-light"
      >
        Wyszukaj ponownie
      </button>
    </motion.div>
  );

  const renderDefault = () => (
    <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
    </motion.div>
  );

  return (
    <motion.div
      key="scan"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="pt-4 px-4 bg-brand-neutral-dark/50 rounded-b-xl"
    >
      {result ? (
        renderResult()
      ) : loading ? (
        <p className="text-center text-brand-secondary">Szukam...</p>
      ) : (
        renderDefault()
      )}

      {error && (
        <p className="mt-4 text-center text-brand-warning">Błąd: {error}</p>
      )}
      <div className="h-4"></div>
    </motion.div>
  );
};
