import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  Spinner,
  Card,
} from "react-bootstrap";
import AdminLogService from "../../services/AdminLogService";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({
    adminId: "",
    action: "",
    entityAffected: "",
  });
  const [recentLogs, setRecentLogs] = useState([]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await AdminLogService.getAll();
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecent = async () => {
    try {
      const data = await AdminLogService.getRecent();
      setRecentLogs(data);
    } catch (err) {
      console.error("Failed to fetch recent logs", err);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchRecent();
  }, []);

  const handleSearch = async () => {
    try {
      const payload = {
        adminId: search.adminId ? parseInt(search.adminId) : null,
        action: search.action || null,
        entityAffected: search.entityAffected || null,
        pageNumber: 1,
        pageSize: 20,
      };
      const result = await AdminLogService.search(payload);
      setLogs(result.items || result.Items || []);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Admin Logs</h3>

      {/* Recent Logs */}
      <Card className="mb-3 p-3">
        <h6>Recent Logs:</h6>
        <ul>
          {recentLogs.map((log) => (
            <li key={log.adminLogId}>
              [{new Date(log.timestamp).toLocaleString()}]{" "}
              <b>{log.action}</b> on <i>{log.entityAffected}</i>:{" "}
              {log.description}
            </li>
          ))}
        </ul>
      </Card>

      {/* Search */}
      <Row className="mb-3">
        <Col md={3}>
          <InputGroup>
            <Form.Control
              placeholder="Admin ID"
              value={search.adminId}
              onChange={(e) => setSearch({ ...search, adminId: e.target.value })}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Control
            placeholder="Action"
            value={search.action}
            onChange={(e) => setSearch({ ...search, action: e.target.value })}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            placeholder="Entity Affected"
            value={search.entityAffected}
            onChange={(e) =>
              setSearch({ ...search, entityAffected: e.target.value })
            }
          />
        </Col>
        <Col>
          <Button onClick={handleSearch}>Search</Button>
          <Button variant="secondary" className="ms-2" onClick={fetchLogs}>
            Reset
          </Button>
        </Col>
      </Row>

      {/* Logs Table */}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Admin</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Description</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.adminLogId}>
                <td>{log.adminLogId}</td>
                <td>{log.adminId}</td>
                <td>{log.action}</td>
                <td>{log.entityAffected}</td>
                <td>{log.description}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
