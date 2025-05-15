import { createBrowserRouter, Navigate } from "react-router-dom";

// Auth pages
import { LoginPage, ForgotPasswordPage, ResetPasswordPage } from "./pages/auth";

// Dashboard pages
import {
  Dashboard,
  Profile,
  Users,
  Categories,
  Products,
  Uploads,
  Orders,
} from "./pages/dashboard";

// Auth context
import { useAuth } from "./context/AuthContext";
import { LoadingSpinner } from "./components/common";

// Protected route component
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  // if (loading) {
  //   return <LoadingSpinner fullScreen message="Loading..." />;
  // }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected component
  return element;
};

// Guest route component (redirect to dashboard if already logged in)
const GuestRoute = ({ element }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // if (loading) {
  //   return <LoadingSpinner fullScreen message="Loading..." />;
  // }

  if ((isAuthenticated && user?.role === "admin") || user?.role === "company") {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

// Routes for the application
export const router = createBrowserRouter([
  // Public/guest routes
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <GuestRoute element={<LoginPage />} />,
  },
  {
    path: "/forgot-password",
    element: <GuestRoute element={<ForgotPasswordPage />} />,
  },
  {
    path: "/reset-password/:token",
    element: <GuestRoute element={<ResetPasswordPage />} />,
  },

  // Protected routes
  {
    path: "/dashboard",
    element: <ProtectedRoute element={<Dashboard />} />,
  },
  {
    path: "/profile",
    element: <ProtectedRoute element={<Profile />} />,
  },
  {
    path: "/users",
    element: <ProtectedRoute element={<Users />} />,
  },
  {
    path: "/categories",
    element: <ProtectedRoute element={<Categories />} />,
  },
  {
    path: "/products",
    element: <ProtectedRoute element={<Products />} />,
  },
  {
    path: "/orders",
    element: <ProtectedRoute element={<Orders />} />,
  },
  {
    path: "/uploads",
    element: <ProtectedRoute element={<Uploads />} />,
  },

  // 404 Not Found route
  {
    path: "*",
    element: (
      <div className="flex flex-col items-center justify-center h-screen bg-secondary-100">
        <h1 className="text-4xl font-bold text-secondary-800 mb-4">404</h1>
        <p className="text-secondary-600 mb-6">Page not found</p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    ),
  },
]);
