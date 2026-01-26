import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { vi } from "vitest";

// Mock Supabase client
vi.mock("./lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: () =>
        Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
  },
}));

describe("App", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
  });
});
