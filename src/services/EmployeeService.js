// src/services/EmployeeService.js
import api from "../api/axios";

const base = "/employees"; // /api prefix already configured in axios

const EmployeeService = {
  // 🔹 Search with filters, pagination, sorting
  search: async (payload) => {
    const { data } = await api.post(`${base}/search`, payload);
    return data; // PaginatedEmployeeResponseDTO
  },

  // 🔹 Get all (simple list, without filters)
  getAll: async () => {
    const { data } = await api.get(base);
    return data; // array of EmployeeDTO
  },

  getById: async (id) => {
    const { data } = await api.get(`${base}/${id}`);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post(base, payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.put(`${base}/${id}`, payload);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`${base}/${id}`);
    return data;
  },
};

export default EmployeeService;
