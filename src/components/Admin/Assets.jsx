// src/components/Admin/Assets.jsx
import React, { useEffect, useState } from "react";
import {
  Table, Button, Form, Row, Col, Accordion,
  Spinner, Modal, Pagination, Alert
} from "react-bootstrap";
import AssetService from "../../services/AssetService";
import AssetCategoryService from "../../services/AssetCategoryService";
import AssetStatusService from "../../services/AssetStatusService";

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  

  // filters + pagination
  const [filters, setFilters] = useState({
    AssetName: "",
    AssetModel: "",
    CategoryId: null,
    StatusId: null,
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);

  // sorting
  const [sortBy, setSortBy] = useState("AssetName");
  const [sortOrder, setSortOrder] = useState("asc");

  // modal
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const fetchAssets = async () => {
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
      const res = await AssetService.search(request);
      setAssets(res.items || []);
      setTotalRecords(res.totalCount || 0);
    } catch (e) {
      setErr(e.message || "Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  const fetchLookups = async () => {
    const cats = await AssetCategoryService.getAll();
    setCategories(cats);
    const sts = await AssetStatusService.getAll();
    setStatuses(sts);
  };

  useEffect(() => {
    fetchAssets();
  }, [pageNumber, sortBy, sortOrder]);

  useEffect(() => {
    fetchLookups();
  }, []);

  // sort handler
  const handleSort = (col) => {
    if (sortBy === col) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortOrder("asc");
    }
  };

  // filter handler
  const handleFilter = (e) => {
    e.preventDefault();
    setPageNumber(1);
    fetchAssets();
  };

  // save
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingAsset.assetId) {
        await AssetService.update(editingAsset.assetId, editingAsset);
      } else {
        await AssetService.create(editingAsset);
      }
      setShowModal(false);
      fetchAssets();
    } catch (err) {
      alert(err.message || "Error saving asset");
    }
  };

  // delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this asset?")) return;
    try {
      await AssetService.remove(id);
      fetchAssets();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="p-3">
      <h2>Assets</h2>
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
                    placeholder="Asset Name"
                    value={filters.AssetName}
                    onChange={(e) => setFilters({ ...filters, AssetName: e.target.value })}
                  />
                </Col>
                <Col>
                  <Form.Control
                    placeholder="Asset Model"
                    value={filters.AssetModel}
                    onChange={(e) => setFilters({ ...filters, AssetModel: e.target.value })}
                  />
                </Col>
                <Col>
                  <Form.Select
                    value={filters.CategoryId || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        CategoryId: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.categoryName}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Select
                    value={filters.StatusId || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        StatusId: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                  >
                    <option value="">Select Status</option>
                    {statuses.map((s) => (
                      <option key={s.statusId} value={s.statusId}>
                        {s.statusName}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Button type="submit">Apply</Button>
                </Col>
              </Row>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Table */}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort("AssetName")}>Asset Name</th>
              <th onClick={() => handleSort("AssetModel")}>Model</th>
              <th onClick={() => handleSort("CategoryName")}>Category</th>
              <th onClick={() => handleSort("StatusName")}>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a.assetId}>
                <td>{a.assetName}</td>
                <td>{a.assetModel}</td>
                <td>{a.categoryName}</td>
                <td>{a.statusName}</td>
                <td>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingAsset(a);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(a.assetId)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {assets.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center">
                  No assets found
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

      {/* Add button */}
      <Button
        onClick={() => {
          setEditingAsset({
            assetName: "",
            assetModel: "",
            categoryId: "",
            statusId: "",
          });
          setShowModal(true);
        }}
      >
        Add Asset
      </Button>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingAsset?.assetId ? "Edit Asset" : "Add Asset"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-2">
              <Form.Label>Asset Name</Form.Label>
              <Form.Control
                required
                value={editingAsset?.assetName || ""}
                onChange={(e) => setEditingAsset({ ...editingAsset, assetName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Model</Form.Label>
              <Form.Control
                required
                value={editingAsset?.assetModel || ""}
                onChange={(e) => setEditingAsset({ ...editingAsset, assetModel: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Category</Form.Label>
              <Form.Select
                required
                value={editingAsset?.categoryId || ""}
                onChange={(e) =>
                  setEditingAsset({ ...editingAsset, categoryId: parseInt(e.target.value) })
                }
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                required
                value={editingAsset?.statusId || ""}
                onChange={(e) =>
                  setEditingAsset({ ...editingAsset, statusId: parseInt(e.target.value) })
                }
              >
                <option value="">Select Status</option>
                {statuses.map((s) => (
                  <option key={s.statusId} value={s.statusId}>
                    {s.statusName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button type="submit" variant="success">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
