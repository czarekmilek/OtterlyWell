import { useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useCaloriesData } from "../../Calories/hooks/useCaloriesData";

import { Link } from "react-router-dom";
import { CalorieIcon } from "../../icons";
import { CaloriesWidgetSimplified } from "./CaloriesWidgetSimplified";

export default function CaloriesWidget() {
  const { user } = useAuth();
  // always showing today's stats on dashboard, not allowing showing previous days here
  // previous/next days accessible via the module, upon clicking show more button
  const today = useMemo(() => new Date(), []);

  const { goals, totalCalories } = useCaloriesData(user, today);

  return (
    <Link to="/calories">
      <div
        className="flex flex-col bg-brand-neutral-dark/40 border border-brand-depth rounded-2xl p-4
                      overflow-hidden relative group cursor-pointer hover:bg-brand-neutral-dark/50 hover:scale-102
                      hover:shadow-lg transition-all duration-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brand-neutral-light flex items-center gap-2">
            <CalorieIcon />
            Kalorie
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="origin-center w-full">
            <CaloriesWidgetSimplified
              goalCalories={goals.calories}
              totalCalories={totalCalories}
              goalProtein={goals.protein}
              goalFat={goals.fat}
              goalCarbs={goals.carbs}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
