import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import "@testing-library/jest-dom";
import Dashboard from "./Dashboard";

describe("<Dashboard />", () => {
  test("it should mount", () => {
    render(<Dashboard />);

    const dashboard = screen.getByTestId("Dashboard");

    expect(dashboard).toBeInTheDocument();
  });
});
