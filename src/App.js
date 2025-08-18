import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ROLES } from './utils/constants';
import Login from './components/Auth/Login';
import AdminDashboard from './components/Admin/Dashboard';
import Assets from './components/Admin/Assets';
import EmployeeDashboard from './components/Employee/Dashboard';
import Topbar from './components/Navbar/Topbar';

export default function App(){
  return (
    <>
      {/* show Topbar on every route except /login */}
      {window.location.pathname !== '/login' && <Topbar />}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={
          <ProtectedRoute roles={[ROLES.Admin]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/assets" element={
          <ProtectedRoute roles={[ROLES.Admin]}>
            <Assets />
          </ProtectedRoute>
        } />

        <Route path="/employee" element={
          <ProtectedRoute roles={[ROLES.Employee, ROLES.Admin]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
