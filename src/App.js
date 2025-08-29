import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./components/Navbar/Topbar";
import Dashboard from "./components/Admin/Dashboard";
import Assets from "./components/Admin/Assets";
import Allocations from "./components/Admin/Allocations";
import ServiceRequests from "./components/Admin/ServiceRequests";
import AuditRequests from "./components/Admin/AuditRequests";
import AdminLogs from "./components/Admin/AdminLogs";
import Employees from "./components/Admin/Employees";
import Profile from "./components/Admin/Profile";
import Settings from "./components/Admin/Settings";
import Login from "./components/Auth/Login";

// Employee components
import EmployeeDashboard from "./components/Employee/Dashboard";
import MyAssets from "./components/Employee/MyAssets";

import { parseUser, getToken } from "./utils/tokenHelper";

function App() {
  const token = getToken();
  const user = token ? parseUser(token) : null;
  const isLoggedIn = !!token;

  return (
    <>
      {isLoggedIn && <Topbar />}
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : user?.role === "Admin" ? (
          <>
            {/* Admin Routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/employees" element={<Employees />} />
            <Route path="/admin/Assets" element={<Assets />} />
            <Route path="/admin/allocations" element={<Allocations />} />
            <Route path="/admin/service-requests" element={<ServiceRequests />} />
            <Route path="/admin/audit-requests" element={<AuditRequests />} />
            <Route path="/admin/admin-logs" element={<AdminLogs />} />
            <Route path="/admin/profile" element={<Profile />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </>
        ) : (
          <>
            {/* Employee Routes */}
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/employee/my-assets" element={<MyAssets />} />
            <Route path="*" element={<Navigate to="/employee" />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
