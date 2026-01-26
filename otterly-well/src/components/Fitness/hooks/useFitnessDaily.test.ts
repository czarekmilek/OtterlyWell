import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFitnessDaily } from "./useFitnessDaily";

const { mockFrom } = vi.hoisted(() => {
  const mockFrom = vi.fn();
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

const createChain = (data: any) => {
  const chain: any = {
    then: (resolve: any) => resolve({ data, error: null }),
    select: () => chain,
    eq: () => chain,
    gte: () => chain,
    lte: () => chain,
    order: () => Promise.resolve({ data, error: null }),
    insert: () => chain,
    single: () => Promise.resolve({ data, error: null }),
    update: () => chain,
    delete: () => chain,
  };
  return chain;
};

describe("useFitnessDaily", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch entries on mount", async () => {
    const mockData = [
      { id: "entry-1", exercise_id: "ex-1", sets: 3, reps: 10 },
    ];

    mockFrom.mockImplementation(() => {
      const chain = createChain(mockData);
      chain.order = () => Promise.resolve({ data: mockData, error: null });
      return chain;
    });

    const date = new Date();
    const { result } = renderHook(() => useFitnessDaily(date));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].sets).toBe(3);
  });

  it("should add entry", async () => {
    mockFrom.mockImplementation(() => {
      const chain = createChain([]);
      chain.order = () => Promise.resolve({ data: [], error: null });

      chain.single = () =>
        Promise.resolve({
          data: { id: "new-entry", exercise_id: "ex-1", sets: 4 },
          error: null,
        });

      return chain;
    });

    const date = new Date();
    const { result } = renderHook(() => useFitnessDaily(date));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addEntry({ id: "ex-1", name: "Pushups" } as any, {
        sets: 4,
      });
    });

    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].sets).toBe(4);
  });
});
