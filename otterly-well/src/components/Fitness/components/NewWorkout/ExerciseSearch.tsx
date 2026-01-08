import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExerciseSearch } from "../../hooks/useExerciseSearch";
import { SearchIcon, HistoryIcon } from "../../../icons";
import AddExerciseToList from "./AddExerciseToList";
import type { ExerciseInputData } from "./AddExerciseToList";
import type { Exercise } from "../../types/types";

interface ExerciseSearchProps {
  onAddExercise: (exercise: Exercise, data: ExerciseInputData) => void;
  submitButtonText?: string;
  onCreateExercise?: () => void;
}

export default function ExerciseSearch({
  onAddExercise,
  submitButtonText = "Dodaj ćwiczenie",
  onCreateExercise,
}: ExerciseSearchProps) {
  const [query, setQuery] = useState("");
  const { loading, hits, error, isRecent } = useExerciseSearch(query);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );

  const handleCreateExercise = (data: ExerciseInputData) => {
    if (selectedExercise) {
      onAddExercise(selectedExercise, data);
      setSelectedExercise(null);
      setQuery("");
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
            <div className="p-3 border-b border-brand-depth bg-brand-neutral-dark relative flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-neutral-light/50" />
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
              <button
                onClick={onCreateExercise}
                className="bg-brand-accent-1 hover:bg-brand-accent-2 text-white p-3 rounded-lg transition-colors shadow-lg cursor-pointer"
                title="Stwórz nowe ćwiczenie"
              >
                +
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 relative">
              <AnimatePresence>
                {loading && query.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-brand-neutral-dark/60 backdrop-blur-xs"
                  >
                    <p className="text-brand-neutral-light/70 font-medium animate-pulse">
                      Szukanie...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
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
                  className={`p-4 rounded-lg bg-brand-neutral-dark border 
                            cursor-pointer transition-colors group shadow-sm hover:shadow-md hover:border-brand-accent-3/30
                            hover:bg-brand-neutral-dark/90 ${
                              isRecent
                                ? "border-brand-accent-1/20 bg-brand-accent-1/5"
                                : "border-brand-depth/50"
                            }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className="font-medium text-brand-neutral-light group-hover:text-brand-accent-3 
                                    transition-colors flex items-center gap-2 truncate"
                    >
                      {exercise.name}
                    </span>
                    <span className="text-xs font-bold text-brand-neutral-dark/80 bg-brand-depth px-2 py-1 rounded-full uppercase tracking-wide">
                      {exercise.muscle_group}
                    </span>
                  </div>
                </motion.div>
              ))}

              {!loading && !isRecent && hits.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-brand-neutral-light/40">
                  <SearchIcon className="text-4xl mb-2 opacity-20" />
                  <p className="text-sm">Brak wyników</p>
                </div>
              )}

              {!loading && isRecent && hits.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-brand-neutral-light/30">
                  <SearchIcon className="text-5xl mb-3 opacity-20" />
                  <p className="text-sm">Wpisz nazwę aby wyszukać</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <AddExerciseToList
            exercise={selectedExercise}
            onCancel={() => setSelectedExercise(null)}
            onAdd={handleCreateExercise}
            submitButtonText={submitButtonText}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
