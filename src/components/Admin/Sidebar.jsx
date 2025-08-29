import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import {
  MdDashboard,
  MdInventory2,
  MdAssignmentInd,
  MdRequestQuote,
  MdFactCheck,
  MdListAlt,
  MdPeople,
} from "react-icons/md";

export default function Sidebar({ collapsed }) {
  return (
    <div className={`am-sidebar ${collapsed ? "collapsed" : ""}`}>
      <Nav className="flex-column py-3">
        <Nav.Item>
          <NavLink to="/admin/dashboard" className="am-link">
            <MdDashboard className="am-ic" />
            <span className="am-text">Dashboard</span>
          </NavLink>
        </Nav.Item>

        <div className="am-section">Assets</div>
        <Nav.Item>
          <NavLink to="/admin/assets" className="am-link">
            <MdInventory2 className="am-ic" />
            <span className="am-text">Assets</span>
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/admin/allocations" className="am-link">
            <MdAssignmentInd className="am-ic" />
            <span className="am-text">Allocations</span>
          </NavLink>
        </Nav.Item>

        <div className="am-section">Requests</div>
        <Nav.Item>
          <NavLink to="/admin/servicerequests" className="am-link">
            <MdRequestQuote className="am-ic" />
            <span className="am-text">Service Requests</span>
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/admin/auditrequests" className="am-link">
            <MdFactCheck className="am-ic" />
            <span className="am-text">Audit Requests</span>
          </NavLink>
        </Nav.Item>

        <div className="am-section">Admin</div>
        <Nav.Item>
          <NavLink to="/admin/adminlogs" className="am-link">
            <MdListAlt className="am-ic" />
            <span className="am-text">Admin Logs</span>
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/admin/employees" className="am-link">
            <MdPeople className="am-ic" />
            <span className="am-text">Employees</span>
          </NavLink>
        </Nav.Item>
      </Nav>
    </div>
  );
}
