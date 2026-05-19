import { ENDPOINTS } from './endpoints';
import { apiRequest } from './httpClient';

/** Unwrap Laravel envelope → payload array or object */
const unwrapData = (envelope) => envelope?.data ?? envelope;

export const jobsService = {
  /**
   * Public (unauthenticated) job listing — /public/jobs
   * Used by public browse pages and the landing page.
   */
  listPublicJobs(filters = {}) {
    return apiRequest(ENDPOINTS.publicJobs.list, { query: filters })
      .then(unwrapData);
  },

  /**
   * Public job detail — /public/jobs/:id
   */
  getPublicJob(jobId) {
    return apiRequest(ENDPOINTS.publicJobs.detail(jobId)).then(unwrapData);
  },

  /**
   * Authenticated job listing — /jobs
   * Used by seeker job-browse pages when the user is logged in.
   */
  listJobs(filters = {}) {
    return apiRequest(ENDPOINTS.jobs.list, { query: filters }).then(unwrapData);
  },

  /**
   * Authenticated job detail — /jobs/:id
   */
  getJob(jobId) {
    return apiRequest(ENDPOINTS.jobs.detail(jobId)).then(unwrapData);
  },

  /**
   * AI-recommended jobs — /jobs/recommended  (requires cv.uploaded middleware)
   */
  getRecommendedJobs() {
    return apiRequest(ENDPOINTS.jobs.recommended).then(unwrapData);
  },
};
