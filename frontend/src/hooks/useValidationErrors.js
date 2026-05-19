import { useState, useCallback } from 'react';
import { ApiError } from '../api/httpClient';

export function useValidationErrors() {
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleApiError = useCallback((error) => {
    if (error instanceof ApiError && error.status === 422) {
      // Laravel validation errors come in response.data.errors
      const validationErrors = error.data?.errors || {};
      const formattedErrors = {};
      
      // Laravel returns arrays for each field: { email: ["The email field is required."] }
      Object.keys(validationErrors).forEach((key) => {
        formattedErrors[key] = Array.isArray(validationErrors[key]) 
          ? validationErrors[key][0] 
          : validationErrors[key];
      });
      
      setErrors(formattedErrors);
      setServerError(error.data?.message || 'Please fix the validation errors.');
    } else {
      setServerError(error?.message || 'An unexpected error occurred. Please try again.');
    }
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setServerError('');
  }, []);

  const setFieldError = useCallback((field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  return {
    errors,
    serverError,
    setErrors,
    setServerError,
    handleApiError,
    clearErrors,
    setFieldError,
  };
}
