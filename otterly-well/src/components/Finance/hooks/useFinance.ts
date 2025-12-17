import { useCallback } from "react";
import { useCategories } from "./useCategories";
import { useBudgets } from "./useBudgets";
import { useTransactions } from "./useTransactions";

export function useFinance() {
  const {
    categories,
    categoriesLoading,
    categoriesError,
    fetchCategories,
    addCategory,
  } = useCategories();

  const { budgets, budgetsLoading, budgetsError, fetchBudgets, saveBudget } =
    useBudgets();

  const {
    transactions,
    transactionsLoading,
    transactionsError,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
  } = useTransactions(categories);

  const refresh = useCallback(async () => {
    await Promise.all([fetchCategories(), fetchBudgets(), fetchTransactions()]);
  }, [fetchCategories, fetchBudgets, fetchTransactions]);

  const isLoading = categoriesLoading || budgetsLoading || transactionsLoading;
  const error = categoriesError || budgetsError || transactionsError;

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
    refresh,
  };
}
