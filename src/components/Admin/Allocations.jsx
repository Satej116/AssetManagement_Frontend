import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col, InputGroup, Spinner } from "react-bootstrap";
import AllocationService from "../../services/AllocationService";

export default function Allocations() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState({ assetId: "", employeeId: "" });

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const data = await AllocationService.getAll();
      setAllocations(data);
    } catch (err) {
      console.error("Failed to fetch allocations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const handleSave = async () => {
    try {
      if (editData?.isEdit) {
        await AllocationService.update(editData.assetId, editData.employeeId, editData);
      } else {
        await AllocationService.create(editData);
      }
      setShowModal(false);
      fetchAllocations();
    } catch (err) {
      console.error("Save failed", err);
      alert(err.response?.data?.error || "Save failed");
    }
  };

  const handleDelete = async (assetId, employeeId) => {
    if (!window.confirm("Are you sure you want to delete this allocation?")) return;
    try {
      await AllocationService.remove(assetId, employeeId);
      fetchAllocations();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSearch = async () => {
    try {
      const payload = {
        assetId: search.assetId ? parseInt(search.assetId) : null,
        employeeId: search.employeeId ? parseInt(search.employeeId) : null,
        pageNumber: 1,
        pageSize: 10
      };
      const result = await AllocationService.search(payload);
      setAllocations(result.items || result.Items || []);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Asset Allocations</h3>

      {/* Search Bar */}
      <Row className="mb-3">
        <Col md={3}>
          <InputGroup>
            <Form.Control
              placeholder="Asset ID"
              value={search.assetId}
              onChange={(e) => setSearch({ ...search, assetId: e.target.value })}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <InputGroup>
            <Form.Control
              placeholder="Employee ID"
              value={search.employeeId}
              onChange={(e) => setSearch({ ...search, employeeId: e.target.value })}
            />
          </InputGroup>
        </Col>
        <Col>
          <Button onClick={handleSearch}>Search</Button>
          <Button variant="secondary" className="ms-2" onClick={fetchAllocations}>
            Reset
          </Button>
        </Col>
      </Row>

      {/* Table */}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Employee ID</th>
              <th>Allocation Date</th>
              <th>Status</th>
              <th>Is Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((a, idx) => (
              <tr key={`${a.assetId}-${a.employeeId}-${idx}`}>
                <td>{a.assetId}</td>
                <td>{a.employeeId}</td>
                <td>{new Date(a.allocationDate).toLocaleDateString()}</td>
                <td>{a.status}</td>
                <td>{a.isActive ? "Yes" : "No"}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => {
                      setEditData({ ...a, isEdit: true });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(a.assetId, a.employeeId)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Button onClick={() => { setEditData({}); setShowModal(true); }}>
        + New Allocation
      </Button>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editData?.isEdit ? "Edit Allocation" : "New Allocation"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Asset ID</Form.Label>
              <Form.Control
                value={editData?.assetId || ""}
                onChange={(e) => setEditData({ ...editData, assetId: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Employee ID</Form.Label>
              <Form.Control
                value={editData?.employeeId || ""}
                onChange={(e) => setEditData({ ...editData, employeeId: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Control
                value={editData?.status || ""}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Active"
              checked={editData?.isActive || false}
              onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
