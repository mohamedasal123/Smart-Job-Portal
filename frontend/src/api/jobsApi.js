import { api, backend } from './axios';

/** Return Laravel envelope: { success, data, message, errors } */
const unwrap = (response) => response.data;

export const jobsApi = {
  /**
   * Public (unauthenticated) job listing
   */
  getPublicJobs(params = {}) {
    return backend.get('/api/public/jobs', { params }).then(unwrap);
  },

  /**
   * Public (unauthenticated) job detail
   */
  getPublicJob(jobId) {
    return backend.get(`/api/public/jobs/${jobId}`).then(unwrap);
  },

  /**
   * Authenticated job listing
   */
  getJobs(params = {}) {
    return api.get('/jobs', { params }).then(unwrap);
  },

  /**
   * Authenticated job detail
   */
  getJob(jobId) {
    return api.get(`/jobs/${jobId}`).then(unwrap);
  },

  /**
   * AI-recommended jobs
   */
  getRecommendedJobs() {
    return api.get('/seeker/jobs/recommended').then(unwrap);
  }
};
