import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTasks } from "./hooks/useTasks";
import { TaskBoard } from "./components/TaskBoard/TaskBoard";
import { AddTaskModal } from "./components/AddTaskModal";
import TaskCategoryManager from "./components/TaskCategoryManager/TaskCategoryManager";
import HistoricalTaskModal from "./components/HistoricalTasksList/HistoricalTaskModal";
import { type ViewMode, ViewModeSwitcher } from "./components/ViewModeSwitcher";

export default function Tasks() {
  const {
    tasks,
    categories,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    toggleCategory,
    addCategory,
    dismissTask,
    deleteCategory,
    restoreTask,
    editTask,
    reorderCategories,
  } = useTasks();

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isHistoricalModalOpen, setIsHistoricalModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("all");

  // OLD LOGIC: filtering based on date -
  //            if task is uncompleted, it is always relevant
  //            if task is completed, it is relevant if it was completed on the selected date (ONLY!)
  // NEW LOGIC: completed tasks stay on the board until dismissed
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (t.is_dismissed) return false;

      // const isUncompleted = !t.is_completed;

      // let isRelevantDate = false;
      // if (isUncompleted) {
      //   isRelevantDate = true;
      // } else {
      //   if (t.completed_at) {
      //     isRelevantDate = isSameDay(new Date(t.completed_at), selectedDate);
      //   }
      // }

      // if (!isRelevantDate) return false;

      if (viewMode === "active") return !t.is_completed;
      if (viewMode === "completed") return t.is_completed;
      return true;
    });
  }, [tasks, viewMode]);

  const activeCategories = useMemo(
    () => categories.filter((c) => c.is_active),
    [categories],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.42 }}
      className="py-6 lg:p-8 mx-auto space-y-3 xl:h-[calc(100vh)] flex flex-col"
    >
      <div className="flex flex-col xl:flex-row items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 w-auto xl:w-full">
          {/* we don't use day selector anymore, tasks are maintained by user based on his widzimisie */}
          {/* <DaySelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          /> */}
          <ViewModeSwitcher currentMode={viewMode} onModeChange={setViewMode} />
        </div>

        {/* TOOD: extract these buttons to adjacent reusable buttons */}
        <div className="flex flex-col md:flex-row w-full xl:w-auto items-center gap-3">
          <div className="flex gap-2 w-full xl:w-auto justify-center overflow-x-auto text-sm">
            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="flex items-center bg-brand-accent-1/80 text-brand-neutral-light/70 px-2 sm:px-3 py-2 rounded-xl
                      hover:bg-brand-accent-1 hover:text-brand-neutral-light transition-colors cursor-pointer"
            >
              <span className="material-symbols-sharp">add</span>
              <span className="font-semibold text-center ml-2">Dodaj</span>
            </button>

            <button
              onClick={() => setIsCategoryManagerOpen(true)}
              className="flex items-center bg-brand-accent-2/80 text-brand-neutral-light/70 px-2 sm:px-3 py-2 rounded-xl
                      hover:bg-brand-accent-2 hover:text-brand-neutral-light transition-colors  cursor-pointer"
            >
              <span className="material-symbols-sharp">filter_list</span>
              <span className="font-semibold text-center ml-2">Filtruj</span>
            </button>
            <button
              onClick={() => setIsHistoricalModalOpen(true)}
              className="flex items-center bg-brand-accent-3/80 text-brand-neutral-light/70 px-2 sm:px-3 py-2 rounded-xl
                      hover:bg-brand-accent-3 hover:text-brand-neutral-light transition-colors cursor-pointer"
            >
              <span className="material-symbols-sharp">history</span>
              <span className="font-semibold text-center ml-2">Historia</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <TaskBoard
          tasks={filteredTasks}
          categories={activeCategories}
          onComplete={toggleTaskCompletion}
          currentDate={new Date()}
          onDismiss={dismissTask}
          onEdit={editTask}
        />
      </div>

      <AddTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onSubmit={addTask}
        categories={activeCategories}
      />

      <TaskCategoryManager
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        onToggleCategory={toggleCategory}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        onReorder={reorderCategories}
      />

      <HistoricalTaskModal
        isOpen={isHistoricalModalOpen}
        onClose={() => setIsHistoricalModalOpen(false)}
        categories={categories}
        tasks={tasks}
        onRestore={restoreTask}
        onDelete={deleteTask}
      />
    </motion.div>
  );
}
