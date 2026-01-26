import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../../lib/supabaseClient";
import { useExerciseSearch } from "../../hooks/useExerciseSearch";
import type { ExerciseFilter } from "../../hooks/useExerciseSearch";
import { SearchIcon } from "../../../icons";
import AddExerciseToList from "./AddExerciseToList";
import type { ExerciseInputData } from "./AddExerciseToList";
import type { Exercise } from "../../types/types";

interface ExerciseSearchProps {
  onAddExercise: (exercise: Exercise, data: ExerciseInputData) => void;
  submitButtonText?: string;
  onCreateExercise?: () => void;
  onEditExercise?: (exercise: Exercise) => void;
  onDeleteExercise?: (exercise: Exercise) => void;
  refreshTrigger?: number;
  clearSelectionTrigger?: number;
}

export default function ExerciseSearch({
  onAddExercise,
  submitButtonText = "Dodaj ćwiczenie",
  onCreateExercise,
  onEditExercise,
  onDeleteExercise,
  refreshTrigger = 0,
  clearSelectionTrigger = 0,
}: ExerciseSearchProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ExerciseFilter>(null);
  const { loading, hits, error, isRecent } = useExerciseSearch(
    query,
    refreshTrigger,
    filter,
  );
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );

  const shouldSkipRefreshRef = useRef(false);

  useEffect(() => {
    if (clearSelectionTrigger > 0) {
      setSelectedExercise(null);
      shouldSkipRefreshRef.current = true;
    }
  }, [clearSelectionTrigger]);

  useEffect(() => {
    const refreshSelectedExercise = async () => {
      if (shouldSkipRefreshRef.current) {
        shouldSkipRefreshRef.current = false;
        return;
      }

      if (selectedExercise && refreshTrigger > 0) {
        const { data, error } = await supabase
          .from("exercises")
          .select("*")
          .eq("id", selectedExercise.id)
          .single();

        if (data && !error) {
          setSelectedExercise(data);
        } else {
          setSelectedExercise(null);
        }
      }
    };

    refreshSelectedExercise();
  }, [refreshTrigger]);

  const handleCreateExercise = (data: ExerciseInputData) => {
    if (selectedExercise) {
      onAddExercise(selectedExercise, data);
      setSelectedExercise(null);
      setQuery("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-brand-neutral-dark/50 rounded-b-xl overflow-hidden border border-brand-depth/50">
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
            <div className="flex flex-col border-b border-brand-depth bg-brand-neutral-dark relative">
              <div className="p-3 flex gap-2">
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

              <div className="px-3 pb-3 flex gap-2 overflow-x-auto custom-scrollbar">
                {[
                  { label: "Ostatnie", value: null },
                  { label: "Wszystkie", value: "all" as const },
                  { label: "Siłowe", value: "strength" as const },
                  { label: "Cardio", value: "cardio" as const },
                  { label: "Rozciąganie", value: "stretching" as const },
                ].map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setFilter(option.value as ExerciseFilter)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap
                      ${
                        filter === option.value
                          ? "bg-brand-accent-1 text-brand-neutral-darker shadow-sm"
                          : "cursor-pointer bg-brand-depth text-brand-neutral-dark hover:bg-brand-depth/80"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 relative">
              <AnimatePresence>
                {loading && (
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
                                    transition-colors truncate flex-1 min-w-0 mr-2"
                    >
                      {exercise.name}
                    </span>
                    {/* Edit button moved to details view */}
                    {(() => {
                      let label: string = exercise.type;
                      let className =
                        "text-brand-neutral-dark/80 bg-brand-depth";

                      // Displaying the msucle group only for strenght based exercises, rest just shows a type
                      if (exercise.type === "strength") {
                        const MUSCLE_GROUPS = [
                          { label: "Klatka", value: "chest" },
                          { label: "Plecy", value: "back" },
                          { label: "Nogi", value: "legs" },
                          { label: "Barki", value: "shoulders" },
                          { label: "Ramiona", value: "arms" },
                          { label: "Brzuch", value: "core" },
                          { label: "Cardio", value: "cardio" },
                        ];
                        label =
                          MUSCLE_GROUPS.find(
                            (g) => g.value === exercise.muscle_group,
                          )?.label || exercise.muscle_group;
                      } else if (exercise.type === "cardio") {
                        label = "Cardio";
                        className =
                          "bg-brand-accent-1 text-brand-neutral-darker";
                      } else if (exercise.type === "stretching") {
                        label = "Rozciąganie";
                        className =
                          "bg-brand-accent-2 text-brand-neutral-darker";
                      }

                      return (
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${className}`}
                        >
                          {label}
                        </span>
                      );
                    })()}
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
                  <SearchIcon className="text-5xl mb-3" />
                  <p className="text-sm">Wpisz nazwę aby wyszukać</p>
                  <button
                    onClick={onCreateExercise}
                    className="mt-2 text-brand-accent-1 hover:underline cursor-pointer text-sm"
                  >
                    lub stwórz nowe ćwiczenie
                  </button>
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
            onEdit={
              onEditExercise
                ? () => onEditExercise(selectedExercise)
                : undefined
            }
            onDelete={
              onDeleteExercise
                ? () => onDeleteExercise(selectedExercise)
                : undefined
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}
