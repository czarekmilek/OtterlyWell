import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { EditIcon, CloseIcon } from "../../../icons";
import { EditGoalsForm } from "./components/EditGoalsForm";
import { GoalsStats } from "./components/GoalsStats";

interface GoalsProps {
  goalCalories: number;
  totalCalories: {
    kcal: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  goalProtein: number;
  goalFat: number;
  goalCarbs: number;
  setGoalCalories: (value: number) => void;
  setGoalProtein: (value: number) => void;
  setGoalFat: (value: number) => void;
  setGoalCarbs: (value: number) => void;
  isLoading: boolean;
}

export const Goals = ({
  goalCalories,
  totalCalories,
  goalProtein,
  goalFat,
  goalCarbs,
  setGoalCalories,
  setGoalProtein,
  setGoalFat,
  setGoalCarbs,
  isLoading,
}: GoalsProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-brand-neutral-dark/40 border border-brand-depth rounded-2xl p-6 relative">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 rounded-full hover:bg-brand-neutral-dark/80 text-brand-secondary hover:text-brand-accent-1 transition-colors flex items-center justify-center cursor-pointer"
          title={isEditing ? "Zamknij edycję" : "Edytuj cele"}
          disabled={isLoading}
        >
          {isEditing ? <CloseIcon /> : <EditIcon />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <EditGoalsForm
            isLoading={isLoading}
            goalCalories={goalCalories}
            goalProtein={goalProtein}
            goalFat={goalFat}
            goalCarbs={goalCarbs}
            setGoalCalories={setGoalCalories}
            setGoalProtein={setGoalProtein}
            setGoalFat={setGoalFat}
            setGoalCarbs={setGoalCarbs}
            onClose={() => setIsEditing(false)}
          />
        ) : (
          <GoalsStats
            goalCalories={goalCalories}
            totalCalories={totalCalories}
            goalProtein={goalProtein}
            goalFat={goalFat}
            goalCarbs={goalCarbs}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
