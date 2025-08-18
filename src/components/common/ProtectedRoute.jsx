import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, parseUser } from '../../utils/tokenHelper';

export default function ProtectedRoute({ children, roles = [] }) {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  const user = parseUser(token);
  if (roles.length && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
}
