import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import ErrorPage from "./components/ErrorPage";
import Loading from "./components/Loading";

// LAZY LOAD PAGES
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Orders = React.lazy(() => import("./pages/Orders"));

const CustomerManagement = React.lazy(() =>
  import("./pages/CustomerManagement")
);

const ProductsManagement = React.lazy(() =>
  import("./pages/ProductsManagement")
);

const Login = React.lazy(() => import("./pages/auth/login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

// ERROR PAGES
const Error400 = () => (
  <ErrorPage
    code="400"
    description="Bad Request"
    image="/images/400.svg"
  />
);

const Error401 = () => (
  <ErrorPage
    code="401"
    description="Unauthorized - Please login first"
    image="/images/401.svg"
  />
);

const Error403 = () => (
  <ErrorPage
    code="403"
    description="Forbidden - You don't have access"
    image="/images/403.svg"
  />
);

const NotFound = () => (
  <ErrorPage
    code="404"
    description="Page Not Found - The page you're looking for doesn't exist"
    image="/images/404.svg"
  />
);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* MAIN LAYOUT */}
        <Route element={<MainLayout />}>

          <Route path="/" element={<Dashboard />} />

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/products-management"
            element={<ProductsManagement />}
          />

          <Route
            path="/customer-management"
            element={<CustomerManagement />}
          />

          {/* ERROR PAGES */}
          <Route
            path="/error-400"
            element={<Error400 />}
          />

          <Route
            path="/error-401"
            element={<Error401 />}
          />

          <Route
            path="/error-403"
            element={<Error403 />}
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Route>

        {/* AUTH LAYOUT */}
        <Route element={<AuthLayout />}>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/forgot"
            element={<Forgot />}
          />

        </Route>

      </Routes>
    </Suspense>
  );
}

export default App;