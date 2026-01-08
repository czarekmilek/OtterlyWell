import { useMemo, useState } from "react";
import { useTasks } from "../../Tasks/hooks/useTasks";
import TaskColumn from "../../Tasks/components/TaskBoard/components/TaskColumn";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, TaskIcon } from "../../icons";

export default function TasksWidget() {
  const { tasks, categories, toggleTaskCompletion, deleteTask, dismissTask } =
    useTasks();

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const activeCategories = useMemo(
    () => categories.filter((c) => c.is_active),
    [categories]
  );

  const currentCategory = activeCategories[currentCategoryIndex];

  const handleNext = () => {
    setCurrentCategoryIndex((prev) => (prev + 1) % activeCategories.length);
  };

  const handlePrev = () => {
    setCurrentCategoryIndex(
      (prev) => (prev - 1 + activeCategories.length) % activeCategories.length
    );
  };

  const tasksForCategory = useMemo(() => {
    if (!currentCategory) return [];
    return tasks.filter((t) => t.category_id === currentCategory.id);
  }, [tasks, currentCategory]);

  if (activeCategories.length === 0) {
    return (
      <div className="flex flex-col h-full bg-brand-neutral-dark/40 border border-brand-depth rounded-2xl p-4">
        <p className="text-brand-secondary">Brak kategorii zadań.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-brand-neutral-dark/40 border border-brand-depth rounded-2xl p-4 overflow-hidden relative group">
      <div className="flex items-center justify-between mb-2">
        <Link to="/tasks">
          <h2
            className="text-lg font-bold text-brand-neutral-light flex items-center gap-2 hover:scale-105 
                        hover:text-brand-accent-1 transition-all duration-200 cursor-pointer"
          >
            <TaskIcon />
            Zadania
          </h2>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-brand-neutral-dark/50 rounded-lg p-0.5 border border-brand-depth">
            <button
              onClick={handlePrev}
              className="flex items-center p-1 hover:text-brand-accent-1 transition-colors cursor-pointer"
            >
              <ChevronLeftIcon />
            </button>
            <button
              onClick={handleNext}
              className="flex items-center p-1 hover:text-brand-accent-1 transition-colors cursor-pointer"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>
      <Link to="/tasks">
        <div
          className="flex-1 overflow-hidden rounded-2xl
        cursor-pointer hover:bg-brand-neutral-dark/30 hover:scale-102 hover:shadow-lg transition-all duration-200"
        >
          {currentCategory && (
            <div className="h-full w-full pointer-events-none">
              <TaskColumn
                category={currentCategory}
                tasks={tasksForCategory}
                onComplete={() => {}}
                onDismiss={() => {}}
                onDelete={() => {}}
                currentDate={new Date()} // Not strictly used for filtering in widget but passed as prop just in case
              />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
