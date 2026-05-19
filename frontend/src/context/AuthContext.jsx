import { useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';
import { getRoleRedirect, normalizeRole } from '../utils/constants';
import { AuthContext } from './authContext';

const USER_STORAGE_KEY = 'user';

const normalizeUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    role: normalizeRole(user.role),
  };
};

const readStoredUser = () => {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!storedUser) return null;

  try {
    return normalizeUser(JSON.parse(storedUser));
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export function AuthProvider({ children }) {
  // Initialize from localStorage immediately so UI doesn't flash
  const [user, setUser] = useState(() => readStoredUser());
  // Start as true — we haven't verified the session with the server yet
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const persistUser = useCallback((nextUser) => {
    const normalizedUser = normalizeUser(nextUser);
    setUser(normalizedUser);

    if (normalizedUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }

    return normalizedUser;
  }, []);

  const refreshUser = useCallback(async () => {
    const response = await authApi.getCurrentUser();
    // authApi.getCurrentUser() already calls .then(unwrap), so response = { success, data, message }
    return persistUser(response.data);
  }, [persistUser]);

  // On every mount, validate the session against the server.
  // We ALWAYS call /auth/me, regardless of localStorage, to ensure the
  // session cookie is still valid. localStorage is only used for the
  // initial render so the UI doesn't flash to "logged out" before the
  // request completes.
  useEffect(() => {
    let isMounted = true;

    authApi
      .getCurrentUser()
      .then((response) => {
        // authApi wraps with unwrap(), so response = { success, data, message }
        if (isMounted) persistUser(response.data);
      })
      .catch(() => {
        // Session invalid/expired — clear local state
        if (isMounted) persistUser(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [persistUser]);

  const login = useCallback(
    async (payload) => {
      setError(null);
      // Do NOT set isLoading(true) here — it would cause ProtectedRoute
      // to briefly see isLoading=false + user=null and redirect to /login.
      // The LoginPage manages its own local `loading` spinner instead.

      try {
        await authApi.login(payload);
        const meResponse = await authApi.getCurrentUser();
        const nextUser = persistUser(meResponse.data);

        return {
          success: true,
          redirectTo: getRoleRedirect(nextUser?.role),
        };
      } catch (requestError) {
        setError(requestError);
        throw requestError;
      }
    },
    [persistUser],
  );

  const register = useCallback(
    async (payload) => {
      setError(null);

      try {
        const response = await authApi.register(payload);
        // authApi.register() calls .then(unwrap), so response = { success, data, message }
        if (response.data) {
          persistUser(response.data);
        }
        return response;
      } catch (requestError) {
        setError(requestError);
        throw requestError;
      }
    },
    [persistUser],
  );

  const logout = useCallback(async () => {
    setError(null);

    try {
      await authApi.logout();
    } finally {
      persistUser(null);
    }
  }, [persistUser]);

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(user),
      isBootstrapping: isLoading,
      isLoading,
      error,
      login,
      logout,
      refreshUser,
      register,
    }),
    [error, isLoading, login, logout, refreshUser, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
