import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSearch } from "../../hooks/useExerciseSearch";
import type { Exercise } from "../../types/types";

interface ExerciseSearchProps {
  onAddExercise: (
    exercise: Exercise,
    sets: number,
    reps: number,
    weight: number
  ) => void;
}

export default function ExerciseSearch({ onAddExercise }: ExerciseSearchProps) {
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
    }
  };

  return (
    <div className="flex flex-col h-full">
      {!selectedExercise ? (
        <>
          <input
            type="text"
            placeholder="Szukaj ćwiczenia..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 rounded-b-lg bg-brand-neutral-dark border border-brand-depth text-brand-neutral-light 
                      placeholder-brand-neutral-light/50 focus:outline-none focus:border-brand-accent-1 transition-colors"
          />

          <div className="flex-1 overflow-y-auto min-h-0 space-y-1 custom-scrollbar mt-2">
            {loading && (
              <p className="text-brand-neutral-light text-center py-4">
                Szukanie...
              </p>
            )}
            {error && (
              <p className="text-red-400 text-center py-4">Błąd: {error}</p>
            )}

            {hits.map((exercise) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedExercise(exercise)}
                className="p-3 rounded-lg bg-brand-neutral-dark border border-brand-depth 
                          hover:bg-brand-accent-3 cursor-pointer transition-colors group"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-brand-neutral-light group-hover:text-white transition-colors">
                    {exercise.name}
                  </span>
                  <span className="text-xs text-brand-neutral-light/70 bg-brand-depth px-2 py-1 rounded-full uppercase">
                    {exercise.muscle_group}
                  </span>
                </div>
              </motion.div>
            ))}

            {!loading && query && hits.length === 0 && (
              <p className="text-brand-neutral-light/50 text-center py-4">
                Brak wyników
              </p>
            )}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4 h-full"
        >
          <div className="flex items-center justify-between border-b border-brand-depth pb-2">
            <h3 className="text-xl font-bold text-brand-neutral-light mt-3">
              {selectedExercise.name}
            </h3>
            <button
              onClick={() => setSelectedExercise(null)}
              className="text-brand-neutral-light/70 hover:text-brand-neutral-light"
            >
              Anuluj
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-brand-neutral-light/70 uppercase">
                Serie
              </label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
                className="p-2 rounded-lg bg-brand-neutral-dark border border-brand-depth text-brand-neutral-light text-center"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-brand-neutral-light/70 uppercase">
                Powtórzenia
              </label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="p-2 rounded-lg bg-brand-neutral-dark border border-brand-depth text-brand-neutral-light text-center"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-brand-neutral-light/70 uppercase">
                Ciężar (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="p-2 rounded-lg bg-brand-neutral-dark border border-brand-depth text-brand-neutral-light text-center"
              />
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="mt-auto w-full py-3 bg-brand-accent-1 hover:bg-brand-accent-2 text-white font-bold rounded-lg transition-colors"
          >
            Dodaj trening
          </button>
        </motion.div>
      )}
    </div>
  );
}
