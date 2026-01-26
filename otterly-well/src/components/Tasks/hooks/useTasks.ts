import { useTaskData } from "./useTaskData";
import { useTaskMutations } from "./useTaskMutations";
import { useCategoryMutations } from "./useCategoryMutations";

export function useTasks() {
  const { tasks, setTasks, categories, setCategories, isLoading, user } =
    useTaskData();

  const {
    addTask,
    toggleTaskCompletion,
    deleteTask,
    dismissTask,
    restoreTask,
    editTask,
  } = useTaskMutations({ user, tasks, setTasks });

  const {
    toggleCategory,
    addCategory,
    deleteCategory: deleteCategoryMut,
    reorderCategories,
    editCategory,
  } = useCategoryMutations({
    user,
    categories,
    setCategories,
  });

  const deleteCategory = async (categoryId: string) => {
    setTasks((prev) => prev.filter((t) => t.category_id !== categoryId));
    await deleteCategoryMut(categoryId);
  };

  return {
    tasks,
    categories,
    isLoading,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    toggleCategory,
    addCategory,
    deleteCategory,
    dismissTask,
    restoreTask,
    editTask,
    reorderCategories,
    editCategory,
  };
}
