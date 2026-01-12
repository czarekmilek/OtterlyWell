import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExerciseSearch from "./ExerciseSearch";
import { useWorkoutSets } from "../../hooks/useWorkoutSets";
import type { Exercise, ExerciseSet } from "../../types/types";
import { CloseIcon, DeleteIcon } from "../../../icons";
import type { ExerciseInputData } from "./AddExerciseToList";

interface SetModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ExerciseSet;
}

interface NewSetItem {
  id: string;
  exercise: Exercise;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  distance: number;
}

export default function SetModal({
  onClose,
  onSuccess,
  initialData,
}: SetModalProps) {
  const { createSet, updateSet } = useWorkoutSets("");
  const [step, setStep] = useState<"details" | "add-exercise">("details");
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [items, setItems] = useState<NewSetItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData?.items) {
      setItems(
        initialData.items.map((item) => ({
          id: item.id || Math.random().toString(36).substr(2, 9),
          exercise: item.exercise!,
          sets: item.sets,
          reps: item.reps,
          weight: item.weight_kg || 0,
          duration: item.duration_min || 0,
          distance: item.distance_km || 0,
        }))
      );
    }
  }, [initialData]);

  const handleAddExercise = (exercise: Exercise, data: ExerciseInputData) => {
    const newItem: NewSetItem = {
      id: Math.random().toString(36).substr(2, 9),
      exercise,
      sets: data.sets,
      reps: data.reps,
      weight: data.weight,
      duration: data.duration,
      distance: data.distance,
    };
    setItems((prev) => [...prev, newItem]);
    setStep("details");
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Nazwa zestawu jest wymagana");
      return;
    }
    if (items.length === 0) {
      setError("Dodaj przynajmniej jedno ćwiczenie");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (initialData) {
        await updateSet(initialData.id, name, description, items);
      } else {
        await createSet(name, description, items);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to save set:", err);
      setError("Nie udało się zapisać zestawu: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-neutral-dark/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-brand-neutral-dark border border-brand-depth w-full max-w-lg h-[80vh] rounded-2xl 
                  shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-brand-depth bg-brand-neutral-dark/50">
          <h2 className="text-xl font-bold text-brand-neutral-light">
            {step === "details"
              ? initialData
                ? "Edytuj zestaw ćwiczeń"
                : "Stwórz nowy zestaw ćwiczeń"
              : "Dodaj ćwiczenie do zestawu"}
          </h2>
          <button
            onClick={step === "details" ? onClose : () => setStep("details")}
            className="p-1 cursor-pointer hover:bg-brand-depth rounded-full transition-colors hover:text-brand-neutral-dark 
                    text-brand-neutral-light flex items-center justify-center"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {step === "details" ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full p-4 overflow-y-auto custom-scrollbar"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-neutral-light/70 uppercase mb-1">
                      Nazwa zestawu
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="np. Rozgrzewka A"
                      className="w-full px-4 py-2 rounded-lg bg-brand-depth/30 border border-brand-depth/50 text-brand-neutral-light 
                                focus:outline-none focus:border-brand-accent-1 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-neutral-light/70 uppercase mb-1">
                      Opis (opcjonalnie)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Krótki opis zestawu..."
                      rows={2}
                      className="w-full px-4 py-2 rounded-lg bg-brand-depth/30 border border-brand-depth/50 text-brand-neutral-light 
                                focus:outline-none focus:border-brand-accent-1 resize-none transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-brand-neutral-light/70 uppercase">
                        Ćwiczenia ({items.length})
                      </label>
                      <button
                        onClick={() => setStep("add-exercise")}
                        className="text-xs font-bold text-brand-accent-1 hover:text-brand-accent-2 cursor-pointer transition-colors 
                                  uppercase tracking-wide"
                      >
                        + Dodaj ćwiczenie
                      </button>
                    </div>

                    <div className="space-y-2 min-h-[100px] bg-brand-depth/10 rounded-lg p-2 border border-brand-depth/30">
                      {items.length === 0 && (
                        <p className="text-center text-brand-neutral-light/30 text-sm py-8">
                          Brak ćwiczeń. Dodaj pierwsze ćwiczenie!
                        </p>
                      )}
                      {items.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center p-3 bg-brand-neutral-dark border border-brand-depth rounded-lg group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-brand-neutral-light/30 font-bold text-xs w-4">
                              {index + 1}.
                            </span>
                            <div>
                              <p className="text-sm font-medium text-brand-neutral-light">
                                {item.exercise.name}
                              </p>
                              <p className="text-xs text-brand-neutral-light/60">
                                {item.exercise.type === "cardio"
                                  ? `${item.duration} min | ${item.distance} km`
                                  : item.exercise.type === "stretching"
                                  ? `${item.duration} min`
                                  : `${item.sets} x ${item.reps} ${
                                      item.weight > 0
                                        ? `| ${item.weight}kg`
                                        : ""
                                    }`}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-brand-neutral-light/30 hover:text-red-400 transition-colors p-1 hover:bg-red-400/10 
                                      flex items-center justify-center rounded-full cursor-pointer"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm text-center bg-red-400/10 p-2 rounded">
                      {error}
                    </p>
                  )}
                </div>

                <div className="mt-auto pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-brand-accent-1 hover:bg-brand-accent-2 disabled:opacity-50 disabled:cursor-not-allowed
                             text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    {isSubmitting
                      ? "Zapisywanie..."
                      : initialData
                      ? "Zapisz zmiany"
                      : "Utwórz zestaw"}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="add-exercise"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full"
              >
                <ExerciseSearch
                  onAddExercise={handleAddExercise}
                  submitButtonText="Dodaj do zestawu"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
