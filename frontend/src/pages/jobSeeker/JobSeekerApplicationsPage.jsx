import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export default function JobSeekerApplicationsPage() {
  return <Navigate to={`${ROUTES.SEEKER_PROFILE}#applications`} replace />;
}
