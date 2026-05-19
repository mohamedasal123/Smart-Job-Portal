export const normalizeApiError = (error) => {
  if (!error.response) {
    if (error.request) {
      return 'Unable to connect to the server. Please check backend API.';
    }
    return error.message || 'An unexpected error occurred.';
  }

  const { status, data } = error.response;

  if (status === 422) {
    // Laravel validation errors: data.errors is an object with arrays of strings
    if (data.errors) {
      const firstKey = Object.keys(data.errors)[0];
      return data.errors[firstKey][0];
    }
    return data.message || 'Validation failed.';
  }

  if (status === 401) {
    return 'Unauthorized. Please check your credentials.';
  }

  if (status === 403) {
    return 'Forbidden. You do not have access to this resource.';
  }

  if (status === 419) {
    return 'Session expired. Please refresh the page and try again.';
  }

  if (status >= 500) {
    return 'Server error. Please try again later.';
  }

  return data.message || 'An unexpected error occurred.';
};
