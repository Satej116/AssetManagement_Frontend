import api from "../api/axios";

const ServiceRequestService = {
  
  // CRUD
  getAll: () => api.get("/servicerequests").then((r) => r.data),

  get: (id) => api.get(`/servicerequests/${id}`).then((r) => r.data),

  create: (payload) => api.post("/servicerequests", payload).then((r) => r.data),

  update: (id, payload) =>
    api.put(`/servicerequests/${id}`, payload).then((r) => r.data),

  remove: (id) => api.delete(`/servicerequests/${id}`).then((r) => r.data),

  // Search
  search: (payload) =>
    api.post("/servicerequests/search", payload).then((r) => r.data),

  // Extra endpoints
  getByEmployee: (employeeId) =>
    api.get(`/servicerequests/employee/${employeeId}`).then((r) => r.data),

  getByAsset: (assetId) =>
    api.get(`/servicerequests/asset/${assetId}`).then((r) => r.data),

  getPendingCount: () =>
    api.get("/servicerequests/pending/count").then((r) => r.data),

  getMonthlyRequests: () =>
    api.get("/servicerequests/monthly").then((r) => r.data),
};

export default ServiceRequestService;
