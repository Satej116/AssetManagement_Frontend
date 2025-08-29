import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../components/Navbar/Topbar"; // reuse your existing Topbar
import "../styles/admin-layout.css";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`am-layout ${collapsed ? "am-collapsed" : ""}`}>
      <Topbar />

      <div className="am-body">
        {/* Sidebar */}
        <div className="am-sidebar-wrap">
          {/* Toggle visible on small screens */}
          <button
            className="btn btn-outline-secondary am-toggle d-lg-none"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Toggle navigation"
          >
            {collapsed ? "Show Menu" : "Hide Menu"}
          </button>

          {/* Persistent sidebar */}
          <div className="am-sidebar-holder">
            {/* Lazy import to avoid circular dep in import order */}
            {React.createElement(require("../components/Admin/Sidebar").default, { collapsed })}
          </div>
        </div>

        {/* Content */}
        <main className="am-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
