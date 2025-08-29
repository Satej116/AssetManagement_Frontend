import api from '../api/axios';

const AllocationService = {
  // GET all allocations
  getAll: () => api.get('/allocations').then(r => r.data),

  // GET by composite key (assetId + employeeId)
  get: (assetId, employeeId) =>
    api.get(`/allocations/asset/${assetId}/employee/${employeeId}`).then(r => r.data),

  // CREATE new allocation
  create: (allocation) =>
    api.post('/allocations', allocation).then(r => r.data),

  // UPDATE allocation
  update: (assetId, employeeId, allocation) =>
    api.put(`/allocations/asset/${assetId}/employee/${employeeId}`, allocation).then(r => r.data),

  // DELETE allocation
  remove: (assetId, employeeId) =>
    api.delete(`/allocations/asset/${assetId}/employee/${employeeId}`).then(r => r.data),

  // SEARCH with pagination
  search: (payload) =>
    api.post('/allocations/search', payload).then(r => r.data),
};

export default AllocationService;
