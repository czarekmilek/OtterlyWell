import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";
import { ModuleProvider } from "../../../context/ModuleContext";

// Mock AuthContext
vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "test-user" },
    signOut: vi.fn(),
  }),
}));

// Mock useMedia which might be used in Header/Layout
vi.mock("react-use", () => ({
  useMedia: () => false,
}));

describe("<Header />", () => {
  it("should render successfully", () => {
    render(
      <BrowserRouter>
        <ModuleProvider>
          <Header onMenuClick={vi.fn()} />
        </ModuleProvider>
      </BrowserRouter>,
    );

    // Check for mobile menu button
    expect(screen.getByText("Open sidebar")).toBeInTheDocument();
  });
});
