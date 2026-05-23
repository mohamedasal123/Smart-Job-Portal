import { api } from './axios';

/** Unwrap Axios + Laravel + Resource envelopes until the actual payload. */
const unwrap = (response) => {
  let payload = response?.data ?? response;

  while (
    payload &&
    typeof payload === 'object' &&
    !Array.isArray(payload) &&
    'data' in payload &&
    Object.keys(payload).every((key) => ['success', 'data', 'message', 'errors', 'links', 'meta'].includes(key))
  ) {
    payload = payload.data;
  }

  return payload;
};

export const companyApi = {
  getCompanyProfile() {
    return api.get('/company/profile').then(unwrap);
  },

  updateCompanyProfile(payload) {
    return api.put('/company/profile', payload).then(unwrap);
  },

  uploadCompanyLogo(file) {
    const formData = new FormData();
    formData.append('logo', file);
    return api.post('/company/profile/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(unwrap);
  },

  getCompanyJobs(params = {}) {
    return api.get('/company/jobs', { params }).then(unwrap);
  },

  getCompanyJobById(id) {
    return api.get(`/company/jobs/${encodeURIComponent(id)}`).then(unwrap);
  },

  createCompanyJob(payload) {
    return api.post('/company/jobs', payload).then(unwrap);
  },

  updateCompanyJob(id, payload) {
    return api.put(`/company/jobs/${encodeURIComponent(id)}`, payload).then(unwrap);
  },

  deleteCompanyJob(id) {
    return api.delete(`/company/jobs/${encodeURIComponent(id)}`).then(unwrap);
  },

  toggleCompanyJob(id) {
    return api.patch(`/company/jobs/${encodeURIComponent(id)}/toggle`).then(unwrap);
  },

  getApplicantsByJob(jobId, params = {}) {
    return api.get(`/company/jobs/${encodeURIComponent(jobId)}/applicants`, { params }).then(unwrap);
  },

  getApplicantById(applicationId) {
    return api.get(`/company/applicants/${encodeURIComponent(applicationId)}`).then(unwrap);
  },

  updateApplicantStatus(applicationId, status) {
    return api.patch(`/company/applicants/${encodeURIComponent(applicationId)}/status`, { status }).then(unwrap);
  },

  getApplicantCV(applicationId) {
    return api.get(`/company/applicants/${encodeURIComponent(applicationId)}/cv`, {
      responseType: 'blob',
    });
  },

  getDashboard() {
    return api.get('/company/dashboard').then(unwrap);
  },

  verifyPassword(password) {
    return api.post('/company/verify-password', { password }).then(unwrap);
  },

  updateSettings(payload) {
    return api.put('/company/settings', payload).then(unwrap);
  },
};
