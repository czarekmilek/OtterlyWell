import { useState, useCallback, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import type { FinanceCategory } from "../types/types";

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!user) return;
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const { data: catData, error: catError } = await supabase
        .from("finance_categories")
        .select("*")
        .order("name");

      if (catError) throw catError;

      let fetchedCategories = catData;
      setCategories(fetchedCategories);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setCategoriesError(err.message);
    } finally {
      setCategoriesLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (
    category: Omit<FinanceCategory, "id" | "user_id" | "created_at">
  ) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("finance_categories")
      .insert({ ...category, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error("Error adding category:", error);
      throw error;
    }
    setCategories((prev) => [...prev, data]);
    return data;
  };

  const toggleCategory = async (name: string, type: "income" | "expense") => {
    if (!user) return;

    const existingCategory = categories.find(
      (c) => c.name === name && c.type === type
    );

    if (existingCategory) {
      const newStatus = !existingCategory.is_active;
      const { data, error } = await supabase
        .from("finance_categories")
        .update({ is_active: newStatus })
        .eq("id", existingCategory.id)
        .select()
        .single();

      if (error) {
        console.error("Error toggling category:", error);
        throw error;
      }

      setCategories((prev) =>
        prev.map((c) => (c.id === existingCategory.id ? data : c))
      );
    } else {
      const newCategory = {
        name,
        type,
        is_active: true,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from("finance_categories")
        .insert(newCategory)
        .select()
        .single();

      if (error) {
        console.error("Error creating category:", error);
        throw error;
      }

      setCategories((prev) => [...prev, data]);
    }
  };

  return {
    categories,
    categoriesLoading,
    categoriesError,
    fetchCategories,
    addCategory,
    toggleCategory,
  };
}
