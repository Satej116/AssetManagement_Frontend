import api from "../api/axios";

const AuditRequestService = {
  // CRUD
  getAll: () => api.get("/auditrequests").then((r) => r.data),

  get: (id) => api.get(`/auditrequests/${id}`).then((r) => r.data),

  create: (payload) => api.post("/auditrequests", payload).then((r) => r.data),

  update: (id, payload) =>
    api.put(`/auditrequests/${id}`, payload).then((r) => r.data),

  remove: (id) => api.delete(`/auditrequests/${id}`).then((r) => r.data),

  // Extra endpoints
  getByEmployee: (employeeId) =>
    api.get(`/auditrequests/employee/${employeeId}`).then((r) => r.data),

  getOngoingCount: () =>
    api.get("/auditrequests/ongoing/count").then((r) => r.data),

  search: (payload) =>
    api.post("/auditrequests/search", payload).then((r) => r.data),
};

export default AuditRequestService;
