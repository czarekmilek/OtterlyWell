import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExerciseSearch } from "../../hooks/useExerciseSearch";
import { SearchIcon } from "../../../icons";
import type { Exercise } from "../../types/types";

interface ExerciseSearchProps {
  onAddExercise: (
    exercise: Exercise,
    sets: number,
    reps: number,
    weight: number
  ) => void;
  submitButtonText?: string;
}

export default function ExerciseSearch({
  onAddExercise,
  submitButtonText = "Dodaj ćwiczenie",
}: ExerciseSearchProps) {
  const [query, setQuery] = useState("");
  const { loading, hits, error } = useExerciseSearch(query);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);

  const handleAdd = () => {
    if (selectedExercise) {
      onAddExercise(selectedExercise, sets, reps, weight);
      setSelectedExercise(null);
      setQuery("");
      // Reset defaults
      setSets(3);
      setReps(10);
      setWeight(0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-brand-neutral-dark/20 overflow-hidden border border-brand-depth/50">
      <AnimatePresence mode="wait">
        {!selectedExercise ? (
          <motion.div
            key="search"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full"
          >
            <div className="p-3 border-b border-brand-depth bg-brand-neutral-dark relative">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-neutral-light/50" />
              <input
                type="text"
                placeholder="Szukaj ćwiczenia..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-brand-depth/30 border border-brand-depth/50 text-brand-neutral-light 
                          placeholder-brand-neutral-light/30 focus:outline-none focus:ring-1 focus:ring-brand-accent-1 focus:border-brand-accent-1 
                          transition-all"
              />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {loading && (
                <p className="text-brand-neutral-light/50 text-center py-8 text-sm animate-pulse">
                  Szukanie...
                </p>
              )}
              {error && (
                <p className="text-red-400 text-center py-4 text-sm">
                  Błąd: {error}
                </p>
              )}

              {hits.map((exercise) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{
                    scale: 1.01,
                  }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedExercise(exercise)}
                  className="p-4 rounded-lg bg-brand-neutral-dark border border-brand-depth/50 
                            cursor-pointer transition-colors group shadow-sm hover:shadow-md hover:border-brand-accent-3/30
                            hover:bg-brand-neutral-dark/90"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-brand-neutral-light group-hover:text-brand-accent-3 transition-colors">
                      {exercise.name}
                    </span>
                    <span className="text-lg sm:text-xs font-bold text-brand-neutral-dark/80 bg-brand-depth px-2 py-1 rounded-full uppercase tracking-wide">
                      {exercise.muscle_group}
                    </span>
                  </div>
                </motion.div>
              ))}

              {!loading && query && hits.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-brand-neutral-light/40">
                  <SearchIcon className="text-4xl mb-2 opacity-20" />
                  <p className="text-sm">Brak wyników</p>
                </div>
              )}

              {!loading && !query && (
                <div className="flex flex-col items-center justify-center py-12 text-brand-neutral-light/30">
                  <SearchIcon className="text-5xl mb-3 opacity-20" />
                  <p className="text-sm">Wpisz nazwę aby wyszukać</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full p-4"
          >
            <div className="flex items-center justify-between border-b border-brand-depth pb-4 mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-brand-neutral-light">
                  {selectedExercise.name}
                </h3>
                <p className="text-xs text-brand-neutral-light/60 uppercase tracking-wider mt-1">
                  Dodaj szczegóły
                </p>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="text-sm text-brand-neutral-light/60 hover:text-brand-neutral-light hover:underline transition-all cursor-pointer"
              >
                Anuluj
              </button>
            </div>

            <div
              className={`grid gap-3 mb-6 ${
                selectedExercise.type === "strength"
                  ? "grid-cols-3"
                  : "grid-cols-2"
              }`}
            >
              <div className="flex flex-col p-3 rounded-lg bg-brand-neutral-dark/90 border border-brand-depth">
                <label className="text-xs font-bold text-brand-neutral-light/70 uppercase text-center">
                  Liczba serii
                </label>
                <input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(Number(e.target.value))}
                  className="w-full bg-transparent text-center text-xl font-bold text-brand-accent-1 focus:outline-none"
                />
              </div>
              <div className="flex flex-col p-3 rounded-lg bg-brand-neutral-dark/90 border border-brand-depth">
                <label className="text-xs font-bold text-brand-neutral-light/70 uppercase text-center">
                  Powtórzenia
                </label>
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(Number(e.target.value))}
                  className="w-full bg-transparent text-center text-xl font-bold text-brand-accent-1 focus:outline-none"
                />
              </div>

              {(selectedExercise.type === "strength" ||
                (!selectedExercise.type && true)) && (
                <div className="flex flex-col p-3 rounded-lg bg-brand-neutral-dark/90 border border-brand-depth">
                  <label className="text-xs font-bold text-brand-neutral-light/70 uppercase text-center">
                    Ciężar (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full bg-transparent text-center text-xl font-bold text-brand-accent-1 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <motion.button
              onClick={handleAdd}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-auto w-full py-3.5 bg-brand-accent-1 hover:bg-brand-accent-2 cursor-pointer text-white font-bold rounded-xl 
                         shadow-lg hover:shadow-brand-accent-1/20 transition-all flex items-center justify-center gap-2"
            >
              {submitButtonText}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
