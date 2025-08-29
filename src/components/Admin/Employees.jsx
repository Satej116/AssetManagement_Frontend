// src/components/Admin/Employees.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Accordion,
  Spinner,
  Modal,
  Pagination,
  Alert,
  Card,
} from "react-bootstrap";
import EmployeeService from "../../services/EmployeeService";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // Filters & pagination
  const [filters, setFilters] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    RoleId: null,
    PhoneNumber: "",
    Gender: "",
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5); // fixed for now
  const [totalRecords, setTotalRecords] = useState(0);

  // Sorting state
  const [sortBy, setSortBy] = useState("CreatedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setErr(null);
    try {
      const request = {
        ...filters,
        PageNumber: pageNumber,
        PageSize: pageSize,
        SortBy: sortBy,
        SortOrder: sortOrder,
      };
      const res = await EmployeeService.search(request);
      setEmployees(res.employees || []);
      setTotalRecords(res.totalNumberOfRecords || 0);
    } catch (e) {
      setErr(e.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [pageNumber, sortBy, sortOrder]);

  // Handle filters apply
  const handleFilter = (e) => {
    e.preventDefault();
    setPageNumber(1);
    fetchEmployees();
  };

  // Handle Add/Edit
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee.employeeId) {
        await EmployeeService.update(
          editingEmployee.employeeId,
          editingEmployee
        );
      } else {
        await EmployeeService.create(editingEmployee);
      }
      setShowModal(false);
      fetchEmployees();
    } catch (e) {
      alert(e.message || "Error saving employee");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      await EmployeeService.delete(id);
      fetchEmployees();
    } catch (e) {
      alert("Delete failed");
    }
  };

  // Pagination UI
  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="p-3">
      <h2>Employees</h2>

      {err && <Alert variant="danger">{err}</Alert>}

      {/* Filters */}
      <Accordion className="mb-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Advanced Filters</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleFilter}>
              <Row className="mb-2">
                <Col>
                  <Form.Control
                    placeholder="First Name"
                    value={filters.FirstName}
                    onChange={(e) =>
                      setFilters({ ...filters, FirstName: e.target.value })
                    }
                  />
                </Col>
                <Col>
                  <Form.Control
                    placeholder="Last Name"
                    value={filters.LastName}
                    onChange={(e) =>
                      setFilters({ ...filters, LastName: e.target.value })
                    }
                  />
                </Col>
                <Col>
                  <Form.Control
                    placeholder="Email"
                    value={filters.Email}
                    onChange={(e) =>
                      setFilters({ ...filters, Email: e.target.value })
                    }
                  />
                </Col>
              </Row>

              <Row className="mb-2">
                <Col>
                  <Form.Control
                    placeholder="Phone Number"
                    value={filters.PhoneNumber}
                    onChange={(e) =>
                      setFilters({ ...filters, PhoneNumber: e.target.value })
                    }
                  />
                </Col>
                <Col>
                  <Form.Select
                    value={filters.Gender}
                    onChange={(e) =>
                      setFilters({ ...filters, Gender: e.target.value })
                    }
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Control
                    placeholder="RoleId"
                    type="number"
                    value={filters.RoleId ?? ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        RoleId: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                  />
                </Col>
                <Col>
                  <Button type="submit" variant="primary">
                    Apply
                  </Button>
                </Col>
              </Row>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Sorting Controls */}
      <Card className="mb-3 p-2">
        <Row>
          <Col md={4}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="FirstName">First Name</option>
              <option value="LastName">Last Name</option>
              <option value="Email">Email</option>
              <option value="CreatedAt">Created At</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Button variant="secondary" onClick={() => fetchEmployees()}>
              Apply Sorting
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.employeeId}>
                <td>{e.firstName}</td>
                <td>{e.lastName}</td>
                <td>{e.email}</td>
                <td>{e.phoneNumber}</td>
                <td>{e.gender}</td>
                <td>{e.address}</td>
                <td>{e.roleName}</td>
                <td>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingEmployee(e);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(e.employeeId)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Pagination */}
      <Pagination>
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item
            key={idx}
            active={idx + 1 === pageNumber}
            onClick={() => setPageNumber(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Add Button */}
      <Button
        onClick={() => {
          setEditingEmployee({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            gender: "",
            address: "",
            roleId: "",
          });
          setShowModal(true);
        }}
      >
        Add Employee
      </Button>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingEmployee?.employeeId ? "Edit Employee" : "Add Employee"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-2">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                required
                value={editingEmployee?.firstName || ""}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    firstName: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                required
                value={editingEmployee?.lastName || ""}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    lastName: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={editingEmployee?.email || ""}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    email: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                pattern="[0-9]{10}"
                required
                value={editingEmployee?.phoneNumber || ""}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    phoneNumber: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                required
                value={editingEmployee?.gender || ""}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    gender: e.target.value,
                  })
                }
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={editingEmployee?.address || ""}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    address: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Role ID</Form.Label>
              <Form.Control
                required
                type="number"
                value={editingEmployee?.roleId || ""}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    roleId: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Button type="submit" variant="success">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
