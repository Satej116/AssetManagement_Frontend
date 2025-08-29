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
  Card,
} from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import AuditRequestService from "../../services/AuditRequestService";

export default function AuditRequests() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState({
    assetId: "",
    employeeId: "",
    statusId: "",
  });
  const [ongoingCount, setOngoingCount] = useState(0);

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const data = await AuditRequestService.getAll();
      setAudits(data);
    } catch (err) {
      console.error("Failed to fetch audit requests", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOngoingCount = async () => {
    try {
      const count = await AuditRequestService.getOngoingCount();
      setOngoingCount(count);
    } catch (err) {
      console.error("Failed to fetch ongoing audits count", err);
    }
  };

  useEffect(() => {
    fetchAudits();
    fetchOngoingCount();
  }, []);

  const handleSave = async () => {
    try {
      if (editData?.isEdit) {
        await AuditRequestService.update(editData.auditRequestId, editData);
      } else {
        await AuditRequestService.create(editData);
      }
      setShowModal(false);
      fetchAudits();
      fetchOngoingCount();
    } catch (err) {
      console.error("Save failed", err);
      alert(err.response?.data?.error || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this audit request?"))
      return;
    try {
      await AuditRequestService.remove(id);
      fetchAudits();
      fetchOngoingCount();
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
      const result = await AuditRequestService.search(payload);
      setAudits(result.items || result.Items || []);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  // Chart data: group by status
  const statusData = [
    {
      name: "Ongoing",
      value: audits.filter((a) => a.statusId === 1).length,
    },
    {
      name: "Verified",
      value: audits.filter((a) => a.statusId === 2).length,
    },
    {
      name: "Rejected",
      value: audits.filter((a) => a.statusId === 3).length,
    },
  ];

  const COLORS = ["#007bff", "#28a745", "#dc3545"];

  return (
    <div className="container mt-4">
      <h3>Audit Requests</h3>

      {/* Ongoing count */}
      <Card className="mb-3 p-3">
        <h6>Ongoing Audits: {ongoingCount}</h6>
      </Card>

      {/* Search */}
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
            <option value="1">Ongoing</option>
            <option value="2">Verified</option>
            <option value="3">Rejected</option>
          </Form.Select>
        </Col>
        <Col>
          <Button onClick={handleSearch}>Search</Button>
          <Button
            variant="secondary"
            className="ms-2"
            onClick={fetchAudits}
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
              <th>Status</th>
              <th>Request Date</th>
              <th>Verified Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {audits.map((a) => (
              <tr key={a.auditRequestId}>
                <td>{a.auditRequestId}</td>
                <td>{a.assetName || a.assetId}</td>
                <td>{a.employeeName || a.employeeId}</td>
                <td>{a.statusName || a.statusId}</td>
                <td>{new Date(a.requestDate).toLocaleDateString()}</td>
                <td>
                  {a.verifiedDate
                    ? new Date(a.verifiedDate).toLocaleDateString()
                    : "-"}
                </td>
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
                    onClick={() => handleDelete(a.auditRequestId)}
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
        + New Audit Request
      </Button>

      {/* Status Chart */}
      <div className="mt-4">
        <h5>Audit Requests by Status</h5>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {statusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editData?.isEdit ? "Edit Audit Request" : "New Audit Request"}
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
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={editData?.statusId || ""}
                onChange={(e) =>
                  setEditData({ ...editData, statusId: parseInt(e.target.value) })
                }
              >
                <option value="1">Ongoing</option>
                <option value="2">Verified</option>
                <option value="3">Rejected</option>
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
