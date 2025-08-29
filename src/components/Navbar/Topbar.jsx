// src/components/Navbar/Topbar.js
import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

export default function Topbar() {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("adminName") || "Admin";

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("adminName");
  // reload whole app to reset App.js logic
  window.location.href = "/login";
};


  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container fluid>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/admin">
          Asset Management
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Left Nav Links */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/admin/employees">Employees</Nav.Link>
            <Nav.Link as={Link} to="/admin/assets">Assets</Nav.Link>
            <Nav.Link as={Link} to="/admin/allocations">Allocations</Nav.Link>
            <Nav.Link as={Link} to="/admin/service-requests">Service Requests</Nav.Link>
            <Nav.Link as={Link} to="/admin/audit-requests">Audit Requests</Nav.Link>
            <Nav.Link as={Link} to="/admin/admin-logs">Admin Logs</Nav.Link>
          </Nav>

          {/* Right Side Profile */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
              {adminName}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/admin/profile">Profile</Dropdown.Item>
              <Dropdown.Item as={Link} to="/admin/settings">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
