import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ExerciseSearch from "./ExerciseSearch";
import SetSearch from "./SetSearch";
import SetModal from "./SetModal";
import CreateExerciseModal from "./CreateExerciseModal";
import type { Exercise, ExerciseSet } from "../../types/types";
import type { ExerciseInputData } from "./AddExerciseToList";
import TabButton from "../../../UI/TabButton";

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
      <div className="rounded-xl flex-1 flex flex-col min-h-0">
        <div className="flex border-b border-brand-depth gap-2">
          {/* using TabButton component for the same look as in Calories and Finacne */}
          <TabButton
            label="Ćwiczenia"
            value="exercises"
            isSelected={activeCategory === "exercises"}
            setSelectedTab={(val) => setActiveCategory(val as "exercises")}
          />
          <TabButton
            label="Zestawy"
            value="sets"
            isSelected={activeCategory === "sets"}
            setSelectedTab={(val) => setActiveCategory(val as "sets")}
          />
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
