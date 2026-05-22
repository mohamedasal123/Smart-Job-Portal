export const normalizeApiError = (error) => {
  if (!error.response) {
    if (error.request) {
      return 'Unable to connect to the server. Please check backend API.';
    }
    return error.message || 'An unexpected error occurred.';
  }

  const { status, data } = error.response;
  const backendMessage = data?.message;
  const requestUrl = error.config?.url || '';

  if (status === 422) {
    // Laravel validation errors: data.errors is an object with arrays of strings
    if (data.errors) {
      const firstKey = Object.keys(data.errors)[0];
      return data.errors[firstKey][0];
    }
    return backendMessage || 'Validation failed.';
  }

  if (status === 401) {
    return backendMessage || 'Invalid email or password.';
  }

  if (status === 403) {
    return backendMessage || 'Forbidden. You do not have access to this resource.';
  }

  if (status === 419) {
    return backendMessage || 'Session expired. Please refresh the page and try again.';
  }

  if (status >= 500) {
    if (requestUrl.includes('/sanctum/csrf-cookie')) {
      return 'Could not start a login session. Make sure the backend and database are running, then try again.';
    }

    return backendMessage || 'Server error. Please try again later.';
  }

  return backendMessage || 'An unexpected error occurred.';
};
