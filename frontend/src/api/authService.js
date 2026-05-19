import { ENDPOINTS } from './endpoints';
import { apiRequest, ensureCsrfCookie } from './httpClient';

export const authService = {
  async register(payload) {
    await ensureCsrfCookie();
    return apiRequest(ENDPOINTS.auth.register, {
      method: 'POST',
      body: payload,
    });
  },

  async login(credentials) {
    await ensureCsrfCookie();
    return apiRequest(ENDPOINTS.auth.login, {
      method: 'POST',
      body: credentials,
    });
  },

  verifyEmail(token) {
    return apiRequest(ENDPOINTS.auth.verifyEmail, {
      query: { token },
    });
  },

  resendVerification(email) {
    return apiRequest(ENDPOINTS.auth.resendVerification, {
      method: 'POST',
      body: { email },
    });
  },

  async forgotPassword(email) {
    await ensureCsrfCookie();
    return apiRequest(ENDPOINTS.auth.forgotPassword, {
      method: 'POST',
      body: { email },
    });
  },

  async resetPassword(payload) {
    await ensureCsrfCookie();
    return apiRequest(ENDPOINTS.auth.resetPassword, {
      method: 'POST',
      body: payload,
    });
  },

  getCurrentUser() {
    return apiRequest(ENDPOINTS.auth.me);
  },

  logout() {
    return apiRequest(ENDPOINTS.auth.logout, {
      method: 'POST',
    });
  },
};
