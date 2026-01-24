import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTaskMutations } from "./useTaskMutations";

const { mockFrom } = vi.hoisted(() => {
  const mockFrom = vi.fn();
  return { mockFrom };
});

vi.mock("../../../lib/supabaseClient", () => ({
  supabase: {
    from: mockFrom,
  },
}));

const createChain = (data: any = null) => {
  const chain: any = {
    then: (resolve: any) => resolve({ data, error: null }),
    select: () => chain,
    insert: () => chain,
    update: () => chain,
    delete: () => chain,
    eq: () => chain,
    single: () => Promise.resolve({ data, error: null }),
  };
  return chain;
};

describe("useTaskMutations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add task", async () => {
    const newItem = { id: "new-task", title: "New Task", is_completed: false };
    mockFrom.mockReturnValue(createChain(newItem));

    const setTasks = vi.fn();
    const user = { id: "u1" } as any;
    const tasks: any[] = [];

    const { result } = renderHook(() =>
      useTaskMutations({ user, tasks, setTasks }),
    );

    await act(async () => {
      await result.current.addTask({
        title: "New Task",
        category_id: "c1",
        priority: 1,
      } as any);
    });

    expect(mockFrom).toHaveBeenCalledWith("tasks");
    expect(setTasks).toHaveBeenCalled();
    const updateFn = setTasks.mock.calls[0][0];
    expect(updateFn([])).toHaveLength(1);
    expect(updateFn([])[0].title).toBe("New Task");
  });

  it("should toggle task completion optimistcally", async () => {
    mockFrom.mockReturnValue(createChain({}));

    const setTasks = vi.fn();
    const user = { id: "u1" } as any;
    const tasks = [{ id: "t1", is_completed: false }] as any[];

    const { result } = renderHook(() =>
      useTaskMutations({ user, tasks, setTasks }),
    );

    await act(async () => {
      await result.current.toggleTaskCompletion("t1");
    });

    expect(mockFrom).toHaveBeenCalledWith("tasks");
    expect(setTasks).toHaveBeenCalled();
    const updateFn = setTasks.mock.calls[0][0];
    const newState = updateFn(tasks);
    expect(newState[0].is_completed).toBe(true);
  });
});
