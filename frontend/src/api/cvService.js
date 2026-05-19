import { ENDPOINTS } from './endpoints';
import { apiRequest } from './httpClient';

export const cvService = {
  uploadCv(file) {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest(ENDPOINTS.cv.upload, {
      method: 'POST',
      body: formData,
      isFormData: true,
    });
  },

  getCvStatus() {
    return apiRequest(ENDPOINTS.cv.status);
  },

  getParsedCv() {
    return apiRequest(ENDPOINTS.cv.parsed);
  },

  updateParsedCv(payload) {
    return apiRequest(ENDPOINTS.cv.parsed, {
      method: 'PUT',
      body: payload,
    });
  },
};
