import { ENDPOINTS } from './endpoints';
import { apiRequest } from './httpClient';

export const companyService = {
  listPublicCompanies(filters = {}) {
    return apiRequest(ENDPOINTS.publicCompanies.list, { query: filters })
      .then(res => res?.data ?? res);
  },

  getPublicCompany(companyId) {
    return apiRequest(ENDPOINTS.publicCompanies.detail(companyId))
      .then(res => res?.data ?? res);
  },

  getProfile() {
    return apiRequest(ENDPOINTS.company.profile);
  },

  updateProfile(payload) {
    return apiRequest(ENDPOINTS.company.profile, {
      method: 'PUT',
      body: payload,
    });
  },

  uploadLogo(file) {
    const formData = new FormData();
    formData.append('logo', file);

    return apiRequest(ENDPOINTS.company.logo, {
      method: 'POST',
      body: formData,
      isFormData: true,
    });
  },

  listJobs(filters = {}) {
    return apiRequest(ENDPOINTS.company.jobs, {
      query: filters,
    });
  },

  createJob(payload) {
    return apiRequest(ENDPOINTS.company.jobs, {
      method: 'POST',
      body: payload,
    });
  },

  getJob(jobId) {
    return apiRequest(ENDPOINTS.company.jobDetail(jobId));
  },

  updateJob(jobId, payload) {
    return apiRequest(ENDPOINTS.company.jobDetail(jobId), {
      method: 'PUT',
      body: payload,
    });
  },

  toggleJob(jobId) {
    return apiRequest(ENDPOINTS.company.toggleJob(jobId), {
      method: 'PATCH',
    });
  },

  deleteJob(jobId) {
    return apiRequest(ENDPOINTS.company.jobDetail(jobId), {
      method: 'DELETE',
    });
  },

  listJobApplicants(jobId, filters = {}) {
    return apiRequest(ENDPOINTS.company.jobApplicants(jobId), {
      query: filters,
    });
  },

  getApplicant(applicationId) {
    return apiRequest(ENDPOINTS.company.applicantDetail(applicationId));
  },

  downloadApplicantCv(applicationId) {
    return apiRequest(ENDPOINTS.company.applicantCv(applicationId));
  },

  updateApplicantStatus(applicationId, payload) {
    return apiRequest(ENDPOINTS.company.applicantStatus(applicationId), {
      method: 'PATCH',
      body: payload,
    });
  },
};
