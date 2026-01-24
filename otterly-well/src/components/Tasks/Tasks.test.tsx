import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Tasks from "./Tasks";
import { ModuleProvider } from "../../context/ModuleContext";

// Mock useTasks hook
vi.mock("./hooks/useTasks", () => ({
  useTasks: () => ({
    tasks: [],
    categories: [],
    addTask: vi.fn(),
    toggleTaskCompletion: vi.fn(),
    deleteTask: vi.fn(),
    toggleCategory: vi.fn(),
    addCategory: vi.fn(),
    dismissTask: vi.fn(),
    deleteCategory: vi.fn(),
    restoreTask: vi.fn(),
    editTask: vi.fn(),
    reorderCategories: vi.fn(),
  }),
}));

vi.mock("./components/ViewModeSwitcher", () => ({
  ViewModeSwitcher: () => (
    <div data-testid="view-mode-switcher">ViewModeSwitcher</div>
  ),
}));

vi.mock("./components/TaskBoard/TaskBoard", () => ({
  TaskBoard: () => <div data-testid="task-board">TaskBoard</div>,
}));

vi.mock("./components/AddTaskModal", () => ({
  AddTaskModal: () => <div data-testid="add-task-modal">AddTaskModal</div>,
}));

vi.mock("./components/TaskCategoryManager/TaskCategoryManager", () => ({
  default: () => (
    <div data-testid="task-category-manager">TaskCategoryManager</div>
  ),
}));

vi.mock("./components/HistoricalTasksList/HistoricalTaskModal", () => ({
  default: () => (
    <div data-testid="historical-task-modal">HistoricalTaskModal</div>
  ),
}));

describe("<Tasks />", () => {
  it("renders correctly", () => {
    render(
      <ModuleProvider>
        <Tasks />
      </ModuleProvider>,
    );

    expect(screen.getByTestId("view-mode-switcher")).toBeInTheDocument();
    expect(screen.getByTestId("task-board")).toBeInTheDocument();

    expect(screen.getByText("Dodaj")).toBeInTheDocument();
    expect(screen.getByText("Filtruj")).toBeInTheDocument();
    expect(screen.getByText("Historia")).toBeInTheDocument();

    expect(screen.getByTestId("add-task-modal")).toBeInTheDocument();
    expect(screen.getByTestId("task-category-manager")).toBeInTheDocument();
    expect(screen.getByTestId("historical-task-modal")).toBeInTheDocument();
  });
});
