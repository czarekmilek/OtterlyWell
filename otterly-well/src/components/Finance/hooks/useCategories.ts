import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import type { FinanceCategory } from "../types/types";

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const seedingRef = useRef(false);

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

      if (catData && catData.length > 0) {
        const uniqueKeys = new Set();
        const duplicates: FinanceCategory[] = [];
        const uniqueCategories: FinanceCategory[] = [];

        for (const cat of catData) {
          const key = `${cat.name}-${cat.type}`;
          if (uniqueKeys.has(key)) {
            duplicates.push(cat);
          } else {
            uniqueKeys.add(key);
            uniqueCategories.push(cat);
          }
        }

        if (duplicates.length > 0) {
          console.log("Found duplicates, cleaning up...", duplicates);
          // deleting duplicates from DB if found
          const { error: deleteError } = await supabase
            .from("finance_categories")
            .delete()
            .in(
              "id",
              duplicates.map((d) => d.id)
            );

          if (deleteError)
            console.error("Error deleting duplicates:", deleteError);

          setCategories(uniqueCategories);
          return;
        }
      }

      if ((!catData || catData.length === 0) && !seedingRef.current) {
        seedingRef.current = true;
        // if user is new he has now catData, then we create default ones for him
        const defaultIncome = [
          "Wynagrodzenia",
          "Inwestycje",
          "Prezenty",
          "Inne",
        ];
        const defaultExpense = [
          "Codzienne",
          "Inne",
          "Oszczędności",
          "Transport",
          "Jedzenie",
          "Płatności",
          "Samorozwój",
          "Zdrowie",
          "Rozrywka",
          "Dom",
        ];

        const payload = [
          ...defaultIncome.map((name) => ({
            name,
            type: "income",
            user_id: user.id,
            is_active: true,
          })),
          ...defaultExpense.map((name) => ({
            name,
            type: "expense",
            user_id: user.id,
            is_active: true,
          })),
        ];

        const { data: insertedData, error: insertError } = await supabase
          .from("finance_categories")
          .insert(payload)
          .select();

        seedingRef.current = false;

        if (insertError) throw insertError;
        setCategories(insertedData as FinanceCategory[]);
      } else {
        setCategories(catData || []);
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setCategoriesError(err.message);
      seedingRef.current = false;
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
