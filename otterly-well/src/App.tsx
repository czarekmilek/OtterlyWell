import { lazy, Suspense } from "react";
import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Layout from "./components/Layout/Layout";
import theme from "./theme";

const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
        </Suspense>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
