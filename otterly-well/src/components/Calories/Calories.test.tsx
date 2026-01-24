import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Calories from "./Calories";
import { ModuleProvider } from "../../context/ModuleContext";

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "test-user" },
  }),
}));

vi.mock("./hooks/useCaloriesData", () => ({
  useCaloriesData: () => ({
    entries: [],
    isLoading: false,
    goals: {
      calories: 2000,
      protein: 150,
      fat: 70,
      carbs: 250,
    },
    totalCalories: 500,
    addEntryFromFood: vi.fn(),
    addCustomEntry: vi.fn(),
    removeEntry: vi.fn(),
    editEntry: vi.fn(),
    updateGoal: vi.fn(),
  }),
}));

vi.mock("./components", () => ({
  DateSelector: () => <div data-testid="date-selector">DateSelector</div>,
  Goals: () => <div data-testid="goals">Goals</div>,
  EntriesList: () => <div data-testid="entries-list">EntriesList</div>,
}));

vi.mock("./components/AddDataSection", () => ({
  AddDataSection: () => (
    <div data-testid="add-data-section">AddDataSection</div>
  ),
}));

describe("<Calories />", () => {
  it("renders correctly", () => {
    render(
      <ModuleProvider>
        <Calories />
      </ModuleProvider>,
    );

    expect(screen.getByTestId("date-selector")).toBeInTheDocument();
    expect(screen.getByTestId("goals")).toBeInTheDocument();
    expect(screen.getByTestId("entries-list")).toBeInTheDocument();
    expect(screen.getByTestId("add-data-section")).toBeInTheDocument();
  });
});
