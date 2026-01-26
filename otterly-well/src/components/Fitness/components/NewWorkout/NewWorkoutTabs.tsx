import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import ExerciseSearch from "./ExerciseSearch";
import SetSearch from "./SetSearch";
import SetModal from "./SetModal";
import CreateExerciseModal from "./CreateExerciseModal";
import type { Exercise, ExerciseSet } from "../../types/types";
import type { ExerciseInputData } from "./AddExerciseToList";
import TabButton from "../../../UI/TabButton";
import ConfirmDeleteDialog from "../../../UI/ConfirmDeleteDialog";

import { useExerciseMutations } from "../../hooks/useExerciseMutations";

interface NewWorkoutTabsProps {
  onAddExercise: (exercise: Exercise, data: ExerciseInputData) => void;
}

export default function NewWorkoutTabs({ onAddExercise }: NewWorkoutTabsProps) {
  const { deleteExercise } = useExerciseMutations();
  const [activeCategory, setActiveCategory] = useState<"exercises" | "sets">(
    "exercises",
  );
  const [isCreateSetModalOpen, setIsCreateSetModalOpen] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<Exercise | undefined>(
    undefined,
  );
  const [isCreateExerciseModalOpen, setIsCreateExerciseModalOpen] =
    useState(false);
  const [exercisesRefreshTrigger, setExercisesRefreshTrigger] = useState(0);
  const [setsRefreshTrigger, setSetsRefreshTrigger] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(
    null,
  );
  const [clearSelectionTrigger, setClearSelectionTrigger] = useState(0);

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

  const promptDeleteExercise = (exercise: Exercise) => {
    setExerciseToDelete(exercise);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!exerciseToDelete) return;

    try {
      await deleteExercise(exerciseToDelete.id);

      setExercisesRefreshTrigger((prev) => prev + 1);
      setClearSelectionTrigger((prev) => prev + 1);
    } catch (error: any) {
      alert("Wystąpił błąd: " + (error.message || error.toString()));
    } finally {
      setIsDeleteModalOpen(false);
      setExerciseToDelete(null);
    }
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
                  onCreateExercise={() => {
                    setExerciseToEdit(undefined);
                    setIsCreateExerciseModalOpen(true);
                  }}
                  onEditExercise={(exercise) => {
                    setExerciseToEdit(exercise);
                    setIsCreateExerciseModalOpen(true);
                  }}
                  onDeleteExercise={promptDeleteExercise}
                  refreshTrigger={exercisesRefreshTrigger}
                  clearSelectionTrigger={clearSelectionTrigger}
                />
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden relative">
            <SetSearch
              onCreateSet={() => setIsCreateSetModalOpen(true)}
              onAddSet={handleAddSet}
              refreshTrigger={setsRefreshTrigger}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isCreateSetModalOpen && (
          <SetModal
            onClose={() => setIsCreateSetModalOpen(false)}
            onSuccess={() => {
              setSetsRefreshTrigger((prev) => prev + 1);
              setIsCreateSetModalOpen(false);
            }}
          />
        )}
        {isCreateExerciseModalOpen && (
          <CreateExerciseModal
            onClose={() => {
              setIsCreateExerciseModalOpen(false);
              setExerciseToEdit(undefined);
            }}
            initialData={exerciseToEdit}
            onCreated={() => {
              setExercisesRefreshTrigger((prev) => prev + 1);
              setIsCreateExerciseModalOpen(false);
              setExerciseToEdit(undefined);
            }}
          />
        )}
      </AnimatePresence>

      <ConfirmDeleteDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Usuń ćwiczenie"
        description={
          <p>
            Czy na pewno chcesz usunąć ćwiczenie{" "}
            <strong className="text-brand-neutral-light">
              {exerciseToDelete?.name}
            </strong>
            ? <br />
            <span className="text-xs opacity-80 mt-2 block">
              Usunie to również wszystkie użycia tego ćwiczenia w historii
              treningów oraz zestawach. Tego działania nie można cofnąć.
            </span>
          </p>
        }
      />
    </>
  );
}
