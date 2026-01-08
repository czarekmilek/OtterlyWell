import { useMemo } from "react";
import { FitnessWidgetSimplified } from "./FitnessWidgetSimplified";
import { useFitnessDaily } from "../../Fitness/hooks/useFitnessDaily";
import { Link } from "react-router-dom";
import { WorkoutIcon } from "../../icons";

export default function FitnessWidget() {
  const today = useMemo(() => new Date(), []);

  const { entries } = useFitnessDaily(today);

  return (
    <Link to="/fitness">
      <div
        className="flex flex-col bg-brand-neutral-dark/40 border border-brand-depth rounded-2xl p-4 overflow-hidden relative group
                    cursor-pointer hover:bg-brand-neutral-dark/50 hover:scale-102 hover:shadow-lg transition-all duration-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brand-neutral-light flex items-center gap-2">
            <WorkoutIcon />
            Treningi
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="origin-center w-full">
            <FitnessWidgetSimplified entries={entries} selectedDate={today} />
          </div>
        </div>
      </div>
    </Link>
  );
}
