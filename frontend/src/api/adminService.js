import { ENDPOINTS } from './endpoints';
import { apiRequest } from './httpClient';

export const adminService = {
  getStats() {
    return apiRequest(ENDPOINTS.admin.stats);
  },

  listUsers(filters = {}) {
    return apiRequest(ENDPOINTS.admin.users, {
      query: filters,
    });
  },

  toggleUserBan(userId) {
    return apiRequest(ENDPOINTS.admin.toggleUserBan(userId), {
      method: 'PATCH',
    });
  },

  listJobs(filters = {}) {
    return apiRequest(ENDPOINTS.admin.jobs, {
      query: filters,
    });
  },

  forceDeleteJob(jobId) {
    return apiRequest(ENDPOINTS.admin.forceDeleteJob(jobId), {
      method: 'DELETE',
    });
  },
};
