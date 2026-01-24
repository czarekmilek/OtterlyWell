import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Fitness from "./Fitness";
import { ModuleProvider } from "../../context/ModuleContext";

// Mock AuthContext
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "test-user" },
  }),
}));

vi.mock("./hooks/useFitnessDaily", () => ({
  useFitnessDaily: () => ({
    entries: [],
    isLoading: false,
    addEntry: vi.fn(),
    removeEntry: vi.fn(),
    editEntry: vi.fn(),
  }),
}));

vi.mock("../UI/DateSelector", () => ({
  DateSelector: () => <div data-testid="date-selector">DateSelector</div>,
}));

vi.mock("./components/WorkoutList/WorkoutList", () => ({
  default: () => <div data-testid="workout-list">WorkoutList</div>,
}));

vi.mock("./components/NewWorkout/NewWorkoutTabs", () => ({
  default: () => <div data-testid="new-workout-tabs">NewWorkoutTabs</div>,
}));

vi.mock("./components/Goals/FitnessGoals", () => ({
  default: () => <div data-testid="fitness-goals">FitnessGoals</div>,
}));

describe("<Fitness />", () => {
  it("renders correctly", () => {
    render(
      <ModuleProvider>
        <Fitness />
      </ModuleProvider>,
    );

    expect(screen.getByTestId("date-selector")).toBeInTheDocument();
    expect(screen.getByTestId("workout-list")).toBeInTheDocument();
    expect(screen.getByTestId("new-workout-tabs")).toBeInTheDocument();
    expect(screen.getByTestId("fitness-goals")).toBeInTheDocument();
  });
});
