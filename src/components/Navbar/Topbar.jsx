import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { clearToken, parseUser, getToken } from '../../utils/tokenHelper';

export default function Topbar() {
  const user = parseUser(getToken());
  const onLogout = () => { clearToken(); window.location.href = '/login'; };

  return (
    <Navbar bg="light" expand="lg" className="mb-3">
      <Container fluid>
        <Navbar.Brand>Asset Management</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link disabled>{user?.username ?? ''} ({user?.role ?? ''})</Nav.Link>
            <Nav.Link onClick={onLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
