import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // In a real app, you would check for an authentication token or user session
  const isAuthenticated = localStorage.getItem('authToken'); // Simple check
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;