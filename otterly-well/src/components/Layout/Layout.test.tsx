import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import { ModuleProvider } from "../../context/ModuleContext";

// Mock AuthContext
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "test-user" },
    loading: false,
  }),
}));

// Mock parts of logic that might cause issues
vi.mock("react-use", () => ({
  useMedia: () => false,
}));

describe("<Layout />", () => {
  it("should render children", () => {
    render(
      <BrowserRouter>
        <ModuleProvider>
          <Layout>
            <div data-testid="test-child">Child Content</div>
          </Layout>
        </ModuleProvider>
      </BrowserRouter>,
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getAllByText("OtterlyWell")[0]).toBeInTheDocument();
  });
});
