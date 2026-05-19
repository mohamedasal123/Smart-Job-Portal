import { ENDPOINTS } from './endpoints';
import { apiRequest } from './httpClient';

export const profileService = {
  getProfile() {
    return apiRequest(ENDPOINTS.profile.me);
  },

  updateProfile(payload) {
    return apiRequest(ENDPOINTS.profile.me, {
      method: 'PUT',
      body: payload,
    });
  },
};
