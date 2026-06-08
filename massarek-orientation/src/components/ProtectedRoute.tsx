import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

const STUDENT_FALLBACK = "/dashboard";
const ADMIN_FALLBACK = "/admin/dashboard";
const LAST_VALID_STUDENT_PATH = "lastValidStudentPath";
const LAST_VALID_ADMIN_PATH = "lastValidAdminPath";

const storeLastValidPath = (path: string, role: string | null) => {
  if (!path) return;
  if (role === "admin") {
    localStorage.setItem(LAST_VALID_ADMIN_PATH, path);
  } else {
    localStorage.setItem(LAST_VALID_STUDENT_PATH, path);
  }
};

const getFallbackPath = (role: string | null) => {
  if (role === "admin") {
    return localStorage.getItem(LAST_VALID_ADMIN_PATH) || ADMIN_FALLBACK;
  }
  return localStorage.getItem(LAST_VALID_STUDENT_PATH) || STUDENT_FALLBACK;
};

/**
 * ProtectedRoute - Guards student/protected routes from unauthorized access
 */
const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, role } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const userRole = role || user?.role || "user";

  if (!isAuthenticated) {
    localStorage.setItem("intendedDestination", currentPath);
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    const fallback = getFallbackPath(userRole);
    return <Navigate to={fallback} replace />;
  }

  if (userRole === "admin") {
    const fallback = getFallbackPath(userRole);
    return <Navigate to={fallback} replace />;
  }

  storeLastValidPath(currentPath, userRole);
  return <>{children}</>;
};

export default ProtectedRoute;
