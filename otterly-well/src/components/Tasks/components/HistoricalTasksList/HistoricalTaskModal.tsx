import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon } from "../../../icons";
import type { Task, TaskCategory } from "../../types/types";
import { HistoricalTaskRow } from "./HistoricalTaskRow";

interface HistoricalTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  categories: TaskCategory[];
}

export default function HistoricalTaskModal({
  isOpen,
  onClose,
  tasks,
  categories,
}: HistoricalTaskModalProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const historicalTasks = useMemo(() => {
    return tasks
      .filter((t) => t.is_completed)
      .sort((a, b) => {
        const tA = a.completed_at ? new Date(a.completed_at).getTime() : 0;
        const tB = b.completed_at ? new Date(b.completed_at).getTime() : 0;
        return tB - tA;
      });
  }, [tasks]);

  const toggleExpand = (id: string) => {
    setExpandedTaskId((prev) => (prev === id ? null : id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-neutral-darker/70 backdrop-blur-xs z-55"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-55 pointer-events-none"
          >
            <div
              className="overflow-hidden flex flex-col w-full max-w-3xl max-h-[85vh] bg-brand-neutral-darker border border-brand-depth 
                          rounded-2xl shadow-2xl pointer-events-auto mx-4"
            >
              <div className="p-6 border-b border-brand-depth flex justify-between items-center bg-brand-neutral-dark/50">
                <h2 className="text-xl font-bold text-brand-neutral-light">
                  Historia zadań
                </h2>
                <button
                  onClick={onClose}
                  className="text-brand-secondary hover:text-brand-neutral-dark hover:bg-brand-neutral-light/70 rounded-full 
                  p-1 flex items-center justify-center cursor-pointer transition-all"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto md:p-6 p-4 space-y-4">
                {historicalTasks.length === 0 ? (
                  <div className="text-center text-brand-neutral-light/40 py-10">
                    Brak ukończonych zadań.
                  </div>
                ) : (
                  historicalTasks.map((task) => (
                    <HistoricalTaskRow
                      key={task.id}
                      task={task}
                      category={categories.find(
                        (c) => c.id === task.category_id
                      )}
                      isExpanded={expandedTaskId === task.id}
                      onClick={() => toggleExpand(task.id)}
                    />
                  ))
                )}
              </div>

              <div className="p-4 border-t border-brand-depth bg-brand-neutral-dark/30 text-center">
                <p className="text-xs text-brand-neutral-light/50">
                  Lista wszystkich ukończonych zadań. Kliknij, aby zobaczyć
                  szczegóły.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
