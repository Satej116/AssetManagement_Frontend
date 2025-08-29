// src/services/AssetCategoryService.js
import api from "../api/axios";

const base = "/assetcategories";

const AssetCategoryService = {
  getAll: async () => {
    const { data } = await api.get(base);
    return data; // array of AssetCategoryDTO
  },
};

export default AssetCategoryService;
