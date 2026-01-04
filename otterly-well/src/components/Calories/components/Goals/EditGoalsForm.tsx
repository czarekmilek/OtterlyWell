import { motion } from "framer-motion";
import { CheckIcon } from "../../../icons";

interface EditGoalsFormProps {
  isLoading: boolean;
  goalCalories: number;
  goalProtein: number;
  goalFat: number;
  goalCarbs: number;
  setGoalCalories: (value: number) => void;
  setGoalProtein: (value: number) => void;
  setGoalFat: (value: number) => void;
  setGoalCarbs: (value: number) => void;
  onClose: () => void;
}

export function EditGoalsForm({
  isLoading,
  goalCalories,
  goalProtein,
  goalFat,
  goalCarbs,
  setGoalCalories,
  setGoalProtein,
  setGoalFat,
  setGoalCarbs,
  onClose,
}: EditGoalsFormProps) {
  // TODO: Tweak a little, might make a better layout if given mroe time
  return (
    <motion.div
      key="edit-form"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4 sm:gap-2"
    >
      <h3 className="text-lg font-semibold text-brand-neutral-light">
        Edytuj cele
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-brand-secondary">
            Cel kalorii (kcal)
          </span>
          <input
            type="number"
            min={1}
            disabled={isLoading}
            className="rounded-xl border border-brand-depth bg-brand-neutral-dark px-4 py-3 text-brand-neutral-light focus:ring-2 
                    focus:ring-brand-accent-1/40 focus:outline-none disabled:opacity-50"
            value={goalCalories}
            onChange={(e) => {
              const v = Number(e.target.value);
              setGoalCalories(v > 0 ? v : 0);
            }}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-brand-secondary">Białko (g)</span>
          <input
            type="number"
            min={0}
            disabled={isLoading}
            className="rounded-xl border border-brand-depth bg-brand-neutral-dark px-4 py-3 text-brand-neutral-light focus:ring-2 
                    focus:ring-brand-accent-1/40 focus:outline-none disabled:opacity-50"
            value={goalProtein}
            onChange={(e) => setGoalProtein(Number(e.target.value) || 0)}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-brand-secondary">Tłuszcz (g)</span>
          <input
            type="number"
            min={0}
            disabled={isLoading}
            className="rounded-xl border border-brand-depth bg-brand-neutral-dark px-4 py-3 text-brand-neutral-light focus:ring-2 
                    focus:ring-brand-accent-1/40 focus:outline-none disabled:opacity-50"
            value={goalFat}
            onChange={(e) => setGoalFat(Number(e.target.value) || 0)}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-brand-secondary">Węglowodany (g)</span>
          <input
            type="number"
            min={0}
            disabled={isLoading}
            className="rounded-xl border border-brand-depth bg-brand-neutral-dark px-4 py-3 text-brand-neutral-light focus:ring-2 
                    focus:ring-brand-accent-1/40 focus:outline-none disabled:opacity-50"
            value={goalCarbs}
            onChange={(e) => setGoalCarbs(Number(e.target.value) || 0)}
          />
        </label>
      </div>
      <div className="flex justify-end sm:mt-3">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-6 py-2 bg-brand-accent-1 text-white rounded-full hover:bg-brand-accent-1/90 transition-colors cursor-pointer"
        >
          <CheckIcon /> Gotowe
        </button>
      </div>
    </motion.div>
  );
}
