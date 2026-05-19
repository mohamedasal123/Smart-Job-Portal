import { api, backend } from './axios';

/** Return Laravel envelope: { success, data, message } */
const unwrap = (response) => response.data;

export const authApi = {
  getCsrfCookie() {
    return backend.get('/sanctum/csrf-cookie');
  },

  async register(payload) {
    await this.getCsrfCookie();
    return api.post('/auth/register', payload).then(unwrap);
  },

  async login(payload) {
    await this.getCsrfCookie();
    return api.post('/auth/login', payload).then(unwrap);
  },

  logout() {
    return api.post('/auth/logout').then(unwrap);
  },

  getCurrentUser() {
    return api.get('/auth/me').then(unwrap);
  },

  verifyEmail(token) {
    return api.get('/auth/verify-email', { params: { token } }).then(unwrap);
  },

  async resendVerification(email) {
    await this.getCsrfCookie();
    return api.post('/auth/resend-verification', { email }).then(unwrap);
  },

  async forgotPassword(email) {
    await this.getCsrfCookie();
    return api.post('/auth/forgot-password', { email }).then(unwrap);
  },

  async resetPassword(payload) {
    await this.getCsrfCookie();
    return api.post('/auth/reset-password', payload).then(unwrap);
  },
};
