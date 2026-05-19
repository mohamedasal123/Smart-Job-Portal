import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { ROUTES } from '../utils/constants';
import { FullPageSpinner } from '../components/FullPageSpinner';

/**
 * ProtectedRoute
 *
 * - While bootstrapping (validating session): shows a spinner.
 * - If not authenticated after bootstrap: redirects to /login, preserving
 *   the current location so the user can be sent back after login.
 * - If authenticated but wrong role: redirects to /403.
 * - If authenticated and role matches (or no role restriction): renders children.
 *
 * @param {ReactNode} children
 * @param {string[]} [roles] - Optional list of allowed roles (e.g. ['company', 'admin'])
 */
export function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const { isBootstrapping, user } = useAuth();

  // Still verifying session with the server — never redirect prematurely
  if (isBootstrapping) {
    return <FullPageSpinner />;
  }

  // Session confirmed invalid — redirect to login with return-to state
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  // Role check — user is authenticated but doesn't have the required role
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
