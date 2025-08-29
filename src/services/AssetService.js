// src/services/AssetService.js
import api from "../api/axios";

const base = "/assets";  // matches http://localhost:5115/api/Assets

const AssetService = {
  getAll: async () => {
    const { data } = await api.get(base);
    return data;
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

  remove: async (id) => {
    const { data } = await api.delete(`${base}/${id}`);
    return data;
  },

  search: async (request) => {
    const { data } = await api.post(`${base}/search`, request);
    return data;
  },

  getAllocatedCount: async () => {
    const { data } = await api.get(`${base}/allocated/count`);
    return data;
  },

  // ✅ New method
  getByCategory: async () => {
    const { data } = await api.get(`${base}/byCategory`);
    return data;
  }, 
  
  getStatuses: async () => {
  const { data } = await api.get("/Assets/statuses");
  return data;
  }
};

export default AssetService;
