import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModuleProvider, useModuleContext } from "./ModuleContext";

const mockUser = { id: "test-user-id" };
const mockUseAuth = vi.fn();

vi.mock("./AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockUpsert = vi.fn();
const mockFrom = vi.fn();

vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    from: (table: string) => mockFrom(table),
  },
}));

const TestComponent = () => {
  const { visibleModules, toggleModule } = useModuleContext();
  return (
    <div>
      <div data-testid="module-calories">
        {visibleModules.calories ? "On" : "Off"}
      </div>
      <button onClick={() => toggleModule("calories")}>Toggle Calories</button>
    </div>
  );
};

describe("ModuleProvider", () => {
  // mimics the browser storage because the test environment doesn't have a real localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      clear: () => {
        store = {};
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    };
  })();

  beforeEach(() => {
    vi.clearAllMocks();

    // overrides the global window.localStorage because we want to use our custom mock implementation
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    localStorageMock.clear();

    mockUseAuth.mockReturnValue({ user: null });

    mockFrom.mockReturnValue({
      select: mockSelect,
      upsert: mockUpsert,
    });
    mockSelect.mockReturnValue({
      eq: mockEq,
    });
    mockEq.mockReturnValue({
      single: mockSingle,
    });
    mockSingle.mockResolvedValue({ data: null, error: null });
    mockUpsert.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses default modules when localStorage is empty and no user", async () => {
    render(
      <ModuleProvider>
        <TestComponent />
      </ModuleProvider>,
    );

    // 'On' becuse the default configuration in ModuleContext all modules enabled
    expect(screen.getByTestId("module-calories")).toHaveTextContent("On");
  });

  it("initializes from localStorage if present", async () => {
    const savedState = {
      calories: false,
      fitness: true,
      finance: true,
      tasks: true,
    };
    localStorageMock.setItem("visibleModules", JSON.stringify(savedState));

    render(
      <ModuleProvider>
        <TestComponent />
      </ModuleProvider>,
    );

    // should read false from local storage
    await waitFor(() => {
      expect(screen.getByTestId("module-calories")).toHaveTextContent("Off");
    });
    expect(localStorageMock.getItem).toHaveBeenCalledWith("visibleModules");
  });

  it("updates localStorage when toggling a module", async () => {
    const user = userEvent.setup();
    render(
      <ModuleProvider>
        <TestComponent />
      </ModuleProvider>,
    );

    expect(screen.getByTestId("module-calories")).toHaveTextContent("On");

    await user.click(screen.getByText("Toggle Calories"));

    expect(screen.getByTestId("module-calories")).toHaveTextContent("Off");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "visibleModules",
      expect.stringContaining('"calories":false'),
    );
  });

  it("loads preferences from Supabase when user is logged in", async () => {
    mockUseAuth.mockReturnValue({ user: mockUser });

    // specific remote data because we want to confirm the app synchronizes with database
    const dbPrefs = {
      visibleModules: {
        calories: false,
        fitness: true,
        finance: true,
        tasks: true,
      },
    };
    mockSingle.mockResolvedValue({
      data: { preferences: dbPrefs },
      error: null,
    });

    render(
      <ModuleProvider>
        <TestComponent />
      </ModuleProvider>,
    );

    // eventually displays 'Off' because the useEffect fetches data from Supabase and updates the state
    await waitFor(() => {
      expect(screen.getByTestId("module-calories")).toHaveTextContent("Off");
    });

    expect(mockFrom).toHaveBeenCalledWith("profiles");
    expect(mockSelect).toHaveBeenCalledWith("preferences");
    expect(mockEq).toHaveBeenCalledWith("id", mockUser.id);
  });

  it("saves preferences to Supabase when toggling (if logged in)", async () => {
    const user = userEvent.setup();
    mockUseAuth.mockReturnValue({ user: mockUser });

    mockSingle.mockResolvedValue({ data: null, error: null });

    render(
      <ModuleProvider>
        <TestComponent />
      </ModuleProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("module-calories")).toHaveTextContent("On"),
    );

    await user.click(screen.getByText("Toggle Calories"));

    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith("profiles");
      expect(mockUpsert).toHaveBeenCalledWith({
        id: mockUser.id,
        preferences: expect.objectContaining({
          visibleModules: expect.objectContaining({ calories: false }),
        }),
        updated_at: expect.any(Date),
      });
    });
  });
});
