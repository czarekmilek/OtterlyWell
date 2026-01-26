import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTransactions } from "./useTransactions";

const { mockFrom } = vi.hoisted(() => {
  const createChain = (data: any) => {
    const chain: any = {
      then: (resolve: any) => resolve({ data, error: null }),
      order: () => Promise.resolve({ data, error: null }),
      select: () => chain,
      insert: () => chain,
      update: () => chain,
      delete: () => chain,
      eq: () => chain,
      single: () => Promise.resolve({ data, error: null }),
    };
    chain.select = () => chain;
    return chain;
  };

  const mockFrom = vi.fn().mockReturnValue(createChain([]));
  return { mockFrom };
});

vi.mock("../../../lib/supabaseClient", () => ({
  supabase: {
    from: mockFrom,
  },
}));

vi.mock("../../../context/AuthContext", () => {
  const user = { id: "test-user-id" };
  return {
    useAuth: () => ({ user }),
  };
});

describe("useTransactions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch transactions on mount", async () => {
    const mockData = [
      { id: "t1", amount: 100, category_id: "c1", date: "2024-01-01" },
    ];

    const createChain = (data: any) => {
      const chain: any = {
        then: (resolve: any) => resolve({ data, error: null }),
        order: () => Promise.resolve({ data, error: null }),
        select: () => chain,
      };
      chain.select = () => chain;
      return chain;
    };

    mockFrom.mockImplementation((table: string) => {
      if (table === "finance_transactions") {
        return createChain(mockData);
      }
      return createChain([]);
    });

    const mockCategories = [{ id: "c1", name: "Food", type: "expense" }] as any;
    const { result } = renderHook(() => useTransactions(mockCategories));

    await waitFor(() => {
      expect(result.current.transactionsLoading).toBe(false);
    });

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].amount).toBe(100);
    expect(result.current.transactions[0].finance_categories?.name).toBe(
      "Food",
    );
  });

  it("should add transaction", async () => {
    mockFrom.mockImplementation((_table: string) => {
      const chain: any = {
        then: (resolve: any) => resolve({ data: [], error: null }),
        select: () => chain,
        insert: () => chain,
        order: () => Promise.resolve({ data: [], error: null }),
        single: () =>
          Promise.resolve({
            data: { id: "new-t", amount: 50, category_id: "c1" },
            error: null,
          }),
      };
      return chain;
    });

    const mockCategories = [{ id: "c1", name: "Food" }] as any;
    const { result } = renderHook(() => useTransactions(mockCategories));

    await waitFor(() => {
      expect(result.current.transactionsLoading).toBe(false);
    });

    await act(async () => {
      await result.current.addTransaction({
        title: "Lunch",
        amount: 50,
        category_id: "c1",
        date: "2024-01-02",
        type: "expense",
        description: "Lunch",
      });
    });

    expect(
      result.current.transactions.find((t) => t.amount === 50),
    ).toBeDefined();
  });
});
