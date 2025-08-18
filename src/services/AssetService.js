import api from '../api/axios';

const AssetService = {
  list: () => api.get('/assets').then(r => r.data),
  // add more when needed: getById, create, update, delete...
};

export default AssetService;
