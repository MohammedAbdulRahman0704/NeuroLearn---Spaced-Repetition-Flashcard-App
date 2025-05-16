// src/pages/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component restricts access to child routes
 * unless the user is authenticated.
 * 
 * Uses <Outlet /> to render nested routes if allowed.
 */
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render child routes (nested routes) if authenticated
  return <Outlet />;
};

export default ProtectedRoute;