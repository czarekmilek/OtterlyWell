import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFoodSearch } from "./useFoodSearch";

const { mockSelect, mockFrom } = vi.hoisted(() => {
  const mockSelect = vi.fn();
  const mockFrom = vi.fn(() => ({
    select: mockSelect,
  }));
  return { mockSelect, mockFrom };
});

vi.mock("../../../lib/supabaseClient", () => ({
  supabase: {
    from: mockFrom,
  },
}));

// Mock AuthContext
vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "test-user-id" },
  }),
}));

describe("useFoodSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // reset default behavior
    mockFrom.mockReturnValue({ select: mockSelect });
  });

  it("should return initial state", () => {
    const { result } = renderHook(() => useFoodSearch(""));

    expect(result.current.loading).toBe(false);
    expect(result.current.hits).toEqual([]);
    expect(result.current.error).toBeNull();
    // when query is empty and user exists, isRecent defaults to true
    expect(result.current.isRecent).toBe(true);
  });

  it("should handle search query", async () => {
    // setup mock response for search
    mockSelect.mockReturnValue({
      ilike: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue({
          data: [{ id: 1, name: "Test Food", kcal_per_100g: 100 }],
          error: null,
        }),
      }),
    });

    // mock global fetch for OpenFoodFacts
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
      }),
    ) as unknown as typeof fetch;

    const { result } = renderHook(() => useFoodSearch("Apple"));

    // waiting for the debounce and async operation
    await waitFor(
      () => {
        expect(result.current.hits).toHaveLength(1);
      },
      { timeout: 1000 },
    );

    expect(result.current.hits[0].name).toBe("Test Food");
  });
});
