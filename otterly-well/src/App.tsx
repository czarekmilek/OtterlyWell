import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { LoadingSpinner } from "./components/UI/LoadingSpinner";
import { ModuleProvider } from "./context/ModuleContext";
import "./App.css";
import Layout from "./components/Layout/Layout";

const Login = lazy(() => import("./components/Auth/Login/Login"));
const Register = lazy(() => import("./components/Auth/Register/Register"));
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));
const Calories = lazy(() => import("./components/Calories/Calories"));
const Fitness = lazy(() => import("./components/Fitness/Fitness"));
const Finance = lazy(() => import("./components/Finance/Finance"));
const Tasks = lazy(() => import("./components/Tasks/Tasks"));

function App() {
  return (
    <ModuleProvider>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calories" element={<Calories />} />
              <Route path="/fitness" element={<Fitness />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/tasks" element={<Tasks />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </ModuleProvider>
  );
}

export default App;
