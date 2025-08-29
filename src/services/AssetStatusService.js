// src/services/AssetStatusService.js
import api from "../api/axios";

const AssetStatusService = {
  getAll: async () => {
    const { data } = await api.get("/assets/statuses");
    // map backend {id, name} -> frontend {statusId, statusName}
    return data.map(s => ({
      statusId: s.id,
      statusName: s.name
    }));
  },
};

export default AssetStatusService;
