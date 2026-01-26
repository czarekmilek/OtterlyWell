import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Dashboard from "./Dashboard";
import { ModuleProvider } from "../../context/ModuleContext";

// Mock AuthContext
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: "test-user",
      email: "test@example.com",
    },
    userType: "user",
  }),
}));

// Mock widgets to stay shallow
vi.mock("./components/CaloriesWidget", () => ({
  default: () => <div data-testid="calories-widget">CaloriesWidget</div>,
}));
vi.mock("./components/FitnessWidget", () => ({
  default: () => <div data-testid="fitness-widget">FitnessWidget</div>,
}));
vi.mock("./components/FinanceWidget", () => ({
  default: () => <div data-testid="finance-widget">FinanceWidget</div>,
}));
vi.mock("./components/TasksWidget", () => ({
  default: () => <div data-testid="tasks-widget">TasksWidget</div>,
}));

describe("<Dashboard />", () => {
  test("it should mount", () => {
    render(
      <BrowserRouter>
        <ModuleProvider>
          <Dashboard />
        </ModuleProvider>
      </BrowserRouter>,
    );

    // Check for at least one widget or valid state
    // (ModuleProvider defaults to all enabled usually)
    const caloriesWidget = screen.queryByTestId("calories-widget");
    const emptyState = screen.queryByText("Wszystkie moduły są ukryte.");

    expect(caloriesWidget || emptyState).toBeInTheDocument();
  });
});
