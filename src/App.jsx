import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import ErrorPage from "./components/ErrorPage";
import Loading from "./components/Loading";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// LAZY LOAD PAGES
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Orders = React.lazy(() => import("./pages/Orders"));

const CustomerManagement = React.lazy(() =>
  import("./pages/CustomerManagement")
);

const ProductsManagement = React.lazy(() =>
  import("./pages/ProductsManagement")
);

const Components = React.lazy(() =>
  import("./pages/Components")
);

const About = React.lazy(() =>
  import("./pages/About")
);

const MemberManagement = React.lazy(() =>
  import("./pages/MemberManagement")
);

const MemberDetail = React.lazy(() =>
  import("./pages/MemberDetail")
);

const UserManagement = React.lazy(() =>
  import("./pages/UserManagement")
);

const Login = React.lazy(() => import("./pages/auth/Login"));
const Logout = React.lazy(() => import("./pages/auth/Logout"));
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const MemberDashboard = React.lazy(() => import("./pages/MemberDashboard"));

// ROOT RESOLVER
const RootResolver = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    if (user.role === "member") {
      return <Navigate to="/member-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  return <LandingPage />;
};

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
    <AuthProvider>
      <Suspense fallback={<Loading />}>
        <Routes>

          {/* PUBLIC ROOT ROUTE */}
          <Route path="/" element={<RootResolver />} />

          {/* MAIN LAYOUT (ADMIN ROUTES) */}
          <Route element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route
              path="/products-management"
              element={<ProductsManagement />}
            />

            <Route
              path="/components"
              element={<Components />}
            />

            <Route
              path="/customer-management"
              element={<CustomerManagement />}
            />

            <Route
              path="/about"
              element={<About />}
            />

            <Route
              path="/member-management"
              element={<MemberManagement />}
            />

            <Route
              path="/member-management/:id"
              element={<MemberDetail />}
            />

            <Route
              path="/user-management"
              element={<UserManagement />}
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
          
          {/* MEMBER DASHBOARD */}
          <Route
            path="/member-dashboard"
            element={
              <ProtectedRoute allowedRoles={["member"]}>
                <MemberDashboard />
              </ProtectedRoute>
            }
          />

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

            <Route
              path="/logout"
              element={<Logout />}
            />

          </Route>

        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;