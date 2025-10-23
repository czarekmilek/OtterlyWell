import React, { lazy, Suspense, type JSX } from "react";

const LazyDashboard = lazy(() => import("./Dashboard"));

const Dashboard = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={null}>
    <LazyDashboard {...props} />
  </Suspense>
);

export default Dashboard;
