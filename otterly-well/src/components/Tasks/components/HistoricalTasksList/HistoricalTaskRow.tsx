import { motion } from "framer-motion";
import type { Task, TaskCategory } from "../../types/types";

interface HistoricalTaskRowProps {
  task: Task;
  category?: TaskCategory;
  onClick: () => void;
  isExpanded: boolean;
}

export function HistoricalTaskRow({
  task,
  category,
  onClick,
  isExpanded,
}: HistoricalTaskRowProps) {
  return (
    <motion.div
      layout
      onClick={onClick}
      className={`relative overflow-hidden p-3 bg-brand-neutral-dark/30 rounded-xl border border-brand-depth/50 cursor-pointer 
              hover:bg-brand-neutral-dark/50 transition-colors
                  ${
                    isExpanded
                      ? "border-brand-primary/30 bg-brand-neutral-dark/50"
                      : ""
                  }`}
    >
      {/* Added layout position because scale caused stretching for some reason */}
      <motion.div
        layout="position"
        className="flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-medium text-brand-neutral-light truncate">
              {task.description}
            </span>
            <div className="flex items-center gap-2 text-xs text-brand-neutral-light/50">
              <span>{category?.name || "Brak kategorii"}</span>
              <span>•</span>
              <span>
                {task.completed_at
                  ? new Date(task.completed_at).toLocaleDateString()
                  : "---"}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-xs text-brand-neutral-light/40 flex flex-col items-end">
            <span>Termin:</span>
            <span>
              {task.deadline
                ? new Date(task.deadline).toLocaleDateString()
                : "Brak"}
            </span>
          </div>
        </div>
      </motion.div>

      {isExpanded && (
        <motion.div
          layout="position"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3, opacity: { delay: 0.2 } }}
          className="mt-3 pt-3 border-t border-brand-neutral-light/10"
        >
          <p className="text-sm text-brand-neutral-light/80 ">
            {task.description}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
