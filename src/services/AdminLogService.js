import api from "../api/axios";

const base = "/adminlogs";

const AdminLogService = {
  getAll: async () => {
    const { data } = await api.get(base);
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`${base}/${id}`);
    return data;
  },
  getByAdmin: async (adminId) => {
    const { data } = await api.get(`${base}/admin/${adminId}`);
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post(base, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`${base}/${id}`);
    return data;
  },
  getRecent: async (count = 10) => {
    const { data } = await api.get(`${base}/recent`);
    return data;
  },
  search: async (payload) => {
    const { data } = await api.post(`${base}/search`, payload);
    return data;
  }
};

export default AdminLogService;
