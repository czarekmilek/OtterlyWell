import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCaloriesData } from "./useCaloriesData";

const {
  mockSelect,
  mockFrom,
  mockInsert,
  mockUpdate,
  mockDelete,
  mockEq,
  mockOrder,
  mockLimit,
  mockSingle,
  mockMaybeSingle,
  mockGte,
  mockLte,
} = vi.hoisted(() => {
  const mockSelect = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  const mockEq = vi.fn();
  const mockOrder = vi.fn();
  const mockLimit = vi.fn();
  const mockSingle = vi.fn();
  const mockMaybeSingle = vi.fn();
  const mockGte = vi.fn();
  const mockLte = vi.fn();

  const mockFrom = vi.fn(() => ({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
  }));

  return {
    mockSelect,
    mockFrom,
    mockInsert,
    mockUpdate,
    mockDelete,
    mockEq,
    mockOrder,
    mockLimit,
    mockSingle,
    mockMaybeSingle,
    mockGte,
    mockLte,
  };
});

vi.mock("../../../lib/supabaseClient", () => ({
  supabase: {
    from: mockFrom,
  },
}));

const chain = (mock: any) => {
  mock.mockReturnValue({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    eq: mockEq,
    order: mockOrder,
    limit: mockLimit,
    single: mockSingle,
    maybeSingle: mockMaybeSingle,
    gte: mockGte,
    lte: mockLte,
  });
  return mock;
};

beforeEach(() => {
  vi.resetAllMocks();

  chain(mockFrom);
  chain(mockSelect);
  chain(mockInsert);
  chain(mockUpdate);
  chain(mockDelete);
  chain(mockEq);
  chain(mockOrder);
  chain(mockGte);
  chain(mockLte);
});

describe("useCaloriesData", () => {
  const mockUser = { id: "test-user-id" } as any;
  const mockDate = new Date("2024-01-01");

  it("should fetch goals and entries on mount", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: {
        daily_kcal_limit: 2500,
        daily_protein_goal: 150,
        daily_fat_goal: 80,
        daily_carbs_goal: 300,
      },
      error: null,
    });

    mockOrder.mockResolvedValueOnce({
      data: [
        {
          id: "1",
          kcal: 500,
          protein: 30,
          fat: 20,
          carbs: 50,
          created_at: "2024-01-01T10:00:00Z",
        },
      ],
      error: null,
    });
    mockOrder.mockResolvedValueOnce({
      data: [
        {
          id: "1",
          kcal: 500,
          protein: 30,
          fat: 20,
          carbs: 50,
          created_at: "2024-01-01T10:00:00Z",
        },
      ],
      error: null,
    });

    const { result } = renderHook(() => useCaloriesData(mockUser, mockDate));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.goals.calories).toBe(2500);
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.totalCalories.kcal).toBe(500);
  });

  it("should add entry from food", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });
    mockOrder.mockResolvedValue({ data: [], error: null });

    const { result } = renderHook(() => useCaloriesData(mockUser, mockDate));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    mockSingle.mockResolvedValueOnce({
      data: {
        id: "new-entry-1",
        kcal: 100,
        protein: 10,
        fat: 5,
        carbs: 5,
        created_at: mockDate.toISOString(),
      },
      error: null,
    });

    const foodItem = {
      id: "food-1",
      name: "Apple",
      kcalPer100g: 50,
      proteinPer100g: 0,
      fatPer100g: 0,
      carbsPer100g: 14,
      brand: "Nature",
      servingSize: 100,
      servingUnit: "g",
    };

    await act(async () => {
      await result.current.addEntryFromFood(foodItem, 200);
    });

    expect(mockInsert).toHaveBeenCalled();
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].kcal).toBe(100);
  });
});
