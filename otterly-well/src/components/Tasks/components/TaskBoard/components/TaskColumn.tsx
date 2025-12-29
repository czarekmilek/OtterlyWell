import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Task, TaskCategory } from "../../../types/types";
import TaskItem from "./TaskItem";
import { CheckIcon } from "../../../../icons";

interface TaskColumnProps {
  category: TaskCategory;
  tasks: Task[];
  onComplete: (taskId: string) => void;
  onDismiss: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  currentDate: Date;
}

export default function TaskColumn({
  category,
  tasks,
  onComplete,
  onDismiss,
  onDelete,
  currentDate,
}: TaskColumnProps) {
  const sortedTasks = useMemo(() => {
    // by default by creation date, but completed tasks at the end
    return [...tasks].sort((a, b) => {
      if (a.is_completed !== b.is_completed) {
        return a.is_completed ? 1 : -1;
      }

      // second criteria priority
      if (b.priority !== a.priority) return b.priority - a.priority;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [tasks]);

  // const isCompleted = tasks.length === 0;
  const completedTasks = tasks.filter((t) => t.is_completed);
  const isCompleted =
    tasks.length > 0 && completedTasks.length === tasks.length;

  return (
    <div className="flex flex-col h-full bg-brand-neutral-dark/30 border border-brand-depth rounded-2xl overflow-hidden">
      <div
        className={`p-4 border-b border-brand-depth flex items-center justify-between
                      ${
                        isCompleted
                          ? "bg-brand-positive/10"
                          : "bg-brand-neutral-dark/40"
                      }`}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-6 bg-brand-positive rounded-full flex items-center justify-center text-brand-neutral-darker"
            >
              <CheckIcon className="scale-90" />
            </motion.div>
          )}
        </div>
        <h3 className="font-bold text-lg text-brand-neutral-light truncate">
          {category.name}
        </h3>

        <span className="text-xs text-brand-neutral-light/40 bg-brand-neutral-dark/50 px-2 py-1 rounded-lg">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px]">
        <AnimatePresence mode="popLayout">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={onComplete}
              onDismiss={onDismiss}
              onDelete={onDelete}
              currentDate={currentDate}
            />
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-brand-neutral-light/30 p-4 text-center">
            <p className="text-sm">Brak zadań</p>
          </div>
        )}
      </div>
    </div>
  );
}
