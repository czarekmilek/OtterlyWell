import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ModuleProvider } from "../../../context/ModuleContext";

// Mock AuthContext
vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "test-user" },
  }),
}));

describe("<Sidebar />", () => {
  it("should render successfully", () => {
    render(
      <BrowserRouter>
        <ModuleProvider>
          <Sidebar mobileOpen={false} setMobileOpen={vi.fn()} />
        </ModuleProvider>
      </BrowserRouter>,
    );
    expect(screen.getByText("Pulpit")).toBeInTheDocument();
  });
});
