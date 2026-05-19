import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { ROUTES, normalizeRole } from '../utils/constants';
import { FullPageSpinner } from '../components/FullPageSpinner';

/**
 * RoleRoute — enforces that the authenticated user has one of the allowed roles.
 *
 * IMPORTANT: Always nest inside <ProtectedRoute> which handles:
 *   - Showing a spinner while isBootstrapping
 *   - Redirecting to /login if user is null
 *
 * RoleRoute only handles: wrong role → redirect to /403.
 */
export function RoleRoute({ allowedRoles = [], children }) {
  const { isBootstrapping, user } = useAuth();

  // Still bootstrapping — ProtectedRoute above us shows a spinner,
  // but we return one too to be safe (e.g. if used standalone).
  if (isBootstrapping) {
    return <FullPageSpinner />;
  }

  // Should not reach here without a user (ProtectedRoute handles that),
  // but guard defensively just in case.
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const currentRole = normalizeRole(user.role);
  const normalizedAllowedRoles = allowedRoles.map((r) => normalizeRole(r));
  const isAllowed =
    normalizedAllowedRoles.length === 0 || normalizedAllowedRoles.includes(currentRole);

  if (!isAllowed) {
    return <Navigate to="/403" replace />;
  }

  return children || <Outlet />;
}
