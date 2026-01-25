import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider } from "./AuthProvider";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

// Mock the supabase client
const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockSignOut = vi.fn();

vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: (...args: any[]) => mockGetSession(...args),
      onAuthStateChange: (...args: any[]) => mockOnAuthStateChange(...args),
      signOut: (...args: any[]) => mockSignOut(...args),
    },
  },
}));

// helper to consume context
const TestComponent = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return <div>User: {user ? user.email : "No User"}</div>;
};

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // default mocks
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    // return a subscription object that has unsubscribe method
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it("renders children", async () => {
    render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Test Child")).toBeInTheDocument();
    });
  });

  it("provides user when session exists", async () => {
    const mockUser = { id: "67", email: "test@example.com" };
    mockGetSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("User: test@example.com")).toBeInTheDocument();
    });
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("handles loading state", async () => {
    let resolveSession: any;
    const sessionPromise = new Promise((resolve) => {
      resolveSession = resolve;
    });

    mockGetSession.mockReturnValue(sessionPromise);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    resolveSession({ data: { session: null } });

    await waitFor(() => {
      expect(screen.getByText("User: No User")).toBeInTheDocument();
    });
  });
});
