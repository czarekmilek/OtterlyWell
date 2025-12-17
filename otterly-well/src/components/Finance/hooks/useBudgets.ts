import { useState, useCallback, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import type { FinanceBudget } from "../types/types";

export function useBudgets() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<FinanceBudget[]>([]);
  const [budgetsLoading, setBudgetsLoading] = useState(true);
  const [budgetsError, setBudgetsError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    if (!user) return;
    setBudgetsLoading(true);
    setBudgetsError(null);
    try {
      const { data: budgetData, error: budgetError } = await supabase
        .from("finance_budgets")
        .select("*");

      if (budgetError) throw budgetError;
      setBudgets(budgetData || []);
    } catch (err: any) {
      console.error("Error fetching budgets:", err);
      setBudgetsError(err.message);
    } finally {
      setBudgetsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const saveBudget = async (categoryId: string, amount: number) => {
    if (!user) return;
    const existing = budgets.find((b) => b.category_id === categoryId);

    const payload = {
      user_id: user.id,
      category_id: categoryId,
      amount,
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
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
    budgets,
    budgetsLoading,
    budgetsError,
    fetchBudgets,
    saveBudget,
  };
}
