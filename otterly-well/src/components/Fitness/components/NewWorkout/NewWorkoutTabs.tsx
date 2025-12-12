import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ExerciseSearch from "./ExerciseSearch";
import CustomExercise from "./CustomExercise";
import type { Exercise } from "../../types/types";

interface NewWorkoutTabsProps {
  onAddExercise: (
    exercise: Exercise,
    sets: number,
    reps: number,
    weight: number
  ) => void;
}

export default function NewWorkoutTabs({ onAddExercise }: NewWorkoutTabsProps) {
  const [activeTab, setActiveTab] = useState<"search" | "custom">("search");

  const getTabClassName = (tabName: typeof activeTab) =>
    `flex-1 text-center px-2 sm:px-4 py-2 rounded-t-md transition-colors relative -mb-px ${
      activeTab === tabName
        ? "bg-brand-neutral-dark/50 text-brand-neutral-light border-x border-t border-brand-depth border-b-transparent"
        : "text-brand-neutral-dark hover:bg-brand-accent-3 border-b border-brand-depth cursor-pointer"
    }`;

  return (
    <div className="rounded-xl border border-brand-depth bg-brand-neutral-dark/50 p-4 flex-1 flex flex-col min-h-0">
      <div className="flex border-b border-brand-depth">
        <button
          onClick={() => setActiveTab("search")}
          className={getTabClassName("search")}
        >
          Wyszukaj
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={getTabClassName("custom")}
        >
          Dodaj własne
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "search" ? (
          <ExerciseSearch key="search" onAddExercise={onAddExercise} />
        ) : (
          <CustomExercise
            key="custom"
            onExerciseCreated={() => setActiveTab("search")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
