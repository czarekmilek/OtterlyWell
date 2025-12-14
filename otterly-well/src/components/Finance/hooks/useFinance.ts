import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import type {
  FinanceCategory,
  FinanceTransaction,
  FinanceBudget,
} from "../types";

export function useFinance() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [budgets, setBudgets] = useState<FinanceBudget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data: catData, error: catError } = await supabase
        .from("finance_categories")
        .select("*")
        .order("name");

      if (catError) throw catError;

      let fetchedCategories = catData || [];

      if (fetchedCategories.length === 0) {
        const { data: inserted, error: insertError } = await supabase
          .from("finance_categories")
          .insert(
            [
              {
                name: "Wynagrodzenie",
                type: "income",
                color: "#10B981",
                icon: "payments",
              },
              {
                name: "Jedzenie",
                type: "expense",
                color: "#F59E0B",
                icon: "restaurant",
              },
              {
                name: "Rachunki",
                type: "expense",
                color: "#EF4444",
                icon: "receipt",
              },
              {
                name: "Rozrywka",
                type: "expense",
                color: "#8B5CF6",
                icon: "movie",
              },
              {
                name: "Transport",
                type: "expense",
                color: "#3B82F6",
                icon: "directions_car",
              },
              {
                name: "Zdrowie",
                type: "expense",
                color: "#EC4899",
                icon: "favorite",
              },
              {
                name: "Inne",
                type: "expense",
                color: "#6B7280",
                icon: "more_horiz",
              },
            ].map((c) => ({ ...c, user_id: user.id }))
          )
          .select();

        if (insertError) console.error("Error seeding categories", insertError);
        else fetchedCategories = inserted || [];
      }

      setCategories(fetchedCategories);

      // For now fetching all, optimizing later
      const { data: transData, error: transError } = await supabase
        .from("finance_transactions")
        .select("*")
        .order("date", { ascending: false });

      if (transError) throw transError;

      const enrichedTransactions = (transData || []).map((t) => ({
        ...t,
        finance_categories: fetchedCategories.find(
          (c) => c.id === t.category_id
        ),
      }));

      setTransactions(enrichedTransactions as FinanceTransaction[]);

      const { data: budgetData, error: budgetError } = await supabase
        .from("finance_budgets")
        .select("*");

      if (budgetError) throw budgetError;
      setBudgets(budgetData || []);
    } catch (err: any) {
      console.error("Error fetching finance data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const addTransaction = async (
    transaction: Omit<
      FinanceTransaction,
      "id" | "user_id" | "created_at" | "finance_categories"
    >
  ) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("finance_transactions")
      .insert({ ...transaction, user_id: user.id })
      .select("*")
      .single();

    if (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }

    const enrichedTransaction = {
      ...data,
      finance_categories: categories.find((c) => c.id === data.category_id),
    };

    setTransactions((prev) => [
      enrichedTransaction as FinanceTransaction,
      ...prev,
    ]);
    return enrichedTransaction as FinanceTransaction;
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from("finance_transactions")
      .delete()
      .eq("id", id);
    if (error) throw error;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const saveBudget = async (categoryId: string, amount: number) => {
    if (!user) return;
    const existing = budgets.find((b) => b.category_id === categoryId);

    const payload = {
      user_id: user.id,
      category_id: categoryId,
      amount,
      month: null, // Global for now, or add month selector later
      year: null,
    };

    const { data, error } = await supabase
      .from("finance_budgets")
      .upsert(existing ? { ...existing, amount } : payload)
      .select()
      .single();

    if (error) {
      console.error("Error saving budget", error);
      throw error;
    }

    setBudgets((prev) => {
      const filtered = prev.filter((b) => b.category_id !== categoryId);
      return [...filtered, data];
    });
  };

  return {
    categories,
    transactions,
    budgets,
    isLoading,
    error,
    addCategory,
    addTransaction,
    deleteTransaction,
    saveBudget,
    refresh: fetchData,
  };
}
