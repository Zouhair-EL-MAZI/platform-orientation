import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

/**
 * ProtectedRoute - Guards routes from unauthorized access
 * 
 * If user is not authenticated:
 * - Stores the intended destination in localStorage
 * - Redirects to /login
 * 
 * If authenticated and no role requirement:
 * - Renders the component
 * 
 * If authenticated with role requirement:
 * - Checks user role matches requirement
 * - Allows access or redirects to /dashboard
 */
const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const currentPath = window.location.pathname;

  // If not authenticated, store intended destination and redirect to login
  if (!isAuthenticated) {
    localStorage.setItem("intendedDestination", currentPath);
    return <Navigate to="/login" replace />;
  }

  // If role is required, check if user has that role
  if (requiredRole && user?.role !== requiredRole) {
    // User is authenticated but doesn't have the required role
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated (and has required role if specified)
  return <>{children}</>;
};

export default ProtectedRoute;
