import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL || 'http://127.0.0.1:8000';

const getCookie = (name) => {
  if (typeof document === 'undefined') return null;

  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null;
};

const attachXsrfToken = (config) => {
  const token = getCookie('XSRF-TOKEN');
  config.headers = config.headers || {};

  if (token) {
    config.headers['X-XSRF-TOKEN'] = token;
  }

  return config;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

export const backend = axios.create({
  baseURL: BACKEND_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

api.interceptors.request.use(attachXsrfToken);
backend.interceptors.request.use(attachXsrfToken);

// ─── Global response interceptors ─────────────────────────────────────────────

const onResponseError = (error) => {
  const status = error?.response?.status;
  const url    = error?.config?.url || '';

  // 401 — session expired. Redirect to login EXCEPT for the /auth/me
  // bootstrap call (that 401 is expected when the user is not logged in
  // and is handled gracefully by AuthContext itself).
  if (status === 401 && !url.includes('/auth/me')) {
    localStorage.removeItem('user');
    if (!window.location.pathname.startsWith('/login') &&
        !window.location.pathname.startsWith('/register')) {
      window.location.href = '/login';
    }
  }

  // 404 — return a silent empty-data envelope so callers that don't
  // explicitly catch 404 simply receive an empty result instead of
  // crashing or spamming the console.
  if (status === 404) {
    return Promise.resolve({ data: { success: true, data: [], message: 'Not found' } });
  }

  return Promise.reject(error);
};

api.interceptors.response.use((r) => r, onResponseError);
backend.interceptors.response.use((r) => r, onResponseError);

export default api;
