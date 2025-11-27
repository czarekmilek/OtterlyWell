import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { LoadingSpinner } from "./components/UI/LoadingSpinner";
import "./App.css";
import Layout from "./components/Layout/Layout";

const Login = lazy(() => import("./components/Auth/Login/Login"));
const Register = lazy(() => import("./components/Auth/Register/Register"));
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));
const Calories = lazy(() => import("./components/Calories/Calories"));

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calories" element={<Calories />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
