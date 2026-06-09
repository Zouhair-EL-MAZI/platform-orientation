import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface Props {
  children: React.ReactNode;
}

const StudentRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuth();
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

  if (!isAuthenticated) {
    localStorage.setItem('intendedDestination', window.location.pathname);
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin') {
    // Admins should go to admin area
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default StudentRoute;
