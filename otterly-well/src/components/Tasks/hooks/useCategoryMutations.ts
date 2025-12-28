import { useCallback } from "react";
import { supabase } from "../../../lib/supabaseClient";
import type { TaskCategory } from "../types/types";
import type { User } from "@supabase/supabase-js";

interface UseCategoryMutationsProps {
  user: User | null;
  categories: TaskCategory[];
  setCategories: React.Dispatch<React.SetStateAction<TaskCategory[]>>;
}

export function useCategoryMutations({
  user,
  categories,
  setCategories,
}: UseCategoryMutationsProps) {
  const toggleCategory = useCallback(
    async (categoryId: string) => {
      const category = categories.find((c) => c.id === categoryId);
      if (!category) return;

      const newIsActive = !category.is_active;

      // we update uptomistically to have better responisveness
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId ? { ...c, is_active: newIsActive } : c
        )
      );

      try {
        const { error } = await supabase
          .from("task_categories")
          .update({ is_active: newIsActive })
          .eq("id", categoryId);

        if (error) {
          setCategories((prev) =>
            prev.map((c) => (c.id === categoryId ? category : c))
          );
          throw error;
        }
      } catch (error) {
        console.error("Error toggling category:", error);
      }
    },
    [categories, setCategories]
  );

  const addCategory = useCallback(
    async (name: string) => {
      if (!user) return;

      const newCategory = {
        name,
        is_active: true,
        user_id: user.id,
      };

      try {
        const { data, error } = await supabase
          .from("task_categories")
          .insert(newCategory)
          .select()
          .single();

        if (error) throw error;
        setCategories((prev) => [...prev, data]);
      } catch (error) {
        console.error("Error adding category:", error);
      }
    },
    [user, setCategories]
  );

  const deleteCategory = useCallback(
    async (categoryId: string) => {
      const category = categories.find((c) => c.id === categoryId);
      if (!category) return;

      setCategories((prev) => prev.filter((c) => c.id !== categoryId));

      try {
        // deleting category means deleting tasks too, we do that before deleting the category
        const { error: tasksError } = await supabase
          .from("tasks")
          .delete()
          .eq("category_id", categoryId);

        if (tasksError) {
          console.error("Error deleting category tasks:", tasksError);
          setCategories((prev) => [...prev, category]);
          return;
        }

        const { error } = await supabase
          .from("task_categories")
          .delete()
          .eq("id", categoryId);

        if (error) {
          setCategories((prev) => [...prev, category]);
          throw error;
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    },
    [categories, setCategories]
  );

  return {
    toggleCategory,
    addCategory,
    deleteCategory,
  };
}
