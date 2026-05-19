import { ENDPOINTS } from './endpoints';
import { apiRequest } from './httpClient';

export const applicationsService = {
  applyToJob(jobId, payload = {}) {
    return apiRequest(ENDPOINTS.applications.create, {
      method: 'POST',
      body: {
        job_id: jobId,
        ...payload,
      },
    });
  },

  listApplications(filters = {}) {
    return apiRequest(ENDPOINTS.applications.list, {
      query: filters,
    });
  },

  getApplication(applicationId) {
    return apiRequest(ENDPOINTS.applications.detail(applicationId));
  },
};
