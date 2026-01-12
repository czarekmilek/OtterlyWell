import type { Task, TaskCategory } from "../../types/types";
import TaskColumn from "./components/TaskColumn";

interface TaskBoardProps {
  tasks: Task[];
  categories: TaskCategory[];
  onComplete: (taskId: string) => void;
  onDismiss: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, updates: Partial<Task>) => void;
  currentDate: Date;
}

export function TaskBoard({
  tasks,
  categories,
  onComplete,
  currentDate,
  onDismiss,
  onDelete,
  onEdit,
}: TaskBoardProps) {
  const getGridClass = () => {
    const count = categories.length;
    const base = "grid gap-4 auto-rows-fr grid-cols-1 sm:grid-cols-2";

    // More modular design for desktops - fills the space more nicely tham plain grid-cols-3
    // TODO: dynamize even more
    if (count === 1) return `${base} xl:grid-cols-3 xl:h-full`;
    if (count === 2) return `${base} xl:grid-cols-2 xl:h-full`;
    if (count === 3) return `${base} xl:grid-cols-3 xl:h-full`;
    if (count >= 7) return `${base} xl:grid-cols-3 2xl:grid-cols-4`;
    return `${base} xl:grid-cols-3 2xl:grid-cols-4 xl:h-full`; // 4, 5, 6 - improve for this later, we can make a 2-1-1-2 or reversed
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className={getGridClass()}>
        {categories.map((category) => {
          const categoryTasks = tasks.filter(
            (t) => t.category_id === category.id
          );

          const wrapperClass =
            categories.length === 1 ? "h-full xl:col-span-2" : "h-full";

          return (
            <div key={category.id} className={wrapperClass}>
              <TaskColumn
                category={category}
                tasks={categoryTasks}
                allCategories={categories}
                onComplete={onComplete}
                onDismiss={onDismiss}
                onDelete={onDelete}
                onEdit={onEdit}
                currentDate={currentDate}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
