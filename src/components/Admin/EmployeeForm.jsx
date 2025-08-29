// src/components/Admin/EmployeeForm.jsx
import React, { useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col, Spinner } from "react-bootstrap";

export default function EmployeeForm({ show, onHide, onSubmit, initial, submitting }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "Male",
    roleId: "",
    address: "",
    isDeleted: false, // false = Active
  });

  useEffect(() => {
    if (initial) {
      setForm({
        firstName: initial.firstName ?? "",
        lastName: initial.lastName ?? "",
        email: initial.email ?? "",
        phoneNumber: initial.phoneNumber ?? "",
        gender: initial.gender ?? "Male",
        roleId: initial.roleId ?? "",
        address: initial.address ?? "",
        isDeleted: initial.isDeleted ?? false,
      });
    } else {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gender: "Male",
        roleId: "",
        address: "",
        isDeleted: false,
      });
    }
  }, [initial, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{initial ? "Edit Employee" : "Add Employee"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control name="firstName" value={form.firstName} onChange={handleChange} required />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control name="lastName" value={form.lastName} onChange={handleChange} required />
            </Col>
          </Row>

          <div className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
          </div>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" value={form.gender} onChange={handleChange}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Form.Select>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Role Id</Form.Label>
              <Form.Control name="roleId" value={form.roleId} onChange={handleChange} />
            </Col>
          </Row>

          <div className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control as="textarea" rows={2} name="address" value={form.address} onChange={handleChange} />
          </div>

          <Form.Check
            type="checkbox"
            label="Mark as Deleted (Inactive)"
            name="isDeleted"
            checked={form.isDeleted}
            onChange={handleChange}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? <Spinner size="sm" /> : initial ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
