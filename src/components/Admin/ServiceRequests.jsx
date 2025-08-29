import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ServiceRequestService from "../../services/ServiceRequestService";

export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState({
    assetId: "",
    employeeId: "",
    statusId: "",
  });
  const [monthlyData, setMonthlyData] = useState([]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await ServiceRequestService.getAll();
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch service requests", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthly = async () => {
    try {
      const data = await ServiceRequestService.getMonthlyRequests();
      setMonthlyData(data);
    } catch (err) {
      console.error("Failed to fetch monthly requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchMonthly();
  }, []);

  const handleSave = async () => {
    try {
      if (editData?.isEdit) {
        await ServiceRequestService.update(editData.serviceRequestId, editData);
      } else {
        await ServiceRequestService.create(editData);
      }
      setShowModal(false);
      fetchRequests();
    } catch (err) {
      console.error("Save failed", err);
      alert(err.response?.data?.error || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service request?"))
      return;
    try {
      await ServiceRequestService.remove(id);
      fetchRequests();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSearch = async () => {
    try {
      const payload = {
        assetId: search.assetId ? parseInt(search.assetId) : null,
        employeeId: search.employeeId ? parseInt(search.employeeId) : null,
        statusId: search.statusId ? parseInt(search.statusId) : null,
        pageNumber: 1,
        pageSize: 10,
      };
      const result = await ServiceRequestService.search(payload);
      setRequests(result.items || result.Items || []);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Service Requests</h3>

      {/* Search Bar */}
      <Row className="mb-3">
        <Col md={3}>
          <InputGroup>
            <Form.Control
              placeholder="Asset ID"
              value={search.assetId}
              onChange={(e) =>
                setSearch({ ...search, assetId: e.target.value })
              }
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <InputGroup>
            <Form.Control
              placeholder="Employee ID"
              value={search.employeeId}
              onChange={(e) =>
                setSearch({ ...search, employeeId: e.target.value })
              }
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={search.statusId}
            onChange={(e) =>
              setSearch({ ...search, statusId: e.target.value })
            }
          >
            <option value="">Select Status</option>
            <option value="1">Pending</option>
            <option value="2">In Progress</option>
            <option value="3">Resolved</option>
            <option value="4">Rejected</option>
          </Form.Select>
        </Col>
        <Col>
          <Button onClick={handleSearch}>Search</Button>
          <Button
            variant="secondary"
            className="ms-2"
            onClick={fetchRequests}
          >
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
              <th>ID</th>
              <th>Asset</th>
              <th>Employee</th>
              <th>Issue Type</th>
              <th>Description</th>
              <th>Status</th>
              <th>Request Date</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.serviceRequestId}>
                <td>{r.serviceRequestId}</td>
                <td>{r.assetName || r.assetId}</td>
                <td>{r.employeeName || r.employeeId}</td>
                <td>{r.issueType}</td>
                <td>{r.description}</td>
                <td>{r.statusName || r.statusId}</td>
                <td>{new Date(r.requestDate).toLocaleDateString()}</td>
                <td>{new Date(r.updatedAt).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => {
                      setEditData({ ...r, isEdit: true });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(r.serviceRequestId)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Button
        onClick={() => {
          setEditData({});
          setShowModal(true);
        }}
      >
        + New Request
      </Button>

      {/* Monthly Chart */}
      <div className="mt-4">
        <h5>Monthly Requests</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#007bff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editData?.isEdit ? "Edit Service Request" : "New Service Request"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Asset ID</Form.Label>
              <Form.Control
                value={editData?.assetId || ""}
                onChange={(e) =>
                  setEditData({ ...editData, assetId: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Employee ID</Form.Label>
              <Form.Control
                value={editData?.employeeId || ""}
                onChange={(e) =>
                  setEditData({ ...editData, employeeId: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Issue Type</Form.Label>
              <Form.Control
                value={editData?.issueType || ""}
                onChange={(e) =>
                  setEditData({ ...editData, issueType: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editData?.description || ""}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={editData?.statusId || ""}
                onChange={(e) =>
                  setEditData({ ...editData, statusId: e.target.value })
                }
              >
                <option value="1">Pending</option>
                <option value="2">In Progress</option>
                <option value="3">Resolved</option>
                <option value="4">Rejected</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
