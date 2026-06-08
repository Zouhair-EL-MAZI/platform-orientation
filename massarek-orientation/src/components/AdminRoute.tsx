// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '@/hooks/use-auth';

// interface Props {
//   children: React.ReactNode;
// }

// const AdminRoute = ({ children }: Props) => {
//   const { isAuthenticated, user } = useAuth();
//   const role = typeof window !== 'undefined' ? localStorage.getItem('role') : user?.role;

//   if (!isAuthenticated) {
//     localStorage.setItem('intendedDestination', window.location.pathname);
//     return <Navigate to="/login" replace />;
//   }

//   if (role !== 'admin' && user?.role !== 'admin') {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <>{children}</>;
// };

// export default AdminRoute;
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface AdminRouteProps {
  children: React.ReactNode;
}

const STUDENT_FALLBACK = "/dashboard";
const ADMIN_FALLBACK = "/admin/dashboard";
const LAST_VALID_STUDENT_PATH = "lastValidStudentPath";
const LAST_VALID_ADMIN_PATH = "lastValidAdminPath";

const storeLastValidAdminPath = (path: string) => {
  if (!path) return;
  localStorage.setItem(LAST_VALID_ADMIN_PATH, path);
};

const getStudentFallback = () => {
  return localStorage.getItem(LAST_VALID_STUDENT_PATH) || STUDENT_FALLBACK;
};

/**
 * AdminRoute - Guards admin routes
 */
const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, user, role } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  // Fallback to localStorage — covers the case where React state hasn't
  // updated yet after login (e.g. navigate() called right after login())
  const userRole = role || user?.role || localStorage.getItem("role");

  if (!isAuthenticated) {
    localStorage.setItem("intendedDestination", currentPath);
    return <Navigate to="/login" replace />;
  }

  if (userRole !== "admin") {
    const fallback = getStudentFallback();
    return <Navigate to={fallback} replace />;
  }

  storeLastValidAdminPath(currentPath);
  return <>{children}</>;
};

export default AdminRoute;
