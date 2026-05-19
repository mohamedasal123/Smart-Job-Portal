const DEFAULT_API_BASE_URL     = 'http://127.0.0.1:8000/api';
const DEFAULT_BACKEND_BASE_URL  = 'http://127.0.0.1:8000';

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name   = 'ApiError';
    this.status = status;
    this.data   = data;
  }
}

export const API_BASE_URL     = import.meta.env.VITE_API_BASE_URL     || DEFAULT_API_BASE_URL;
export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || DEFAULT_BACKEND_BASE_URL;

const getCookie = (name) => {
  if (typeof document === 'undefined') return null;

  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null;
};

const getSanctumUrl = () => {
  if (import.meta.env.VITE_CSRF_URL) return import.meta.env.VITE_CSRF_URL;
  return `${BACKEND_BASE_URL.replace(/\/$/, '')}/sanctum/csrf-cookie`;
};

export const ensureCsrfCookie = async () => {
  const response = await fetch(getSanctumUrl(), {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });

  if (!response.ok) {
    throw new ApiError('Could not initialize CSRF protection.', {
      status: response.status,
      data: await parseResponse(response),
    });
  }
};

const buildUrl = (path, query) => {
  const url = new URL(`${API_BASE_URL.replace(/\/$/, '')}${path}`);

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  if (
    contentType.includes('application/pdf') ||
    contentType.includes('application/octet-stream')
  ) {
    return response.blob();
  }

  const text = await response.text();
  return text || null;
};

/**
 * Core HTTP helper.
 * Always resolves the raw server response object so callers can unwrap
 * `response.data.data` themselves (Laravel envelope pattern).
 */
export const apiRequest = async (path, options = {}) => {
  const {
    method        = 'GET',
    body,
    query,
    headers,
    isFormData    = body instanceof FormData,
    parseAs       = 'auto',
  } = options;

  const requestHeaders = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...headers,
  };

  if (!isFormData && body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const unsafeMethod = !['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase());
  if (unsafeMethod && !getCookie('XSRF-TOKEN')) {
    await ensureCsrfCookie();
  }

  const xsrfToken = getCookie('XSRF-TOKEN');
  if (xsrfToken) {
    requestHeaders['X-XSRF-TOKEN'] = xsrfToken;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    credentials: 'include',
    headers: requestHeaders,
    body: isFormData
      ? body
      : body !== undefined
      ? JSON.stringify(body)
      : undefined,
  });

  const data = parseAs === 'raw' ? response : await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(data?.message || 'Request failed', {
      status: response.status,
      data,
    });
  }

  return data;
};
