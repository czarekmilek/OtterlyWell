import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ExerciseSearch from "./ExerciseSearch";
import SetSearch from "./SetSearch";
import SetModal from "./SetModal";
import CreateExerciseModal from "./CreateExerciseModal";
import type { Exercise, ExerciseSet } from "../../types/types";
import type { ExerciseInputData } from "./AddExerciseToList";

interface NewWorkoutTabsProps {
  onAddExercise: (exercise: Exercise, data: ExerciseInputData) => void;
}

export default function NewWorkoutTabs({ onAddExercise }: NewWorkoutTabsProps) {
  const [activeCategory, setActiveCategory] = useState<"exercises" | "sets">(
    "exercises"
  );
  const [isCreateSetModalOpen, setIsCreateSetModalOpen] = useState(false);
  const [isCreateExerciseModalOpen, setIsCreateExerciseModalOpen] =
    useState(false);

  const getTabClassName = (isActive: boolean) =>
    `flex-1 text-center px-2 sm:px-4 py-2 rounded-t-md transition-colors relative -mb-px ${
      isActive
        ? "bg-brand-neutral-dark/50 text-brand-neutral-light border-x border-t border-brand-depth border-b-transparent font-bold"
        : "text-brand-neutral-dark hover:bg-brand-accent-3 border-b border-brand-depth cursor-pointer"
    }`;

  const handleAddSet = (set: ExerciseSet) => {
    set.items?.forEach((item) => {
      if (item.exercise) {
        onAddExercise(item.exercise, {
          sets: item.sets,
          reps: item.reps,
          weight: item.weight_kg || 0,
          duration: item.duration_min || 0,
          distance: item.distance_km || 0,
        });
      }
    });
  };

  return (
    <>
      <div className="rounded-xl border border-brand-depth bg-brand-neutral-dark/50 p-4 flex-1 flex flex-col min-h-0">
        <div className="flex border-b border-brand-depth">
          <button
            onClick={() => setActiveCategory("exercises")}
            className={getTabClassName(activeCategory === "exercises")}
          >
            Ćwiczenia
          </button>
          <button
            onClick={() => setActiveCategory("sets")}
            className={getTabClassName(activeCategory === "sets")}
          >
            Zestawy
          </button>
        </div>

        {activeCategory === "exercises" ? (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <ExerciseSearch
                  key="search"
                  onAddExercise={onAddExercise}
                  onCreateExercise={() => setIsCreateExerciseModalOpen(true)}
                />
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden relative">
            <SetSearch
              onCreateSet={() => setIsCreateSetModalOpen(true)}
              onAddSet={handleAddSet}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isCreateSetModalOpen && (
          <SetModal
            onClose={() => setIsCreateSetModalOpen(false)}
            onSuccess={() => setIsCreateSetModalOpen(false)}
          />
        )}
        {isCreateExerciseModalOpen && (
          <CreateExerciseModal
            onClose={() => setIsCreateExerciseModalOpen(false)}
            onCreated={() => setIsCreateExerciseModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
