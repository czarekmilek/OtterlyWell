import { useCallback } from "react";
import { supabase } from "../../../lib/supabaseClient";
import type { Task } from "../types/types";
import type { User } from "@supabase/supabase-js";

interface UseTaskMutationsProps {
  user: User | null;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export function useTaskMutations({
  user,
  tasks,
  setTasks,
}: UseTaskMutationsProps) {
  const addTask = useCallback(
    async (taskData: Omit<Task, "id" | "created_at" | "is_completed">) => {
      if (!user) return;

      const newTask = {
        ...taskData,
        user_id: user.id,
        is_completed: false,
      };

      try {
        const { data, error } = await supabase
          .from("tasks")
          .insert(newTask)
          .select()
          .single();

        if (error) throw error;
        setTasks((prev) => [...prev, data]);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },
    [user, setTasks]
  );

  const toggleTaskCompletion = useCallback(
    async (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const newIsCompleted = !task.is_completed;
      const newCompletedAt = newIsCompleted ? new Date().toISOString() : null;

      // we update uptomistically to have better responsse, just as in CategoryMutations
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                is_completed: newIsCompleted,
                completed_at: newCompletedAt || undefined,
              }
            : t
        )
      );

      try {
        const { error } = await supabase
          .from("tasks")
          .update({
            is_completed: newIsCompleted,
            completed_at: newCompletedAt,
          })
          .eq("id", taskId);

        if (error) {
          setTasks((prev) => prev.map((t) => (t.id === taskId ? task : t)));
          throw error;
        }
      } catch (error) {
        console.error("Error toggling task completion:", error);
      }
    },
    [tasks, setTasks]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      const previousTasks = [...tasks];
      setTasks((prev) => prev.filter((t) => t.id !== taskId));

      try {
        const { error } = await supabase
          .from("tasks")
          .delete()
          .eq("id", taskId);

        if (error) {
          setTasks(previousTasks);
          throw error;
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },
    [tasks, setTasks]
  );

  const dismissTask = useCallback(
    async (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, is_dismissed: true } : t))
      );

      try {
        const { error } = await supabase
          .from("tasks")
          .update({ is_dismissed: true })
          .eq("id", taskId);

        if (error) {
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId ? { ...t, is_dismissed: false } : t
            )
          );
          throw error;
        }
      } catch (error) {
        console.error("Error dismissing task:", error);
      }
    },
    [tasks, setTasks]
  );

  const restoreTask = useCallback(
    async (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, is_dismissed: false } : t))
      );

      try {
        const { error } = await supabase
          .from("tasks")
          .update({ is_dismissed: false })
          .eq("id", taskId);

        if (error) {
          setTasks((prev) =>
            prev.map((t) =>
              t.id === taskId ? { ...t, is_dismissed: true } : t
            )
          );
          throw error;
        }
      } catch (error) {
        console.error("Error restoring task:", error);
      }
    },
    [tasks, setTasks]
  );

  return {
    addTask,
    toggleTaskCompletion,
    deleteTask,
    dismissTask,
    restoreTask,
  };
}
