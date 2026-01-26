import { useState, useCallback, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import type { FinanceTransaction, FinanceCategory } from "../types/types";

export function useTransactions(categories: FinanceCategory[]) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null,
  );

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setTransactionsLoading(true);
    setTransactionsError(null);
    try {
      const { data: transData, error: transError } = await supabase
        .from("finance_transactions")
        .select("*")
        .order("date", { ascending: false });

      if (transError) throw transError;

      const enrichedTransactions = (transData || []).map((t) => ({
        ...t,
        finance_categories: categories.find((c) => c.id === t.category_id),
      }));

      setTransactions(enrichedTransactions as FinanceTransaction[]);
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      setTransactionsError(err.message);
    } finally {
      setTransactionsLoading(false);
    }
  }, [user, categories]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (
    transaction: Omit<
      FinanceTransaction,
      "id" | "user_id" | "created_at" | "finance_categories"
    >,
  ) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("finance_transactions")
      .insert({
        ...transaction,
        user_id: user.id,
      })
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

  const editTransaction = async (
    id: string,
    updatedTransaction: Partial<
      Omit<
        FinanceTransaction,
        "id" | "user_id" | "created_at" | "finance_categories"
      >
    >,
  ) => {
    const { data, error } = await supabase
      .from("finance_transactions")
      .update(updatedTransaction)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error editing transaction:", error);
      throw error;
    }

    const enrichedTransaction = {
      ...data,
      finance_categories: categories.find((c) => c.id === data.category_id),
    };

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? (enrichedTransaction as FinanceTransaction) : t,
      ),
    );

    return enrichedTransaction as FinanceTransaction;
  };

  return {
    transactions,
    transactionsLoading,
    transactionsError,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
  };
}
