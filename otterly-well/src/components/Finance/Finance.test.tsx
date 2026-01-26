import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Finance from "./Finance";
import { ModuleProvider } from "../../context/ModuleContext";

// Mock useFinance hook
vi.mock("./hooks/useFinance", () => ({
  useFinance: () => ({
    transactions: [],
    categories: [],
    budgets: [],
    isLoading: false,
    addTransaction: vi.fn(),
    deleteTransaction: vi.fn(),
    editTransaction: vi.fn(),
    saveBudget: vi.fn(),
    toggleCategory: vi.fn(),
  }),
}));

vi.mock("../UI/DateSelector", () => ({
  DateSelector: () => <div data-testid="date-selector">DateSelector</div>,
}));

vi.mock("./components/NewTransactionModal", () => ({
  NewTransactionModal: () => (
    <div data-testid="new-transaction-modal">NewTransactionModal</div>
  ),
}));

vi.mock("./components/FinanceStats/FinanceStats", () => ({
  FinanceStats: () => <div data-testid="finance-stats">FinanceStats</div>,
}));

vi.mock("./components/TransactionList/TransactionList", () => ({
  default: () => <div data-testid="transaction-list">TransactionList</div>,
}));

vi.mock("./components/BudgetPlanner/BudgetPlanner", () => ({
  default: () => <div data-testid="budget-planner">BudgetPlanner</div>,
}));

vi.mock("./components/BilanceBreakdown/BilanceBreakdown", () => ({
  default: () => <div data-testid="bilance-breakdown">BilanceBreakdown</div>,
}));

vi.mock("./components/EntryModal/EntryModal", () => ({
  default: () => <div data-testid="entry-modal">EntryModal</div>,
}));

vi.mock("../UI/TabButton", () => ({
  default: ({ label }: { label: string }) => <button>{label}</button>,
}));

describe("<Finance />", () => {
  it("renders correctly", () => {
    render(
      <ModuleProvider>
        <Finance />
      </ModuleProvider>,
    );

    expect(screen.getByTestId("date-selector")).toBeInTheDocument();
    expect(screen.getAllByTestId("new-transaction-modal")).toHaveLength(2);
    expect(screen.getByTestId("finance-stats")).toBeInTheDocument();
    expect(screen.getByTestId("transaction-list")).toBeInTheDocument();
    expect(screen.getByTestId("budget-planner")).toBeInTheDocument();
    expect(screen.getByTestId("entry-modal")).toBeInTheDocument();
  });
});
