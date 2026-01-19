import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRightIcon, EditIcon, TrashIcon } from "../../../icons";
import type { Exercise } from "../../types/types";
import { useAuth } from "../../../../context/AuthContext";

export interface ExerciseInputData {
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  distance: number;
}

interface AddExerciseToListProps {
  exercise: Exercise;
  onCancel: () => void;
  onAdd: (data: ExerciseInputData) => void;
  submitButtonText?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function AddExerciseToList({
  exercise,
  onCancel,
  onAdd,
  submitButtonText = "Dodaj ćwiczenie",
  onEdit,
  onDelete,
}: AddExerciseToListProps) {
  const { user } = useAuth();
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);

  const handleSubmit = () => {
    onAdd({
      sets: exercise.type === "strength" || !exercise.type ? sets : 1,
      reps: exercise.type === "strength" || !exercise.type ? reps : 1,
      weight: exercise.type === "strength" || !exercise.type ? weight : 0,
      duration:
        exercise.type === "cardio" || exercise.type === "stretching"
          ? duration
          : 0,
      distance: exercise.type === "cardio" ? distance : 0,
    });
  };

  // TODO: use this type of styling more often
  const glassmorphicClass =
    "flex flex-col p-3 rounded-lg bg-brand-neutral-dark/40 backdrop-blur-md border border-brand-depth/50 shadow-inner";

  const renderInputs = () => {
    switch (exercise.type) {
      case "cardio":
        return (
          <>
            <div className={glassmorphicClass}>
              <label className="text-xs font-bold text-brand-neutral-light/70 uppercase text-center mb-1">
                Czas (min)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-transparent text-center text-xl font-bold text-brand-accent-1 focus:outline-none"
                placeholder="0"
              />
            </div>
            <div className={glassmorphicClass}>
              <label className="text-xs font-bold text-brand-neutral-light/70 uppercase text-center mb-1">
                Dystans (km)
              </label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full bg-transparent text-center text-xl font-bold text-brand-accent-1 focus:outline-none"
                placeholder="0"
              />
            </div>
          </>
        );
      case "stretching":
        return (
          <div className={`${glassmorphicClass} col-span-full`}>
            <label className="text-xs font-bold text-brand-neutral-light/70 uppercase text-center mb-1">
              Czas (min)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full bg-transparent text-center text-xl font-bold text-brand-accent-1 focus:outline-none"
              placeholder="0"
            />
          </div>
        );
      case "strength":
      default:
        return (
          <>
            <div className={glassmorphicClass}>
              <label className="text-xs font-bold text-brand-neutral-light/70 uppercase text-center mb-1">
                Serie
              </label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
                className="w-full bg-transparent text-center text-xl font-bold text-brand-accent-1 focus:outline-none"
              />
            </div>
            <div className={glassmorphicClass}>
              <label className="text-xs font-bold text-brand-neutral-light/70 uppercase text-center mb-1">
                Powtórzenia
              </label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="w-full bg-transparent text-center text-xl font-bold text-brand-accent-1 focus:outline-none"
              />
            </div>
            <div className={glassmorphicClass}>
              <label className="text-xs font-bold text-brand-neutral-light/70 uppercase text-center mb-1">
                Ciężar (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full bg-transparent text-center text-xl font-bold text-brand-accent-1 focus:outline-none"
              />
            </div>
          </>
        );
    }
  };

  return (
    <motion.div
      key="details"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full p-4"
    >
      <div className="flex items-start justify-between border-b border-brand-depth pb-4 mb-4">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="flex items-center justify-center p-2 hover:bg-brand-neutral-light/30 rounded-full transition-colors
                            text-brand-neutral-light/60 hover:text-brand-neutral-light cursor-pointer"
            >
              <ArrowRightIcon className="scale-95 rotate-180" />
            </button>
            <h3 className="text-lg sm:text-xl font-bold text-brand-neutral-light">
              {exercise.name}
            </h3>
          </div>
          <p className="text-xs text-brand-neutral-light/60 uppercase tracking-wider mt-1">
            {exercise.type === "cardio"
              ? "Cardio"
              : exercise.type === "stretching"
                ? "Rozciąganie"
                : "Siłowe"}
          </p>
          {exercise.description && (
            <p className="text-sm text-brand-neutral-light/70 mt-2 tracking-wide leading-relaxed">
              {exercise.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onEdit && user && exercise.created_by === user.id && (
            <button
              onClick={onEdit}
              className="flex items-center justify-center p-2 hover:bg-brand-accent-2/50 rounded-full transition-colors 
                        text-brand-neutral-light/60 hover:text-brand-neutral-light cursor-pointer"
              title="Edytuj ćwiczenie"
            >
              <EditIcon className="scale-95" />
            </button>
          )}
          {onDelete && user && exercise.created_by === user.id && (
            <button
              onClick={onDelete}
              className="flex items-center justify-center p-2 hover:bg-red-500/20 rounded-full transition-colors 
                        text-brand-neutral-light/60 hover:text-red-400 cursor-pointer"
              title="Usuń ćwiczenie"
            >
              <TrashIcon className="scale-95" />
            </button>
          )}
        </div>
      </div>

      <div
        className={`flex flex-col gap-3 mb-6 md:grid ${
          exercise.type === "strength" || !exercise.type
            ? "md:grid-cols-3"
            : exercise.type === "cardio"
              ? "md:grid-cols-2"
              : "md:grid-cols-1"
        }`}
      >
        {renderInputs()}
      </div>

      <motion.button
        onClick={handleSubmit}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-auto w-full py-4 bg-brand-accent-1 hover:bg-brand-accent-2 cursor-pointer text-white font-bold rounded-xl 
                   shadow-lg hover:shadow-brand-accent-1/20 transition-all flex items-center justify-center gap-2 text-lg"
      >
        {submitButtonText}
      </motion.button>
    </motion.div>
  );
}
